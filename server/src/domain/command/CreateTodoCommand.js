import { v4 as uuid } from 'uuid';
import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class CreateTodoCommand {
  static async execute({ title, description, dueDate, priority }) {
    const todoId = uuid();
    // Default status to 'Active' as per Todo schema example and common sense for a new todo
    const todo = new Todo({ todoID: todoId, title, description, dueDate, priority, status: 'Active' });
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;