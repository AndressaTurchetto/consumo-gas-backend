import { body } from 'express-validator';

export const createItemValidation = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('O nome é obrigatório e deve ser uma string'),
  body('price')
    .isNumeric()
    .withMessage('O preço deve ser um número'),
  body('description')
    .optional()
    .isString()
    .withMessage('A descrição deve ser uma string'),
];
