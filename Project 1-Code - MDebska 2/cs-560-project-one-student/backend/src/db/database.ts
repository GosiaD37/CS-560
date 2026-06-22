import { Kysely, SqliteDialect, sql } from 'kysely';
import Database from 'better-sqlite3';
import type { Database as DatabaseSchema } from '../types/index.js';

const dialect = new SqliteDialect({
  database: new Database('booktracker.db'),
});

export const db = new Kysely<DatabaseSchema>({
  dialect,
});

export async function initializeDatabase() {
  await db.schema
    .createTable('books')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('author', 'text', (col) => col.notNull())
    .addColumn('total_pages', 'integer', (col) => col.notNull())
    .addColumn('current_page', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('completion_date', 'text')
    .addColumn('created_at', 'text', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'text', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();

  await db.schema
    .createTable('journal_entries')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('book_id', 'integer', (col) =>
      col.notNull().references('books.id').onDelete('cascade')
    )
    .addColumn('page_number', 'integer', (col) => col.notNull())
    .addColumn('entry_date', 'text', (col) => col.notNull())
    .addColumn('thoughts', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}
