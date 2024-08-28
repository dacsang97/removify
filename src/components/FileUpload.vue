<script setup lang="ts">
import { Progress } from '@/components/ui/progress'

import ImageUploader from './ImageUploader.vue'
import DirectoryUploader from './DirectoryUploader.vue'
import { ref } from 'vue'

import { useImageProcessing } from '@/composables/image-processing'
import { modelId, useModel } from '@/composables/huggingface'
import ResultTable from './ResultTable.vue'

const { isModelLoading, isProcessorLoading, modelProgress, processorProgress } =
  useModel(modelId)
const { processImages, processedImages } = useImageProcessing()

const files = ref<File[]>([])

const handleFilesSelected = async (files: File[]) => {
  await processImages(files)
}
</script>

<template>
  {{ processImages.length }}
  <div class="flex flex-col gap-4">
    <ImageUploader
      @files-selected="handleFilesSelected"
      buttonText="Choose file or drag here"
      :existingFiles="files"
    />

    <p class="text-center text-sm text-gray-500">Or upload a directory</p>

    <DirectoryUploader
      @files-selected="handleFilesSelected"
      buttonText="Choose directory or drag here"
      :existingFiles="files"
    />
    <p class="text-center text-sm text-gray-500">
      Images are not uploaded to the server, they are processed directly in your
      browser.
    </p>

    <ResultTable />

    <div class="fixed right-0 bottom-0 p-8">
      <Transition name="fade" mode="out-in">
        <div v-if="isModelLoading" class="bg-white shadow-md rounded-lg p-4">
          <div class="flex justify-between">
            <p class="text-lg font-semibold">Loading model...</p>
            <span v-if="modelProgress > 0"
              >{{ modelProgress.toFixed(2) }}%</span
            >
          </div>
          <Progress :model-value="modelProgress" />
          <p class="text-sm text-gray-500">
            Please wait while the model is being loaded.
          </p>
        </div>
      </Transition>
      <Transition name="fade" mode="out-in">
        <div
          v-if="isProcessorLoading"
          class="bg-white shadow-md rounded-lg p-4"
        >
          <div class="flex justify-between">
            <p class="text-lg font-semibold">Loading processor...</p>
            <span v-if="processorProgress > 0"
              >{{ processorProgress.toFixed(2) }}%</span
            >
          </div>
          <Progress :model-value="processorProgress" />
          <p class="text-sm text-gray-500">
            Please wait while the processor is being loaded.
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.preview {
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==');
}
</style>
