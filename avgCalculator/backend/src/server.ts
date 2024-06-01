import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';


const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjE4ODQzLCJpYXQiOjE3MTcyMTg1NDMsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijg1ZTE2MjE4LWRkZDMtNDBhOS1hNDZkLWQ5NGY4OTNlYzU5NSIsInN1YiI6IjIxY3MyMDI2QHJnaXB0LmFjLmluIn0sImNvbXBhbnlOYW1lIjoiZ29Gb3J0aCIsImNsaWVudElEIjoiODVlMTYyMTgtZGRkMy00MGE5LWE0NmQtZDk0Zjg5M2VjNTk1IiwiY2xpZW50U2VjcmV0IjoiQVh3TWxQUFZ2SnBZdGdzaCIsIm93bmVyTmFtZSI6IlBhdGhpa3JlZXQgQ2hvd2RodXJ5Iiwib3duZXJFbWFpbCI6IjIxY3MyMDI2QHJnaXB0LmFjLmluIiwicm9sbE5vIjoiMjFjczIwMjYifQ.T9dvn7w5RcpSRLpHBTzriQc3EZBASNqFL1rFCHJhUAo";
let windowState: number[] = [];

const API_ENDPOINTS = {
  p: 'http://20.244.56.144/test/primes',
  f: 'http://20.244.56.144/test/fibo',
  e: 'http://20.244.56.144/test/even',
  r: 'http://20.244.56.144/test/rand',
};

const fetchNumbers = async (id: string): Promise<number[]> => {
    try {
      const response = await axios.get(API_ENDPOINTS[id as keyof typeof API_ENDPOINTS], {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      });
      return response.data.numbers;
    } catch (error) {
      console.error('Error fetching numbers:', error);
      return [];
    }
  };

const calculateAverage = (numbers: number[]): number => {
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};

app.use(cors());

app.post('/numbers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!['p', 'f', 'e', 'r'].includes(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  const newNumbers = await fetchNumbers(id);

  if (newNumbers.length > 0) {
    windowState = [...new Set([...windowState, ...newNumbers])];
    if (windowState.length > WINDOW_SIZE) {
      windowState = windowState.slice(windowState.length - WINDOW_SIZE);
    }
  }

  const avg = calculateAverage(windowState);
  res.json({
    windowPrevState: windowState,
    windowCurrState: windowState,
    numbers: newNumbers,
    avg,
  });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
