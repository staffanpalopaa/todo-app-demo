import express from 'express';
import CreateTodoCommand from '../../../domain/command/CreateTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const result = await CreateTodoCommand.execute({ title, description, dueDate, priority });
    // As per RESTful API best practices, a successful resource creation should return HTTP status 201 Created.
    // The created resource is returned in the response body.
    res.status(201).json(result);
  } catch (err) {
    // For validation or business rule errors during creation, 400 Bad Request is appropriate.
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/create-todo',
  router,
};