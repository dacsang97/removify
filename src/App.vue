<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'

import FileUpload from '@/components/FileUpload.vue'
import SkeletonUploader from '@/components/SkeletonUploader.vue'
import { modelId, useModel } from '@/composables/huggingface'

const { loaded } = useModel(modelId)
</script>

<template>
  <div class="app-container">
    <Transition name="fade" mode="out-in">
      <div v-if="!loaded" key="skeleton">
        <SkeletonUploader />
      </div>
      <div v-else key="content">
        <div class="container mx-auto p-4">
          <FileUpload />
        </div>
      </div>
    </Transition>
  </div>
  <Toaster />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
