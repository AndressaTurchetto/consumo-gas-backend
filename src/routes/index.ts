import { Router } from 'express';
import { getItems, createItem, getItemById } from '../controllers/itemController';
import { createItemValidation } from '../validators/itemValidator';
import { validateRequest } from '../middleware/validateRequest';
import { analyzeData } from '../controllers/itemController';
import { Request, Response } from 'express';
import { analyzeImage } from '../services/api';


const router = Router();

router.get('/items', getItems);
router.post('/items', createItemValidation, validateRequest, createItem);
router.post('/items', createItem);
router.get('/items/:id', getItemById);
router.post('/analyze', analyzeData);


export const analyzeImageEndpoint = async (req: Request, res: Response) => {
    try {
      const imageUrl = req.body.imageUrl;
      const result = await analyzeImage(imageUrl);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao analisar a imagem', error });
    }
  };
  

export { router };
