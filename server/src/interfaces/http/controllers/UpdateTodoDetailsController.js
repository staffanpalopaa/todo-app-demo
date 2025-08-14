import express from 'express';
import UpdateTodoDetailsCommand from '../../../domain/command/UpdateTodoDetailsCommand.js';

const router = express.Router();

router.patch('/:todoID', async (req, res) => {
  try {
    const { todoID } = req.params;
    const { title, description, dueDate, priority } = req.body;
    const result = await UpdateTodoDetailsCommand.execute({ todoID, title, description, dueDate, priority });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/todos',
  router,
};