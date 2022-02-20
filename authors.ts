import { Router } from "express";
import Database from 'better-sqlite3';

const db = new Database('./data.db', {
    verbose: console.log,
});

const router = Router();

const getAllQuotes = db.prepare(`SELECT * FROM quotes;`)
const getAllAuthors = db.prepare(`SELECT * FROM authors;`)
const getAuthorById = db.prepare(`SELECT * FROM authors WHERE id=?;`)
const createAuthor = db.prepare(`
INSERT INTO authors (firstName, lastName, image, age) VALUES (?, ?, ?, ?);
`)
const updateAuthor = db.prepare(`
UPDATE authors SET firstName=?, lastName=?,image=?, age=? WHERE id=?;
`)
const deleteAuthorById = db.prepare(`
DELETE FROM authors WHERE id=?`)
export type Author = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    image: string;
}


router.get('/', (req, res) => {
    const search = req.query.search
    let authors = getAllAuthors.all()
    let quotes = getAllQuotes.all()
    let authorsCopy = JSON.parse(JSON.stringify(authors))

    for (const author of authorsCopy) {
        const authorQuotes = quotes.filter(quote => quote.authorId === author.id)
        author.quotes = authorQuotes
    }
    if (typeof search === 'string') {
        authorsCopy = authorsCopy.filter((author: { firstName: string; lastName: string; }) =>
            author.firstName.toLowerCase().includes(search.toLowerCase()) ||
            author.lastName.toLowerCase().includes(search.toLowerCase())
        )
    }
    res.send(authorsCopy)
})

router.get('/:id', (req, res) => {
    const id = Number(req.params.id)
    let authors = getAllAuthors.all()
    
    const match = authors.find((author) => author.id === id)
    if (match) {
        res.send(match)
    } else {
        res.status(404).send({ error: 'Author not found.' });
    }
})

router.post('/', (req, res) => {
    const { firstName, lastName, image, age} = req.body
    const errors = []

    if (typeof req.body.firstName !== 'string')
        errors.push('firstName is missing or not a string');
    if (typeof req.body.lastName !== 'string')
        errors.push('lastName is missing or not a string');
    if (typeof req.body.age !== 'number')
        errors.push('age is missing or not a number');
    if (typeof req.body.image !== 'string')
        errors.push('image is missing or not a string');

    if (errors.length === 0) {
        const result = createAuthor.run(firstName, lastName, image, age)
        const newAuthor = getAuthorById.get(result.lastInsertRowid)
        res.status(201).send(newAuthor)
    } else res.status(400).send({errors: errors})
})

router.patch('/:id', (req,res) => {
    const id = Number(req.params.id)
    const { firstName, lastName, image, age} = req.body

    const authorToChange = getAuthorById.get(id)
    const errors = []

    if (authorToChange) {
        if (typeof firstName === 'string') {
            authorToChange.firstName = firstName
        } else errors.push(`First name not a string`)
        if (typeof lastName === 'string') {
            authorToChange.lastName = lastName
        } else errors.push(`Last name not a string`)
        if (typeof image === 'string') {
            authorToChange.image = image
        } else (`Imagee not a string`)
        if (typeof age === 'number') {
            authorToChange.age = age
        } else errors.push(`Age not a number`)
        updateAuthor.run(authorToChange.firstName,
            authorToChange.lastName,
            authorToChange.image,
            authorToChange.age,
            authorToChange.dead, id)
        res.send({ data: authorToChange, errors: errors })
    } else {
        res.status(404).send({ error: 'Author not found.' })
    }
})

router.delete('/:id', (req,res) => {
    const id = Number(req.params.id)
    const result = deleteAuthorById.run(id)

    if (result.changes !== 0) {
        res.send({message: "Author deleted successfully"})
    }else res.status(404).send({error: 'Author not found'})
})

export default router;