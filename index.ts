import express from 'express';
import cors from 'cors'
import quoteRouter from './resources/quotes'
import authorRouter from './resources/authors'

const app = express();
app.use(cors())
app.use(express.json());

const PORT = 3001;

app.use(cors({
    origin: '*'
}))

app.use('/quotes', quoteRouter)
app.use('/authors', authorRouter)

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});
