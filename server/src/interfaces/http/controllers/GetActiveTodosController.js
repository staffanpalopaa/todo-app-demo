import express from 'express';
import GetActiveTodosReadModel from '../../../domain/readmodel/GetActiveTodosReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const activeTodos = await GetActiveTodosReadModel.query();
    res.json(activeTodos);
  } catch (err) {
    // In a production environment, detailed error messages should be logged internally
    // and a more generic error message returned to the client to avoid information leakage.
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-active-todos', // Aligns with the OpenAPI path for this read model
  router,
};