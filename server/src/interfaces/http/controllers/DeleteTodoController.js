import express from 'express';
import DeleteTodoCommand from '../../../domain/command/DeleteTodoCommand.js';

const router = express.Router();

router.delete('/:id', async (req, res) => {
  try {
    const todoId = req.params.id;

    await DeleteTodoCommand.execute({ todoId });
    
    res.status(204).send();
  } catch (err) {
    if (err.message.includes('not found')) {
      res.status(404).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

export default {
  routeBase: '/todos',
  router,
};