import db from '../../infrastructure/db/index.js';

class GetCompletedTodosReadModel {
  static async query() {
    // Assuming 'Completed' is the status value for completed todos
    const completedTodos = await db.findAll('Todo', { status: 'Completed' });

    return completedTodos.map(todo => ({
      todoTitle: todo.title,
      completionDate: todo.actualCompletionDate,
      completionNotes: todo.completionNotes,
      originalDueDate: todo.dueDate,
      currentStatus: todo.status,
    }));
  }
}

export default GetCompletedTodosReadModel;