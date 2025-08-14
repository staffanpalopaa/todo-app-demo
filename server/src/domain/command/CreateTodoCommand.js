import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';
import { v4 as uuidv4 } from 'uuid';

class CreateTodoCommand {
  static async execute({ title, description, dueDate }) {
    const todo = new Todo({
      todoID: uuidv4(),
      title,
      description,
      dueDate,
      status: 'Pending'
    });
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;