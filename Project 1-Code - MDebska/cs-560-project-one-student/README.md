# Project One: Book Tracker Application Implementation

## Overview

This is a Vue 3 + Vuetify application that allows users to track their reading progress. Users can view a list of books and add journal entries to record their thoughts as they read.

## Viewing This README

This file is written in Markdown. To view it with proper formatting in VS Code:

1. Open this file in VS Code
2. Open the Command Palette:
   - **Mac**: `Cmd + Shift + P`
   - **Windows/Linux**: `Ctrl + Shift + P`
3. Type `Markdown: Open Preview` and press Enter

Alternatively, click the preview icon (split rectangle with magnifying glass) in the top-right corner of the editor.

## Getting Started

**It is highly recommended to work on this project in your Codio environment as the necessary prerequisites will be installed. If you are working locally, please refer to the below list of technologies to download to run.**

### Prerequisites if developing on your local computer:

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- make (GNU Command. If you are a Windows user, you can download using [Chocolatey](https://chocolatey.org/install) that you can optionally download when installing Node.js)

### Installation

1. Open a terminal in this project folder
2. Run the setup command:

```bash
make setup
```

This will install dependencies for both frontend and backend, and seed the database with sample books.

### Running the Application

Start both the backend and frontend servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open your browser to the URL shown in the terminal (usually http://localhost:5173).

### Cleaning Up

To remove all dependencies and the database:

```bash
make clean
```

## Interface Implementation Tasks

Your task is to implement the `BookCard` component and refactor the `BookList` view to use it with responsive breakpoints.


### Where to Find the TODOs

There are three files with TODO comments:

#### 1. `frontend/src/components/BookCard.vue`

This component displays a single book card. You need:

1. **To implement reusable design patterns**, define the component props (book data and clickable flag)
2. **To continue your implementation of reusable design patterns**, define the component emits (click event that passes the Book object)
3. **To adapt interface components from your prototype and create consistency between the functionality and intent of your componentss**, uncomment the helper functions and then **implement** the BookCard template to display the structure output displayed in the `BookCard.vue` template section.

#### 2. `frontend/src/views/BookList.vue`

This view displays the grid of books. You need:

1. **To integrate accessibility and responsive features**, add responsive breakpoint props to `<v-col>` to control how many books appear per `v-row`. Vuetify's grid uses a 12-column system, and the application should display:
   - 1 card per row on mobile
   - 2 cards per row on tablet
   - 3 cards per row on desktop

2. **To implement reusable design patterns and integrate visual and UI components, refactor** the existing hardcoded information to create a reusable `BookCard` component. The BookCard component should:
   - Accept a `book` prop with the book data
   - Accept a `clickable` prop (boolean)
   - Emit a `click` event when clicked
   - Handles all 3 reading states ("not-started", "in-progress", "completed")
   - Iterate through the `store.books` to display the books data stored in your backend. 
   - Remove the HARDCODED data.

#### 3. `frontend/src/views/BookDetail.vue`

This view displays a single book with its journal entries. You need:

1. **To integrate accessibility and responsiveness features**, add accessibility attributes (`aria-label`) to icon buttons for screen reader support
2. **To further integrate accessibility and responsiveness features**, add `aria-live` attribute to the snackbar for announcing messages to assistive technology



### Hints

- Vuetify uses a **12-column grid system**
- To show 2 items per row, each item needs `12 / 2 = 6` columns
- To show 3 items per row, each item needs `12 / 3 = 4` columns
- Look at `JournalEntryDialog.vue` for examples of `defineProps` and `defineEmits` syntax
- Check the Vuetify documentation for [Grid System](https://vuetifyjs.com/en/components/grids/) and [v-col](https://vuetifyjs.com/en/api/v-col/)
