import {
  env,
  AutoModel,
  Processor,
  PreTrainedModel,
  AutoProcessor,
} from '@huggingface/transformers'
import { getGPUTier } from 'detect-gpu'
import { computed, onMounted, ref } from 'vue'

export const modelId = 'briaai/RMBG-1.4'

export const useModel = (modelId: string) => {
  const model = ref<PreTrainedModel>()
  const processor = ref<Processor>()
  const isModelLoading = ref(true)
  const isProcessorLoading = ref(true)
  const modelProgress = ref(0)
  const processorProgress = ref(0)

  onMounted(async () => {
    env.allowLocalModels = false
    env.backends.onnx.wasm!.proxy = true
    const gpuTier = await getGPUTier()
    const modelSettings: Parameters<typeof AutoModel.from_pretrained>[1] = {
      progress_callback: (progressData: any) => {
        if (progressData.progress) {
          modelProgress.value = progressData.progress
        }
        if (progressData.status && progressData.status === 'done') {
          isModelLoading.value = false
        }
      },
    }

    if (gpuTier?.fps && !gpuTier?.isMobile) {
      modelSettings.device = 'webgpu'
      modelSettings.dtype = 'fp32'
    }

    try {
      model.value = await AutoModel.from_pretrained(modelId, modelSettings)

      processor.value = await AutoProcessor.from_pretrained(modelId, {
        progress_callback: (progressData: any) => {
          if (progressData.progress) {
            processorProgress.value = progressData.progress
          }
          if (progressData.status && progressData.status === 'done') {
            isProcessorLoading.value = false
          }
        },
      })
    } catch (err) {
      console.error(err)
    }
  })

  const isLoading = computed(
    () => isModelLoading.value || isProcessorLoading.value,
  )

  return {
    model,
    processor,
    isLoading,
    isProcessorLoading,
    isModelLoading,
    modelProgress,
    processorProgress,
  }
}
