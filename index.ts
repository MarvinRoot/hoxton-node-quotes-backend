import express from 'express';
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());

const PORT = 3001;

app.use(cors({
    origin: '*'
}))

type Quote = {
    id: number
    authorId: number
    quote: string
};

type Author = {
    id: number
    firstName: string
    lastName: string
    image: string
    age: number | string
}

let quotes: Quote[] = [
    {
        id: 1,
        quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        authorId: 1
    },
    {
        id: 2,
        quote: "The way to get started is to quit talking and begin doing.",
        authorId: 2
    },
    {
        id: 3,
        quote: "It is during our darkest moments that we must focus to see the light.",
        authorId: 3
    },
    {
        id: 4,
        quote: "In the end, it's not the years in your life that count. It's the life in your years.",
        authorId: 4
    },
    {
        id: 5,
        quote: "The purpose of our lives is to be happy.",
        authorId: 5
    },
    {
        id: 6,
        quote: "Love the life you live. Live the life you love.",
        authorId: 6
    },
    {
        id: 7,
        quote: "You can't put a limit on anything. The more you dream, the farther you get.",
        authorId: 7
    },
    {
        id: 8,
        quote: "If you do the work you get rewarded. There are no shortcuts in life.",
        authorId: 8
    },
    {
        id: 9,
        quote: "He who is not courageous enough to take risks will accomplish nothing in life.",
        authorId: 9
    },
    {
        id: 10,
        quote: "Your love makes me strong. Your hate makes me unstoppable.",
        authorId: 10
    },
];

let authors: Author[] = [
    {
        id: 1,
        firstName: "Nelson",
        lastName: "Mandela",
        image: "https://cdn.britannica.com/93/173193-131-3EE3B458/Nelson-Mandela-South-African.jpg",
        age: 'deceased'
    },
    {
        id: 2,
        firstName: "Walt",
        lastName: "Disney",
        image: "https://www.biography.com/.image/t_share/MTI2MDUwMjQ3NzMzNDYzMDUw/walt-disney-united-artistis-photofest-croppedjpg.jpg",
        age: 'deceased'
    },
    {
        id: 3,
        firstName: "Aristotle",
        lastName: "",
        image: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY2ODIwNDI5NjA2OTU0OTg1/aristotle--getty.jpg",
        age: 'deceased'
    },
    {
        id: 4,
        firstName: "Abraham",
        lastName: "Lincoln",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg",
        age: 'deceased'
    },
    {
        id: 5,
        firstName: "Dalai",
        lastName: "Lama",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Dalailama1_20121014_4639.jpg",
        age: 'deceased'
    },
    {
        id: 6,
        firstName: "Bob",
        lastName: "Marley",
        image: "https://www.rollingstone.com/wp-content/uploads/2020/01/Bob-Marley-Lead.jpg?resize=1800,1200&w=450",
        age: 'deceased'
    },
    {
        id: 7,
        firstName: "Michael",
        lastName: "Phelps",
        image: "https://whyevolutionistrue.com/wp-content/uploads/2022/01/0_X0DuMdeLFhOIFwnP.jpg",
        age: 36
    },
    {
        id: 8,
        firstName: "Michael",
        lastName: "Jordan",
        image: "https://hoopshype.com/wp-content/uploads/sites/92/2021/11/i_29_5a_95_michael-jordan.png?w=1000&h=600&crop=1",
        age: 58
    },
    {
        id: 9,
        firstName: "Muhammed",
        image: "https://www.biography.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTE5NDg0MDU0ODc2NTU0NzY3/muhammad-ali-1-raw.jpg",
        lastName: "Ali",

        age: 'deceased'
    },
    {
        id: 10,
        firstName: "Cristiano",
        lastName: "Ronaldo",
        image: "https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg",
        age: 37
    }
]

app.get('/', (req, res) => {
    res.send(`
    <h1>Quotes API</h1>
    <ul>
      <li><a href='/getRandomQuote'>/getRandomQuote</a></li>
      <li><a href='/quotes'>/quotes</a> 
      <p>Search by first name with ?searchFirstName=firstName</p>
      </li>
    </ul>
  `);
});

app.get('/getRandomQuote', (req, res) => {
    const randomNumber = Math.floor(Math.random() * 10);
    res.send(quotes[randomNumber]);
});


app.get('/authors', (req, res) => {
    const search = req.query.search
    let authorsToSend = authors
    
    if (typeof search === 'string') {
        authorsToSend = authorsToSend.filter(author => {
            author.firstName.toUpperCase().includes(search.toUpperCase())
        })
    }
    
    res.send(authorsToSend);
});

app.get('/authors/:id', (req, res) => {
    const id = Number(req.params.id)
    
    const match = authors.find((author) => author.id === id)
    if (match) {
        res.send(match)
    } else {
        res.status(404).send({ error: 'Author not found.' });
    }
})

app.get('/quotes', (req, res) => {
    const search = req.query.search
    let quotesToSend = quotes

    if (typeof search === 'string') {
        quotesToSend = quotesToSend.filter(quote => {
            const match = authors.find(author => author.id === quote.authorId)
            match?.firstName.toUpperCase().includes(search.toUpperCase())
        })
    }

    res.send(quotesToSend);
});

app.get('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)

    const match = quotes.find((quote) => quote.id === id)
    if (match) {
        res.send(match)
    } else {
        res.status(404).send({ error: 'Quote not found.' });
    }
})

app.post('/quotes', (req, res) => {
    const quote = req.body.quote
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const image = req.body.image
    const age = req.body.age

    const errors = []

    if (typeof quote !== 'string') errors.push("Quote missing or not a string")
    if (typeof firstName !== 'string') errors.push("First name missing or not a string")
    if (typeof lastName !== 'string') errors.push("Last name missing or not a string")
    if (typeof image !== 'string') errors.push("Image missing or not a string")

    if (errors.length === 0) {
        
        const newAuthor: Author = {
            id: Math.random(),
            firstName: firstName,
            lastName: lastName,
            image: image,
            age: age
        }

        const newQuote: Quote = {
            id: Math.random(),
            quote: quote,
            authorId: newAuthor.id
        }

        quotes.push(newQuote)
        authors.push(newAuthor)
        res.status(201).send(newQuote)
        res.status(201).send(newAuthor)
    } else res.status(400).send({ errors: errors })
})

app.patch('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)

    const quoteToChange = quotes.find(quote => quote.id === id)
    if(quoteToChange){
        if(typeof req.body.quote === 'string') quoteToChange.quote = req.body.quote
        res.send(quoteToChange)
    }else res.status(404).send({error: 'Quote not found'})
})

app.patch('/authors/:id', (req, res) => {
    const id = Number(req.params.id)

    const authorToChange = authors.find(author => author.id === id)
    if(authorToChange){
        if(typeof req.body.firstName === 'string') authorToChange.firstName = req.body.firstName
        if(typeof req.body.lastName === 'string') authorToChange.lastName = req.body.lastName
        if(typeof req.body.image === 'string') authorToChange.image = req.body.image
        if(req.body.age) authorToChange.age = req.body.age
        res.send(authorToChange)
    }else res.status(404).send({error: 'Author not found'})
})

app.delete('/quotes/:id', (req, res) => {
    const id = Number(req.params.id)

    const match = quotes.find(quote => quote.id === id)
    if(match) {
        quotes = quotes.filter(quote => quote.id !== id)
        res.send({message: 'Quote deleted'})
    }else res.status(404).send({error: 'Quote not found'})
})

app.delete('/authors/:id', (req, res) => {
    const id = Number(req.params.id)

    const match = authors.find(author => author.id === id)
    if(match) {
        authors = authors.filter(author => author.id !== id)
        res.send({message: 'Author deleted'})
    }else res.status(404).send({error: 'Author not found'})
})

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
