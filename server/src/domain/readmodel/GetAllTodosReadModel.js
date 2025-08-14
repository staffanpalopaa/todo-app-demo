import db from '../../infrastructure/db/index.js';

class GetAllTodosReadModel {
  static async query() {
    const todos = await db.findAll('Todo');
    return todos.map(todo => ({
      existingTodoTitle: todo.title,
      status: todo.status,
      dueDate: todo.dueDate,
      priority: todo.priority,
      createdDate: todo.createdDate,
    }));
  }
}

export default GetAllTodosReadModel;