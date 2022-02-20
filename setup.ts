import Database from "better-sqlite3";

const db = new Database('./data.db', {
    verbose: console.log,
});

let quotes = [
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
]

let authors = [
    {
        id: 1,
        firstName: "Nelson",
        lastName: "Mandela",
        image: "https://cdn.britannica.com/93/173193-131-3EE3B458/Nelson-Mandela-South-African.jpg",
        age: 95
    },
    {
        id: 2,
        firstName: "Walt",
        lastName: "Disney",
        image: "https://www.biography.com/.image/t_share/MTI2MDUwMjQ3NzMzNDYzMDUw/walt-disney-united-artistis-photofest-croppedjpg.jpg",
        age: 65
    },
    {
        id: 3,
        firstName: "Aristotle",
        lastName: "",
        image: "https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY2ODIwNDI5NjA2OTU0OTg1/aristotle--getty.jpg",
        age: 62
    },
    {
        id: 4,
        firstName: "Abraham",
        lastName: "Lincoln",
        image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg",
        age: 56
    },
    {
        id: 5,
        firstName: "Dalai",
        lastName: "Lama",
        image: "https://upload.wikimedia.org/wikipedia/commons/5/55/Dalailama1_20121014_4639.jpg",
        age: 86
    },
    {
        id: 6,
        firstName: "Bob",
        lastName: "Marley",
        image: "https://www.rollingstone.com/wp-content/uploads/2020/01/Bob-Marley-Lead.jpg?resize=1800,1200&w=450",
        age: 36
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
        firstName: "Muhammad",
        image: "https://www.biography.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTE5NDg0MDU0ODc2NTU0NzY3/muhammad-ali-1-raw.jpg",
        lastName: "Ali",
        age: 74
    },
    {
        id: 10,
        firstName: "Cristiano",
        lastName: "Ronaldo",
        image: "https://assets.manutd.com/AssetPicker/images/0/0/10/126/687707/Legends-Profile_Cristiano-Ronaldo1523460877263.jpg",
        age: 37
    }
]

const deleteAllAuthors = db.prepare(`DELETE FROM authors;`)
deleteAllAuthors.run()
const deleteAllQuotes = db.prepare(`DELETE FROM quotes;`)
deleteAllQuotes.run()


const createQuotes = db.prepare(`
CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER,
    quote TEXT NOT NULL,
    authorId INTEGER,
    PRIMARY KEY (id)
    );
    `);

createQuotes.run();

const createAuthors = db.prepare(`
CREATE TABLE IF NOT EXISTS authors (
    id INTEGER,
    firstName TEXT NOT NULL,
    lastName TEXT,
    image TEXT,
    age INTEGER,
    PRIMARY KEY (id)
);
`);

createAuthors.run();

const createQuote = db.prepare(`
INSERT INTO quotes (quote, authorId) VALUES (?, ?);
`)

const deleteQuote = db.prepare(`
DELETE FROM quotes WHERE id=?;
`)

const updateQuote = db.prepare(`
UPDATE quotes SET quote=? WHERE id=?;
`)

const createAuthor = db.prepare(`
INSERT INTO authors (firstName, lastName, image, age) VALUES (?, ?, ?, ?);
`)


for(const quote of quotes) {
    createQuote.run(quote.quote, quote.authorId)
}

for(const author of authors) {
    createAuthor.run(author.firstName, author.lastName, author.image, author.age)
}