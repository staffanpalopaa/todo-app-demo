import express from 'express';
import GetCompletedTodosReadModel from '../../../domain/readmodel/GetCompletedTodosReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const completedTodos = await GetCompletedTodosReadModel.query();
    res.json(completedTodos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-completed-todos',
  router,
};