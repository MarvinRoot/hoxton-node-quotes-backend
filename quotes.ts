import { Router } from 'express';
import Database from 'better-sqlite3';

const db = new Database('./data.db', {
    verbose: console.log,
});

const router = Router();

const getAllQuotes = db.prepare(`SELECT * FROM quotes;`)
const getAllAuthors = db.prepare(`SELECT * FROM authors;`)
const getQuoteById = db.prepare(`SELECT * FROM quotes WHERE id=?;`)
const createQuote = db.prepare(`
INSERT INTO quotes (quote, authorId) VALUES (?, ?);
`)
const updateQuote = db.prepare(`
UPDATE quotes SET quote=?, authorId=? WHERE id=?;
`)
const deleteQuoteById = db.prepare(`
DELETE FROM quotes WHERE id=?`)

export type Quote = {
    id: number;
    quote: string;
    authorId: number;
}

router.get('/getRandomQuote', (req, res) => {
    let quotes = getAllQuotes.all()
    const randomNumber = Math.floor(Math.random() * 10);
    res.send(quotes[randomNumber]);
});

router.get('/', (req, res) => {
    const search = req.query.search
    let authors = getAllAuthors.all()
    let quotes = getAllQuotes.all()
    let quotesCopy = JSON.parse(JSON.stringify(quotes))

    for (const quote of quotesCopy) {
        const author = authors.find((author) => author.id === quote.authorId)
        quote.author = author
    }
    if (typeof search === 'string') {
        quotesCopy = quotesCopy.filter((quote: { quote: string; }) =>
            quote.quote.toLowerCase().includes(search.toLowerCase())
        )
    }
    res.send(quotesCopy)
})

router.get('/:id', (req, res) => {
    let quotes = getAllQuotes.all()
    const id = Number(req.params.id)
    const match = quotes.find((quote) => quote.id === id)

    if (match) res.send(match)
    else res.status(404).send({ error: 'Quote Not Found' })
})

router.post('/', (req, res) => {
    const errors = []
    const { quote, authorId } = req.body

    if (typeof req.body.quote !== 'string') errors.push('Quote is missing or not a string')
    if (typeof req.body.authorId !== 'number') errors.push('authorId is missing or not a number')

    if (errors.length === 0) {
        const result = createQuote.run(quote, authorId)
        const newQuote = getQuoteById.get(result.lastInsertRowid)
        res.status(201).send(newQuote)
    } else {
        res.status(400).send({ errors: errors })
    }
})

router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const { quote, authorId } = req.body;

    const result = updateQuote.run(quote, authorId, id)

    if(result.changes !==0) {
        const updatedQuote = getQuoteById.get(id)
        res.send(updatedQuote)
    } else {
        res.status(404).send({ error: 'Quote not found.' })
    }
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const result = deleteQuoteById.get(id)

    if(result.changes !== 0) {
        res.send({message: "Quote deleted successfully"})
    } else res.status(404).send({error: "Quote not found"})
});

export default router;