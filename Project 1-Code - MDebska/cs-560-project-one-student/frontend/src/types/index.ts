export interface Book {
  id: number
  title: string
  author: string
  total_pages: number
  current_page: number
  completion_date: string | null
  created_at: string
  updated_at: string
}

export interface JournalEntry {
  id: number
  book_id: number
  page_number: number
  entry_date: string
  thoughts: string
  created_at: string
}

export interface NewJournalEntry {
  book_id: number
  page_number: number
  entry_date: string
  thoughts: string
}
