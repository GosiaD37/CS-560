import { db, initializeDatabase } from './database.js';

const books = [
  // Not Started (5 books)
  { title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', total_pages: 796, current_page: 0 },
  { title: 'War and Peace', author: 'Leo Tolstoy', total_pages: 1225, current_page: 0 },
  { title: 'Moby Dick', author: 'Herman Melville', total_pages: 635, current_page: 0 },
  { title: 'Don Quixote', author: 'Miguel de Cervantes', total_pages: 863, current_page: 0 },
  { title: 'Ulysses', author: 'James Joyce', total_pages: 730, current_page: 0 },

  // In Progress (6 books)
  { title: '1984', author: 'George Orwell', total_pages: 328, current_page: 156 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', total_pages: 279, current_page: 98 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', total_pages: 180, current_page: 45 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', total_pages: 281, current_page: 200 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', total_pages: 671, current_page: 320 },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', total_pages: 500, current_page: 125 },

  // Completed (4 books)
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', total_pages: 234, current_page: 234, completion_date: '2024-11-15' },
  { title: 'Animal Farm', author: 'George Orwell', total_pages: 112, current_page: 112, completion_date: '2024-10-22' },
  { title: 'The Old Man and the Sea', author: 'Ernest Hemingway', total_pages: 127, current_page: 127, completion_date: '2024-09-08' },
  { title: 'Of Mice and Men', author: 'John Steinbeck', total_pages: 107, current_page: 107, completion_date: '2024-08-30' },
];

const journalEntriesData: Record<string, Array<{ page_number: number; entry_date: string; thoughts: string }>> = {
  '1984': [
    { page_number: 50, entry_date: '2024-12-01', thoughts: 'The world-building is incredibly detailed and terrifying. Big Brother feels omnipresent.' },
    { page_number: 100, entry_date: '2024-12-03', thoughts: 'Winston\'s rebellion through his diary is such a small but powerful act of defiance.' },
    { page_number: 156, entry_date: '2024-12-05', thoughts: 'The relationship with Julia is developing. Curious to see where this leads.' },
  ],
  'Pride and Prejudice': [
    { page_number: 45, entry_date: '2024-11-28', thoughts: 'Elizabeth\'s wit is refreshing. The dialogue between her and Mr. Darcy is electric.' },
    { page_number: 98, entry_date: '2024-12-02', thoughts: 'The misunderstandings between Elizabeth and Darcy are frustrating but compelling.' },
  ],
  'The Great Gatsby': [
    { page_number: 25, entry_date: '2024-12-06', thoughts: 'Nick\'s narration style is interesting. The parties seem excessive.' },
    { page_number: 45, entry_date: '2024-12-08', thoughts: 'Finally meeting Gatsby. He\'s not what I expected - more mysterious and lonely.' },
  ],
  'To Kill a Mockingbird': [
    { page_number: 75, entry_date: '2024-11-20', thoughts: 'Scout\'s perspective on Maycomb is so innocent yet revealing about the town\'s prejudices.' },
    { page_number: 150, entry_date: '2024-11-25', thoughts: 'The trial is intense. Atticus is such a principled character.' },
    { page_number: 200, entry_date: '2024-11-30', thoughts: 'The aftermath of the trial is heartbreaking. The injustice is palpable.' },
  ],
  'Crime and Punishment': [
    { page_number: 100, entry_date: '2024-11-10', thoughts: 'Raskolnikov\'s psychological torment is gripping. The crime has deeply affected him.' },
    { page_number: 200, entry_date: '2024-11-18', thoughts: 'The cat and mouse with Porfiry is tense. Every conversation feels loaded.' },
    { page_number: 320, entry_date: '2024-11-28', thoughts: 'Sonya\'s faith and compassion are a stark contrast to Raskolnikov\'s nihilism.' },
  ],
  'Jane Eyre': [
    { page_number: 60, entry_date: '2024-12-01', thoughts: 'Jane\'s childhood at Gateshead and Lowood is so harsh. Her resilience is admirable.' },
    { page_number: 125, entry_date: '2024-12-07', thoughts: 'Thornfield Hall is mysterious. Rochester is an intriguing but difficult character.' },
  ],
  'The Catcher in the Rye': [
    { page_number: 80, entry_date: '2024-11-05', thoughts: 'Holden\'s voice is so distinct. His cynicism masks a deep sadness.' },
    { page_number: 160, entry_date: '2024-11-10', thoughts: 'The scene with Phoebe is touching. She\'s the only one who seems to understand him.' },
    { page_number: 234, entry_date: '2024-11-15', thoughts: 'Finished. A profound exploration of alienation and the loss of innocence.' },
  ],
  'Animal Farm': [
    { page_number: 50, entry_date: '2024-10-15', thoughts: 'The allegory is clear but effective. Napoleon\'s rise is unsettling.' },
    { page_number: 112, entry_date: '2024-10-22', thoughts: 'The ending is devastating. "All animals are equal, but some are more equal than others."' },
  ],
  'The Old Man and the Sea': [
    { page_number: 60, entry_date: '2024-09-02', thoughts: 'Santiago\'s determination is inspiring. The sea descriptions are beautiful.' },
    { page_number: 127, entry_date: '2024-09-08', thoughts: 'A meditation on perseverance and dignity. The ending is bittersweet but triumphant.' },
  ],
  'Of Mice and Men': [
    { page_number: 50, entry_date: '2024-08-25', thoughts: 'George and Lennie\'s friendship is the heart of this story. Their dream feels fragile.' },
    { page_number: 107, entry_date: '2024-08-30', thoughts: 'Devastating ending. Steinbeck doesn\'t pull any punches about the harsh realities of life.' },
  ],
};

async function seed() {
  console.log('Initializing database...');
  await initializeDatabase();

  // Clear existing data
  await db.deleteFrom('journal_entries').execute();
  await db.deleteFrom('books').execute();

  console.log('Seeding books...');
  for (const book of books) {
    const result = await db
      .insertInto('books')
      .values(book)
      .returning(['id', 'title'])
      .executeTakeFirstOrThrow();

    // Add journal entries if they exist for this book
    const entries = journalEntriesData[book.title];
    if (entries) {
      for (const entry of entries) {
        await db
          .insertInto('journal_entries')
          .values({
            book_id: result.id,
            page_number: entry.page_number,
            entry_date: entry.entry_date,
            thoughts: entry.thoughts,
          })
          .execute();
      }
      console.log(`  - ${result.title} (${entries.length} journal entries)`);
    } else {
      console.log(`  - ${result.title}`);
    }
  }

  console.log('\nSeeding completed! 15 books with journal entries added.');
  await db.destroy();
}

seed().catch(console.error);
