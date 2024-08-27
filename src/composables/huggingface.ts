import {
  env,
  AutoModel,
  Processor,
  PreTrainedModel,
  AutoProcessor,
} from '@huggingface/transformers'
import { onMounted, ref } from 'vue'

export const modelId = 'briaai/RMBG-1.4'

export const useModel = (modelId: string) => {
  const model = ref<PreTrainedModel>()
  const processor = ref<Processor>()
  const loaded = ref(false)

  onMounted(async () => {
    env.backends.onnx.wasm.proxy = false

    model.value = await AutoModel.from_pretrained(modelId, {
      device: 'webgpu',
    })

    processor.value = await AutoProcessor.from_pretrained(modelId)

    loaded.value = true
  })

  return { model, processor, loaded }
}
