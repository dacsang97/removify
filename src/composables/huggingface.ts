import {
  env,
  AutoModel,
  Processor,
  PreTrainedModel,
  AutoProcessor,
} from '@huggingface/transformers'
import { getGPUTier } from 'detect-gpu'
import { onMounted, ref } from 'vue'

export const modelId = 'briaai/RMBG-1.4'

export const useModel = (modelId: string) => {
  const model = ref<PreTrainedModel>()
  const processor = ref<Processor>()
  const loaded = ref(false)

  onMounted(async () => {
    env.allowLocalModels = false
    env.backends.onnx.wasm!.proxy = true
    const gpuTier = await getGPUTier()
    const modelSettings: Parameters<typeof AutoModel.from_pretrained>[1] = {}

    if (gpuTier?.fps && !gpuTier?.isMobile) {
      modelSettings.device = 'webgpu'
      modelSettings.dtype = 'fp32'
    }

    try {
      model.value = await AutoModel.from_pretrained(modelId, modelSettings)

      processor.value = await AutoProcessor.from_pretrained(modelId)

      loaded.value = true
    } catch (err) {
      console.error(err)
    }
  })

  return { model, processor, loaded }
}
