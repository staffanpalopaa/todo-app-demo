import db from '../../infrastructure/db/index.js';

class GetActiveTodosReadModel {
  static async query() {
    // Assuming 'Todo' is the entity name and db.findAll retrieves all todos.
    // In a real scenario, if the database layer supports it, filtering should be done at the DB level for performance.
    const allTodos = await db.findAll('Todo');

    // Filter for active todos and map to the desired read model structure as per OpenAPI specification
    const activeTodos = allTodos
      .filter(todo => todo.status === 'Active')
      .map(todo => ({
        todoTitle: todo.title,
        dueDate: todo.dueDate,
        priority: todo.priority,
        // Assuming 'createdAt' is an internal property of the Todo entity.
        // Convert to ISO string if it's a Date object, otherwise use as is.
        createdDate: todo.createdAt ? (typeof todo.createdAt === 'string' ? todo.createdAt : todo.createdAt.toISOString()) : undefined,
        currentStatus: todo.status,
      }));

    return activeTodos;
  }
}

export default GetActiveTodosReadModel;