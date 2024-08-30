import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { router } from './routes';
import helmet from 'helmet';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', router);
app.use(helmet());

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});


export default app;

