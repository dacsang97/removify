<script setup lang="ts">
import { BlobReader, BlobWriter, ZipWriter } from '@zip.js/zip.js'
import { Button } from '@/components//ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/toast'
import {
  ProcessedImage,
  useImageProcessing,
} from '@/composables/image-processing'

const { processedImages, isDownloadReady } = useImageProcessing()
const { toast } = useToast()

const downloadImage = (image: ProcessedImage) => {
  const link = document.createElement('a')
  link.href = image.downloadUrl
  link.download = image.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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

const copyImage = async (image: ProcessedImage) => {
  const res = await fetch(image.downloadUrl)
  const blob = await res.blob()
  navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
  toast({
    title: 'Image copied',
  })
}
</script>

<template>
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
      <TableRow v-for="(image, index) in processedImages" :key="image.filename">
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
</template>
