import express from 'express';
import GetTodoDetailsReadModel from '../../../domain/readmodel/GetTodoDetailsReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todoDetails = await GetTodoDetailsReadModel.query();
    res.json(todoDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default {
  routeBase: '/get-todo-details',
  router,
};