import { Request, Response } from 'express';
import { callGoogleGeminiAPI } from '../services/api';

let items: any[] = [];

export const getItems = (req: Request, res: Response) => {
  res.json(items);
};

export const createItem = (req: Request, res: Response) => {
  const newItem = req.body;
  items.push(newItem);
  res.status(201).json(newItem);
};

export const getItemById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(i => i.id === id);
  if (!item) return res.status(404).json({ message: 'Item não encontrado' });
  res.json(item);
};

export const analyzeData = async (req: Request, res: Response) => {
  try {
    const data = req.body; // Dados a serem enviados para a API
    const result = await callGoogleGeminiAPI(data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar a solicitação', error });
  }
};
