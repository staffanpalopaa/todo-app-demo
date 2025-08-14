import express from 'express';
import MarkTodoAsCompletedCommand from '../../../domain/command/MarkTodoAsCompletedCommand.js';

const router = express.Router();

// The route now includes a path parameter for the todo ID and a specific action segment '/complete'
router.post('/:todoId/complete', async (req, res) => {
  try {
    const { todoId } = req.params; // Extract todoId from the URL path parameters
    const {
      completionNotes,
      actualCompletionDate,
      timeSpentMinutes,
      satisfactionRating,
    } = req.body;

    const updatedTodo = await MarkTodoAsCompletedCommand.execute(
      todoId, // Pass the todoId to the command
      {
        completionNotes,
        actualCompletionDate,
        timeSpentMinutes,
        satisfactionRating,
      }
    );

    // Respond with the updated todo data and a 200 OK status
    res.status(200).json(updatedTodo);
  } catch (err) {
    // Handle specific error types for more precise HTTP status codes
    if (err.message.includes('not found')) {
      res.status(404).json({ message: err.message }); // Not Found
    } else if (err.message.includes('already completed') || err.message.includes('deleted')) {
      res.status(409).json({ message: err.message }); // Conflict
    } else {
      // For other validation or unexpected errors
      res.status(400).json({ message: err.message }); // Bad Request
    }
  }
});

export default {
  // The routeBase is now '/todos' implying this controller handles actions related to todo resources.
  // When mounted in app.js like `app.use('/todos', MarkTodoAsCompletedController.router)`,
  // the full path becomes `POST /todos/:todoId/complete`.
  routeBase: '/todos',
  router,
};