<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

interface Props {
  buttonText?: string
  existingFiles?: File[]
}

withDefaults(defineProps<Props>(), {
  buttonText: 'Choose file or drag here',
  existingFiles: () => [],
})

const emit = defineEmits<{
  (e: 'files-selected', files: File[]): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const openFileDialog = () => {
  fileInput.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    emit('files-selected', newFiles)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files) {
    const newFiles = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/'),
    )
    emit('files-selected', newFiles)
  }
}
</script>

<template>
  <div class="image-uploader">
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors duration-300 ease-in-out hover:border-primary"
      :class="{ 'border-primary': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        ref="fileInput"
        @change="handleFileChange"
        accept="image/*"
        multiple
        class="hidden"
      />
      <Button class="w-full" @click="openFileDialog">
        {{ buttonText }}
      </Button>
    </div>
  </div>
</template>
