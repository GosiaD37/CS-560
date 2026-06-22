import express from 'express';
import cors from 'cors';
import { db, initializeDatabase } from './db/database.js';
import journalRouter from './routes/journal.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Read-only book endpoints
app.get('/api/books', async (_req, res) => {
  try {
    const books = await db.selectFrom('books').selectAll().execute();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await db
      .selectFrom('books')
      .selectAll()
      .where('id', '=', parseInt(req.params.id))
      .executeTakeFirst();

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

app.use('/api/journal', journalRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
