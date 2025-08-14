import db from '../../infrastructure/db/index.js';

class GetTodoDetailsReadModel {
  static async query() {
    const todos = await db.findAll('Todo');

    return todos.map(todo => ({
      todoTitle: todo.title || null,
      description: todo.description || null,
      dueDate: todo.dueDate || null,
      status: todo.status || null,
      createdDate: todo.createdAt?.toISOString() || null,
      lastModifiedDate: todo.updatedAt?.toISOString() || null,
    }));
  }
}

export default GetTodoDetailsReadModel;