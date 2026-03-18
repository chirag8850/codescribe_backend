import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, Chirag!');
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});