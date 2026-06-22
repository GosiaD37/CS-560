import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Book, JournalEntry, NewJournalEntry } from '@/types'
import { api } from '@/services/api'

export const useBooksStore = defineStore('books', () => {
  const books = ref<Book[]>([])
  const currentBook = ref<Book | null>(null)
  const journalEntries = ref<JournalEntry[]>([])
  const loading = ref(false)

  async function fetchBooks() {
    loading.value = true
    try {
      books.value = await api.getBooks()
    } finally {
      loading.value = false
    }
  }

  async function fetchBook(id: number) {
    loading.value = true
    try {
      currentBook.value = await api.getBook(id)
    } finally {
      loading.value = false
    }
  }

  async function fetchJournalEntries(bookId: number) {
    journalEntries.value = await api.getJournalEntries(bookId)
  }

  async function createJournalEntry(entry: NewJournalEntry) {
    const newEntry = await api.createJournalEntry(entry)
    journalEntries.value.unshift(newEntry)
    // Refresh the book to get updated current_page
    await fetchBook(entry.book_id)
    return newEntry
  }

  async function updateJournalEntry(id: number, entry: Partial<NewJournalEntry>, bookId: number) {
    const updated = await api.updateJournalEntry(id, entry)
    const index = journalEntries.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      journalEntries.value[index] = updated
    }
    // Refresh the book to get updated current_page
    await fetchBook(bookId)
    return updated
  }

  async function deleteJournalEntry(id: number, bookId: number) {
    await api.deleteJournalEntry(id)
    journalEntries.value = journalEntries.value.filter((e) => e.id !== id)
    // Refresh the book to get updated current_page
    await fetchBook(bookId)
  }

  return {
    books,
    currentBook,
    journalEntries,
    loading,
    fetchBooks,
    fetchBook,
    fetchJournalEntries,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
  }
})
