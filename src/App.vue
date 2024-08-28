<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import FileUpload from '@/components/FileUpload.vue'
</script>

<template>
  <div class="app-container">
    <div class="container mx-auto p-4">
      <FileUpload />
    </div>
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
