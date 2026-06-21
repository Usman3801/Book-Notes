# Book Notes Tracker

A personal book tracking app built with Node.js, Express, PostgreSQL, and EJS.

## Setup

1. Clone the repo
2. Run `npm install`
3. Create a PostgreSQL database called `books`
4. Run this SQL to create the table:

CREATE TABLE tracker (
  id SERIAL PRIMARY KEY,
  title TEXT,
  author TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  date_read DATE,
  isbn VARCHAR(13)
);

5. Create a `.env` file or update the db credentials in `index.js`
6. Run `nodemon index.js`

## Features

- Add, edit, delete book entries
- Sort by rating, date, or title
- Book covers fetched from Open Library API
- Fallback image for books without covers