import type { Book, JournalEntry, NewJournalEntry } from '@/types'

const API_BASE = 'http://localhost:3000/api'

export const api = {
  // Books (read-only)
  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${API_BASE}/books`)
    return response.json()
  },

  async getBook(id: number): Promise<Book> {
    const response = await fetch(`${API_BASE}/books/${id}`)
    return response.json()
  },

  // Journal Entries
  async getJournalEntries(bookId: number): Promise<JournalEntry[]> {
    const response = await fetch(`${API_BASE}/journal/book/${bookId}`)
    return response.json()
  },

  async createJournalEntry(entry: NewJournalEntry): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE}/journal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    return response.json()
  },

  async updateJournalEntry(id: number, entry: Partial<NewJournalEntry>): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE}/journal/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    })
    return response.json()
  },

  async deleteJournalEntry(id: number): Promise<void> {
    await fetch(`${API_BASE}/journal/${id}`, { method: 'DELETE' })
  },
}
