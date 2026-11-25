import { Router } from 'express';
import authRoutes from './auth.routes.js';
import petsRoutes from './pets.routes.js';

const router = Router();

// Rota pública de autenticação.
router.use('/auth', authRoutes);

// Rotas de cadastro e consulta de pets.
router.use('/pets', petsRoutes);

export default router;