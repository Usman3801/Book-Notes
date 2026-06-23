import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));


//homepage
app.get("/", async (req, res) => {
    try{
        const sortOptions = {
            rating_desc: "rating DESC",
            rating_asc: "rating ASC",
            date_desc: "date_read DESC",
            date_asc: "date_read ASC",
            title_asc: "title ASC"
        };

        const sort = sortOptions[req.query.sort] || "date_read DESC";
        const allBooks = await db.query(`SELECT * FROM tracker ORDER BY ${sort}`);

        res.render("index.ejs", {
            books: allBooks.rows,
            currentSort:  req.query.sort || "date_read DESC"
        });
    }
    catch(error){
        console.log(error);
    } 
});

app.get("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/add", async (req, res) => {
    try{
        const newTitle = req.body.title;
        const newAuthor = req.body.author;
        const newRating = req.body.rating;
        const newDate = req.body.date_read;
        const newIsbn = req.body.isbn || null;
        const newNote = req.body.notes;
    
        await db.query(
            "INSERT INTO tracker (title, author, rating, notes, date_read, isbn) VALUES ($1, $2, $3, $4, $5, $6)",
            [newTitle, newAuthor, newRating, newNote, newDate, newIsbn]
        );

        res.redirect("/");
    }
    catch(error){
        console.log(error);
    }
});

app.post("/delete", async (req, res) => {
    try{
        const del = parseInt(req.body.id);
        await db.query("DELETE FROM tracker WHERE id = $1", [del]);

        res.redirect("/");
    }
    catch(error){
        console.log(error);
    }
});


app.get("/edit/:id", async (req, res) => {
    const ed = req.params.id;
    try{
        const response = await db.query("select * from tracker where id = $1", [ed]);
        const edRes = response.rows[0];

        res.render("edit.ejs", {
            books: edRes
        });
    }
    catch(error){
        console.log(error);
    }
});

app.post("/edit", async (req, res) => {
    const ed = req.body.id;
    try{
        const newTitle = req.body.title;
        const newAuthor = req.body.author;
        const newRating = req.body.rating;
        const newDate = req.body.date_read;
        const newIsbn = req.body.isbn || null;
        const newNote = req.body.notes;
        
        await db.query(
            "update tracker set title = $1, author = $2, rating = $3, notes = $4, date_read = $5, isbn = $6 where id = $7",
            [newTitle, newAuthor, newRating, newNote, newDate, newIsbn, ed]
        );

        res.redirect("/");
    }
    catch(error){
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});
