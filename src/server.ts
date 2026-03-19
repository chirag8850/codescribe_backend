import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.send('Hello, Chirag, kem cho!');
});

const port = process.env.PORT;
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
});
