<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import BookCard from '@/components/BookCard.vue'
import type { Book } from '@/types'

const router = useRouter()
const store = useBooksStore()

onMounted(() => {
  store.fetchBooks()
})

function handleBookClick(book: Book) {
  router.push({ name: 'book-detail', params: { id: book.id } })
}
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-6">My Books</h1>

    <v-progress-linear v-if="store.loading" indeterminate color="primary" class="mb-4" />

    <v-row>
      <v-col
        v-for="book in store.books"
        :key="book.id"
        cols="12"
        sm="6"
        md="4"
      >
        <BookCard
          :book="book"
          :clickable="true"
          @click="handleBookClick"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
