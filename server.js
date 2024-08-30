const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const port = process.env.PORT || 3000;

// const axios = require('axios');
// require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/water_gas_db');

const measurementSchema = new mongoose.Schema({
    customer_code: String,
    measure_datetime: Date,
    measure_type: String,
    measure_value: Number,
    image_url: String,
    measure_uuid: String,
  });

  const Measurement = mongoose.model('Measurement', measurementSchema);

const callLLMApi = async (imageBase64) => {
  try {
    const response = await axios.post('https://api.google.com/gemini', {
      image: imageBase64,
    });
    return response.data;
  } catch (error) {
    throw new Error('Erro ao chamar a API LLM');
  }
};

// Endpoint /upload
app.post('/upload', async (req, res) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;
  
    // Validação dos dados
    if (!image || !customer_code || !measure_datetime || !measure_type) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Dados fornecidos são inválidos',
      });
    }
  
    if (!['WATER', 'GAS'].includes(measure_type)) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de medição inválido',
      });
    }
  
    // Verificar se já existe uma leitura para este tipo no mês atual
    const existingMeasurement = await Measurement.findOne({
      customer_code,
      measure_type,
      measure_datetime: {
        $gte: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth(), 1),
        $lt: new Date(new Date(measure_datetime).getFullYear(), new Date(measure_datetime).getMonth() + 1, 1),
      },
    });
  
    if (existingMeasurement) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada',
      });
    }
  
    // Chamar a API LLM
    try {
      const llmResponse = await callLLMApi(image);
      
      const newMeasurement = new Measurement({
        customer_code,
        measure_datetime: new Date(measure_datetime),
        measure_type,
        measure_value: llmResponse.measure_value,
        image_url: llmResponse.image_url,
        measure_uuid: llmResponse.measure_uuid,
      });
  
      await newMeasurement.save();
  
      return res.status(200).json({
        image_url: llmResponse.image_url,
        measure_value: llmResponse.measure_value,
        measure_uuid: llmResponse.measure_uuid,
      });
    } catch (error) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Erro ao processar imagem com a LLM',
      });
    }
  });
  
  // Iniciar o servidor
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });

// Endpoint 1: Upload de Imagem
// app.post('/upload', (req, res) => {
//     Lógica para upload de imagem
//     res.send('Imagem carregada com sucesso');
//   });

// Endpoint 2: Leitura de Imagem
// app.post('/read', async (req, res) => {
//   try {
//     const imageUrl = req.body.imageUrl;
    
//     Faça uma solicitação à API do Google Gemini
//     const response = await axios.post(
//       'https://api.google.com/gemini/v1/read', // Endpoint fictício da API do Google Gemini
//       { imageUrl },
//       {
//         headers: { 'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}` }
//       }
//     );
    
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).send('Erro ao ler a imagem');
//   }
// });

// Endpoint 3: Obter Informações de Imagem
// app.get('/info/:imageId', (req, res) => {
//   const imageId = req.params.imageId;
//   Lógica para obter informações da imagem
//   res.send(`Informações da imagem com ID ${imageId}`);
// });





// app.listen(port, () => {
//     console.log(`Servidor rodando na porta ${port}`);
// });
