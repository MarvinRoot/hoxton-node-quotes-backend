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
    quote: string
    authorAge: number | string
    authorFirstName: string
    authorLastName: string
    authorImg: string
};

const quotes: Quote[] = [
    {
        id: 1,
        quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        authorAge: "deceased",
        authorFirstName: "Nelson",
        authorLastName: "Mandela",
        authorImg: "https://cdn.britannica.com/93/173193-131-3EE3B458/Nelson-Mandela-South-African.jpg"
    },
    {
        id: 2,
        quote: "The way to get started is to quit talking and begin doing.",
        authorAge: "deceased",
        authorFirstName: "Walt",
        authorLastName: "Disney",
        authorImg: "https://www.biography.com/.image/t_share/MTI2MDUwMjQ3NzMzNDYzMDUw/walt-disney-united-artistis-photofest-croppedjpg.jpg"
    },
    {
        id: 3,
        quote: "It is during our darkest moments that we must focus to see the light.",
        authorAge: "deceased",
        authorFirstName: "Aristotle",
        authorLastName: "",
        authorImg: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY2ODIwNDI5NjA2OTU0OTg1/aristotle--getty.jpg"
    },
    {
        id: 4,
        quote: "In the end, it's not the years in your life that count. It's the life in your years.",
        authorAge: "deceased",
        authorFirstName: "Abraham",
        authorLastName: "Lincoln",
        authorImg: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg"
    },
    {
        id: 5,
        quote: "The purpose of our lives is to be happy.",
        authorAge: 86,
        authorFirstName: "Dalai",
        authorLastName: "Lama",
        authorImg: "https://upload.wikimedia.org/wikipedia/commons/5/55/Dalailama1_20121014_4639.jpg"
    },
    {
        id: 6,
        quote: "Love the life you live. Live the life you love.",
        authorAge: "deceased",
        authorFirstName: "Bob",
        authorLastName: "Marley",
        authorImg: "https://www.rollingstone.com/wp-content/uploads/2020/01/Bob-Marley-Lead.jpg?resize=1800,1200&w=450"
    },
    {
        id: 7,
        quote: "You can't put a limit on anything. The more you dream, the farther you get.",
        authorAge: 36,
        authorFirstName: "Michael",
        authorLastName: "Phelps",
        authorImg: "https://whyevolutionistrue.com/wp-content/uploads/2022/01/0_X0DuMdeLFhOIFwnP.jpg"
    },
    {
        id: 8,
        quote: "If you do the work you get rewarded. There are no shortcuts in life.",
        authorAge: 58,
        authorFirstName: "Michael",
        authorLastName: "Jordan",
        authorImg: "https://hoopshype.com/wp-content/uploads/sites/92/2021/11/i_29_5a_95_michael-jordan.png?w=1000&h=600&crop=1"
    },
    {
        id: 9,
        quote: "He who is not courageous enough to take risks will accomplish nothing in life.",
        authorAge: "deceased",
        authorFirstName: "Muhammed",
        authorLastName: "Ali",
        authorImg: "https://www.biography.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTE5NDg0MDU0ODc2NTU0NzY3/muhammad-ali-1-raw.jpg"
    },
    {
        id: 10,
        quote: "Your love makes me strong. Your hate makes me unstoppable.",
        authorAge: 37,
        authorFirstName: "Critiano",
        authorLastName: "Ronaldo",
        authorImg: "https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg"
    },
];

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

app.get('/quotes', (req, res) => {
    const search = req.query.search
    let quotesToSend = quotes

    if (typeof search === 'string') {
        quotesToSend = quotesToSend.filter(quote =>
            quote.authorFirstName.toUpperCase().includes(search.toUpperCase()))
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

    if(typeof quote !== 'string') errors.push("Quote missing or not a string")
    if(typeof firstName !== 'string') errors.push("First name missing or not a string")
    if(typeof lastName !== 'string') errors.push("Last name missing or not a string")
    if(typeof image !== 'string') errors.push("Image missing or not a string")
    if(typeof age !== 'string' || typeof age !== 'number') errors.push("Age missing or not a string/number")

    if(errors.length === 0) {
        const newQuote: Quote = {
            id: Math.random(),
            quote: quote,
            authorFirstName: firstName,
            authorLastName: lastName,
            authorAge: age,
            authorImg: image
        }

        quotes.push(newQuote)
        res.status(201).send(newQuote)
    }else res.status(400).send({errors: errors})
})

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
