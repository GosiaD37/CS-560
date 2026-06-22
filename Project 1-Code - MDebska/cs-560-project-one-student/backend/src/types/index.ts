import type { Generated, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  books: BooksTable;
  journal_entries: JournalEntriesTable;
}

export interface BooksTable {
  id: Generated<number>;
  title: string;
  author: string;
  total_pages: number;
  current_page: number;
  completion_date: string | null;
  created_at: Generated<string>;
  updated_at: Generated<string>;
}

export interface JournalEntriesTable {
  id: Generated<number>;
  book_id: number;
  page_number: number;
  entry_date: string;
  thoughts: string;
  created_at: Generated<string>;
}

export type Book = Selectable<BooksTable>;
export type NewBook = Insertable<BooksTable>;
export type BookUpdate = Updateable<BooksTable>;

export type JournalEntry = Selectable<JournalEntriesTable>;
export type NewJournalEntry = Insertable<JournalEntriesTable>;
export type JournalEntryUpdate = Updateable<JournalEntriesTable>;
