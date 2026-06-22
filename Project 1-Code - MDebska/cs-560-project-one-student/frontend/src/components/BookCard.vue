<script setup lang="ts">
import { computed } from 'vue'
import type { Book } from '@/types'

const props = defineProps<{
  book: Book
  clickable?: boolean
}>()

const emit = defineEmits<{
  click: [book: Book]
}>()

const progressPercentage = computed(() => {
  if (props.book.total_pages === 0) return 0
  return Math.round((props.book.current_page / props.book.total_pages) * 100)
})

const readingStatus = computed(() => {
  if (props.book.current_page === 0) {
    return 'not-started'
  } else if (props.book.current_page >= props.book.total_pages) {
    return 'completed'
  }
  return 'in-progress'
})

const statusColor = computed(() => {
  switch (readingStatus.value) {
    case 'not-started':
      return 'grey'
    case 'in-progress':
      return 'primary'
    case 'completed':
      return 'success'
    default:
      return 'grey'
  }
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleClick() {
  if (props.clickable) {
    emit('click', props.book)
  }
}
</script>

<template>
  <v-card
    :class="{ 'cursor-pointer': clickable }"
    :hover="clickable"
    height="100%"
    width="100%"
    class="d-flex flex-column"
    @click="handleClick"
  >
    <v-card-title class="text-h6 font-weight-bold">
      {{ book.title }}
    </v-card-title>

    <v-card-subtitle>
      by {{ book.author }}
    </v-card-subtitle>

    <v-card-text class="flex-grow-1">
      <div class="mb-3">
        {{ book.total_pages }} pages
      </div>

      <div v-if="readingStatus === 'not-started'" class="d-flex align-center text-grey">
        <v-icon icon="mdi-book-open-blank-variant-outline" :color="statusColor" class="mr-1" />
        <span>Not Started</span>
      </div>

      <div v-else-if="readingStatus === 'in-progress'">
        <v-progress-linear
          :model-value="progressPercentage"
          :color="statusColor"
          height="8"
          rounded
          class="my-2"
        />
        <div>{{ progressPercentage }}% complete</div>
      </div>

      <div v-else>
        <div class="d-flex align-center">
          <v-icon icon="mdi-check-circle" :color="statusColor" class="mr-1" />
          <span>Completed</span>
        </div>
        <div v-if="book.completion_date" class="text-caption">
          {{ formatDate(book.completion_date) }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
