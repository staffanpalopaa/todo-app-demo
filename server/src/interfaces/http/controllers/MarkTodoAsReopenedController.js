import express from 'express';
import MarkTodoAsReopenedCommand from '../../../domain/command/MarkTodoAsReopenedCommand.js';

const router = express.Router();

// This endpoint is updated to accept todoID as a path parameter, aligning with RESTful practices
// for actions on specific resources and addressing potential OpenAPI specification discrepancies
// where todoID might not be explicitly defined in the request body for this path.
router.post('/:todoID', async (req, res) => {
  try {
    const { todoID } = req.params;

    const result = await MarkTodoAsReopenedCommand.execute({
      todoID,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/mark-todo-as-reopened',
  router,
};