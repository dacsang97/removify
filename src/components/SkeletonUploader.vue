<template>
  <div class="skeleton-container space-y-4 p-4">
    <div class="h-12 bg-gray-200 rounded-lg w-full"></div>

    <div class="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>

    <div class="h-12 bg-gray-200 rounded-lg w-full"></div>

    <div class="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>

    <div class="h-8 bg-gray-200 rounded w-32 ml-auto"></div>

    <div class="mt-6">
      <div class="h-10 bg-gray-200 rounded-t-lg w-full"></div>

      <div class="space-y-2 mt-2">
        <div class="h-8 bg-gray-100 rounded w-full"></div>
        <div class="h-8 bg-gray-100 rounded w-full"></div>
        <div class="h-8 bg-gray-100 rounded w-full"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton-container > * {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
