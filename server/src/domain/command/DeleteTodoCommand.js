import db from '../../infrastructure/db/index.js';

class DeleteTodoCommand {
  static async execute({ todoId }) {
    if (!todoId) {
      throw new Error('Todo ID must be provided to delete a specific todo.');
    }

    const result = await db.remove('Todo', { id: todoId });

    if (!result || result.deletedCount === 0) {
      throw new Error(`Todo with ID ${todoId} not found or could not be deleted.`);
    }

    return { success: true, deletedId: todoId, details: result };
  }
}

export default DeleteTodoCommand;