<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/toast/use-toast'

import ImageUploader from './ImageUploader.vue'
import DirectoryUploader from './DirectoryUploader.vue'
import AnimatedDuration from './AnimatedDuration.vue'
import { ref } from 'vue'

import {
  ProcessedImage,
  useImageProcessing,
} from '@/composables/image-processing'
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js'

const { toast } = useToast()
const { processedImages, isDownloadReady, processImages } = useImageProcessing()

const files = ref<File[]>([])

const handleFilesSelected = async (files: File[]) => {
  await processImages(files)
}

const downloadImage = (image: ProcessedImage) => {
  const link = document.createElement('a')
  link.href = image.downloadUrl
  link.download = image.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const copyImage = async (image: ProcessedImage) => {
  const res = await fetch(image.downloadUrl)
  const blob = await res.blob()
  navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
  toast({
    title: 'Image copied',
  })
}

const downloadAsZip = async () => {
  const zipWriter = new ZipWriter(new BlobWriter('application/zip'))
  for (const image of processedImages.value) {
    if (image.status === 'done') {
      const response = await fetch(image.downloadUrl)
      const blob = await response.blob()
      await zipWriter.add(image.filename, new BlobReader(blob))
    }
  }
  const zipBlob = await zipWriter.close()
  const downloadUrl = URL.createObjectURL(zipBlob)
  const a = document.createElement('a')
  a.href = downloadUrl
  a.download = 'images.zip'
  a.click()
  URL.revokeObjectURL(downloadUrl)
}
</script>

<template>
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
    <Button
      variant="outline"
      class="ml-auto"
      :disabled="!isDownloadReady"
      @click="downloadAsZip"
    >
      Download as zip
    </Button>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(image, index) in processedImages"
          :key="image.filename"
        >
          <TableCell>{{ index + 1 }}</TableCell>
          <TableCell>
            <div className="w-fit h-20 preview">
              <Transition name="fade" mode="out-in">
                <img
                  :key="image.status"
                  :src="image.previewUrl"
                  alt="Preview"
                  className="h-20 object-scale-down rounded-lg"
                />
              </Transition>
            </div>
          </TableCell>
          <TableCell>
            <AnimatedDuration
              :startTime="image.startTime"
              :endTime="
                image.status !== 'loading'
                  ? image.startTime + image.duration
                  : null
              "
              :status="image.status"
            />
          </TableCell>
          <TableCell>
            <div class="flex space-x-2">
              <Button
                :disabled="image.status !== 'done'"
                @click="copyImage(image)"
              >
                Copy
              </Button>
              <Button
                :disabled="image.status !== 'done'"
                @click="downloadImage(image)"
                >Download</Button
              >
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style scoped>
.preview {
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==');
}
</style>
