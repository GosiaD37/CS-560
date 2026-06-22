import { Router } from 'express';
import { db } from '../db/database.js';
import type { NewJournalEntry } from '../types/index.js';

const router = Router();

// Get all journal entries for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const entries = await db
      .selectFrom('journal_entries')
      .selectAll()
      .where('book_id', '=', parseInt(req.params.bookId))
      .orderBy('entry_date', 'desc')
      .execute();
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Get a single journal entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await db
      .selectFrom('journal_entries')
      .selectAll()
      .where('id', '=', parseInt(req.params.id))
      .executeTakeFirst();

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
});

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    const newEntry: NewJournalEntry = {
      book_id: req.body.book_id,
      page_number: req.body.page_number,
      entry_date: req.body.entry_date,
      thoughts: req.body.thoughts,
    };

    const result = await db
      .insertInto('journal_entries')
      .values(newEntry)
      .returning(['id'])
      .executeTakeFirstOrThrow();

    // Update book's current page if this entry's page is higher
    const book = await db
      .selectFrom('books')
      .select(['current_page', 'total_pages'])
      .where('id', '=', newEntry.book_id)
      .executeTakeFirst();

    if (book && newEntry.page_number > book.current_page) {
      const updates: { current_page: number; completion_date?: string; updated_at: string } = {
        current_page: newEntry.page_number,
        updated_at: new Date().toISOString(),
      };

      // Auto-set completion date when book is finished
      if (newEntry.page_number >= book.total_pages) {
        updates.completion_date = new Date().toISOString().split('T')[0];
        updates.current_page = book.total_pages;
      }

      await db
        .updateTable('books')
        .set(updates)
        .where('id', '=', newEntry.book_id)
        .execute();
    }

    const entry = await db
      .selectFrom('journal_entries')
      .selectAll()
      .where('id', '=', result.id)
      .executeTakeFirst();

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const existingEntry = await db
      .selectFrom('journal_entries')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!existingEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    const updates: { page_number?: number; entry_date?: string; thoughts?: string } = {};
    if (req.body.page_number !== undefined) updates.page_number = req.body.page_number;
    if (req.body.entry_date !== undefined) updates.entry_date = req.body.entry_date;
    if (req.body.thoughts !== undefined) updates.thoughts = req.body.thoughts;

    await db.updateTable('journal_entries').set(updates).where('id', '=', id).execute();

    // Update book's current page if needed
    if (updates.page_number !== undefined) {
      const book = await db
        .selectFrom('books')
        .select(['id', 'current_page', 'total_pages'])
        .where('id', '=', existingEntry.book_id)
        .executeTakeFirst();

      if (book) {
        // Find the max page from all entries for this book
        const maxPageResult = await db
          .selectFrom('journal_entries')
          .select(db.fn.max('page_number').as('max_page'))
          .where('book_id', '=', book.id)
          .executeTakeFirst();

        const maxPage = maxPageResult?.max_page ?? 0;
        const bookUpdates: { current_page: number; completion_date?: string | null; updated_at: string } = {
          current_page: maxPage,
          updated_at: new Date().toISOString(),
        };

        if (maxPage >= book.total_pages) {
          bookUpdates.completion_date = new Date().toISOString().split('T')[0];
          bookUpdates.current_page = book.total_pages;
        } else {
          bookUpdates.completion_date = null;
        }

        await db.updateTable('books').set(bookUpdates).where('id', '=', book.id).execute();
      }
    }

    const entry = await db
      .selectFrom('journal_entries')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Get the entry first to know which book to update
    const entry = await db
      .selectFrom('journal_entries')
      .select(['book_id'])
      .where('id', '=', id)
      .executeTakeFirst();

    await db.deleteFrom('journal_entries').where('id', '=', id).execute();

    // Recalculate book's current_page based on remaining entries
    if (entry) {
      const book = await db
        .selectFrom('books')
        .select(['id', 'total_pages'])
        .where('id', '=', entry.book_id)
        .executeTakeFirst();

      if (book) {
        const maxPageResult = await db
          .selectFrom('journal_entries')
          .select(db.fn.max('page_number').as('max_page'))
          .where('book_id', '=', book.id)
          .executeTakeFirst();

        const maxPage = maxPageResult?.max_page ?? 0;
        const bookUpdates: { current_page: number; completion_date?: string | null; updated_at: string } = {
          current_page: maxPage,
          updated_at: new Date().toISOString(),
        };

        // Update completion status
        if (maxPage >= book.total_pages) {
          bookUpdates.completion_date = new Date().toISOString().split('T')[0];
        } else {
          bookUpdates.completion_date = null;
        }

        await db.updateTable('books').set(bookUpdates).where('id', '=', book.id).execute();
      }
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

export default router;
