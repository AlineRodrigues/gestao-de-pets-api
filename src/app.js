import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

import routes from './routes/index.js';
import petsRoutes from './routes/pets.routes.js';
import notFound from './middlewares/notFound.js';
import errorHandler from './middlewares/errorHandler.js';
import './database/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openapiPath = path.join(__dirname, '..', 'docs', 'openapi.yaml');
const openapiYaml = fs.readFileSync(openapiPath, 'utf8');
const swaggerDocument = yaml.load(openapiYaml);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/api-docs.yaml', (req, res) => {
  res.type('text/yaml').send(openapiYaml);
});

app.get('/', (req, res) => {
  res.json({
    nome: 'Gestão de Pets API',
    descricao: 'API REST para cadastro e consulta de pets, com autenticação JWT e persistência em MongoDB.',
    documentacao: '/api-docs',
  });
});

// Endpoints /pets exigidos pelo projeto JMeter.
app.use('/pets', petsRoutes);

// Mantém os endpoints existentes com o prefixo /api.
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
