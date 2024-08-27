import { ref, Ref } from 'vue'
import { RawImage } from '@huggingface/transformers'

import { modelId, useModel } from './huggingface'

export interface ProcessedImage {
  status: 'loading' | 'done' | 'error'
  originalSize: number
  previewUrl: string
  convertedSize: number
  startTime: number
  duration: number
  downloadUrl: string
  filename: string
  progress: number
}

export const useImageProcessing = () => {
  const processedImages: Ref<ProcessedImage[]> = ref([])
  const isProcessing = ref(false)
  const isDownloadReady = ref(false)
  const { model, processor } = useModel(modelId)

  const processImages = async (files: File[]) => {
    isProcessing.value = true
    isDownloadReady.value = false

    for (const file of files) {
      const startTime = Date.now()
      const index = processedImages.value.push({
        status: 'loading',
        originalSize: file.size,
        previewUrl: URL.createObjectURL(file),
        convertedSize: 0,
        startTime,
        duration: 0,
        downloadUrl: '',
        filename: file.name,
        progress: 0,
      })
      const row = processedImages.value[index - 1]

      try {
        // Load image
        const ri = await RawImage.fromURL(row.previewUrl)

        // Pre-process image
        const { pixel_values } = await processor.value?.(ri)

        // Predict alpha matte
        const { output } = await model.value?.({ input: pixel_values })

        const maskData = (
          await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
            ri.width,
            ri.height,
          )
        ).data

        // Create new canvas
        const canvas = document.createElement('canvas')
        canvas.width = ri.width
        canvas.height = ri.height
        const ctx = canvas.getContext('2d')

        // Draw original image output to canvas
        ctx?.drawImage(ri.toCanvas(), 0, 0)

        // Update alpha channel
        const pixelData = ctx?.getImageData(0, 0, ri.width, ri.height)!
        for (let i = 0; i < maskData.length; ++i) {
          pixelData.data[4 * i + 3] = maskData[i]
        }
        ctx?.putImageData(pixelData, 0, 0)

        const processedImageUrl = canvas.toDataURL('image/png')

        row.previewUrl = processedImageUrl
        row.downloadUrl = processedImageUrl
        row.status = 'done'
        row.duration = Date.now() - startTime
        row.convertedSize = processedImageUrl.length * 0.75 // Rough estimate of size
        row.progress = 100
      } catch (e) {
        console.error('Error processing image:', e)
        row.status = 'error'
        row.duration = Date.now() - startTime
      }
    }

    isProcessing.value = false
    isDownloadReady.value = true
  }

  return {
    processedImages,
    isProcessing,
    isDownloadReady,
    processImages,
  }
}
