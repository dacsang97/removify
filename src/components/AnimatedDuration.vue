<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  startTime: number
  endTime: number | null
  status: 'loading' | 'done' | 'error'
}>()

const currentTime = ref(Date.now())
const animationId = ref<number | null>(null)

const duration = computed(() => {
  if (props.status === 'done' || props.status === 'error') {
    return props.endTime! - props.startTime
  }
  return currentTime.value - props.startTime
})

const formattedDuration = computed(() => (duration.value / 1000).toFixed(2))

const durationClass = computed(() => {
  if (duration.value < 1000) return 'text-green-500'
  if (duration.value < 3000) return 'text-yellow-500'
  return 'text-red-500'
})

const animate = () => {
  currentTime.value = Date.now()
  if (props.status === 'loading') {
    animationId.value = requestAnimationFrame(animate)
  }
}

onMounted(() => {
  animate()
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})
</script>

<template>
  <span :class="durationClass">{{ formattedDuration }}s</span>
</template>
