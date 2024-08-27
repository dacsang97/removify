<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

interface Props {
  buttonText?: string
  existingFiles?: File[]
}

withDefaults(defineProps<Props>(), {
  buttonText: 'Choose directory or drag here',
  existingFiles: () => [],
})
const emit = defineEmits<{
  (e: 'files-selected', files: File[]): void
}>()

const directoryInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const openDirectoryDialog = () => {
  directoryInput.value?.click()
}

const handleDirectoryChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    emit('files-selected', newFiles)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const items = event.dataTransfer?.items
  if (items) {
    const newFiles: File[] = []
    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry()
      if (item) {
        traverseFileTree(item, newFiles)
      }
    }
  }
}

const traverseFileTree = (item: any, files: File[]) => {
  if (item.isFile) {
    item.file((file: File) => {
      files.push(file)
      emit('files-selected', files)
    })
  } else if (item.isDirectory) {
    const dirReader = item.createReader()
    dirReader.readEntries((entries: any[]) => {
      for (let i = 0; i < entries.length; i++) {
        traverseFileTree(entries[i], files)
      }
    })
  }
}
</script>

<template>
  <div class="directory-uploader">
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors duration-300 ease-in-out hover:border-primary"
      :class="{ 'border-primary': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        type="file"
        ref="directoryInput"
        @change="handleDirectoryChange"
        webkitdirectory
        directory
        class="hidden"
      />
      <Button class="w-full" @click="openDirectoryDialog">
        {{ buttonText }}
      </Button>
    </div>
  </div>
</template>
