import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class MarkTodoAsCompletedCommand {
  /**
   * Marks a specific todo as completed.
   * @param {string} todoId - The ID of the todo to mark as completed.
   * @param {object} completionDetails - Details about the completion.
   * @param {string} completionDetails.completionNotes - Notes for completion.
   * @param {string} completionDetails.actualCompletionDate - Date of completion.
   * @param {number} completionDetails.timeSpentMinutes - Time spent on the todo.
   * @param {number} completionDetails.satisfactionRating - Satisfaction rating for the todo.
   * @returns {Promise<object>} The updated todo object.
   */
  static async execute(todoId, { completionNotes, actualCompletionDate, timeSpentMinutes, satisfactionRating }) {
    // 1. Find the specific todo by its ID
    const todoData = await db.findById('Todo', todoId); // Assumes db.findById exists and returns a plain object

    if (!todoData) {
      throw new Error(`Todo with ID '${todoId}' not found.`);
    }

    const todo = new Todo(todoData); // Re-hydrate to entity instance

    // 2. Validate todo status: must be active (not completed or deleted)
    if (todo.status === 'Completed') {
      throw new Error(`Todo with ID '${todoId}' is already completed.`);
    }
    if (todo.status === 'Deleted') {
      throw new Error(`Todo with ID '${todoId}' is deleted and cannot be marked as completed.`);
    }

    // 3. Update the todo's status and completion details
    todo.status = 'Completed';
    todo.completionNotes = completionNotes;
    todo.actualCompletionDate = actualCompletionDate;
    todo.timeSpentMinutes = timeSpentMinutes;
    todo.satisfactionRating = satisfactionRating;

    // 4. Persist the updated todo
    await db.update('Todo', todo.toJSON()); // Assumes db.update correctly updates by ID or equivalent mechanism

    return todo.toJSON(); // Return the updated entity data
  }
}

export default MarkTodoAsCompletedCommand;