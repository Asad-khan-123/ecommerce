import express from 'express';
import cors from 'cors';
import ENV from './utils/env.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = ENV.PORT || 5000;

const server = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

server();
