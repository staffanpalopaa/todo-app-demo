import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class MarkTodoAsReopenedCommand {
  /**
   * Marks a completed Todo item as reopened, updating its status and clearing completion details.
   *
   * @param {object} params - The parameters for reopening the todo.
   * @param {string} params.todoID - The unique identifier of the todo to reopen.
   * @returns {Promise<object>} The updated todo object.
   * @throws {Error} If the todo with the given ID is not found.
   */
  static async execute({ todoID }) {
    const existingTodoData = await db.findById('Todo', todoID);

    if (!existingTodoData) {
      throw new Error(`Todo with ID ${todoID} not found.`);
    }

    const todo = new Todo(existingTodoData);

    // GWT: "Then the todo's status is changed back to active."
    todo.status = 'Active';

    // Clear completion-related fields as the todo is now reopened
    todo.completionNotes = undefined;
    todo.actualCompletionDate = undefined;
    todo.timeSpentMinutes = undefined;
    todo.satisfactionRating = undefined;

    await db.update('Todo', todoID, todo.toJSON());

    return todo.toJSON();
  }
}

export default MarkTodoAsReopenedCommand;