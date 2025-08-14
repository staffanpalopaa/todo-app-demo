import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoDetailsCommand {
  static async execute({ todoID, title, description, dueDate, priority }) {
    if (!todoID) {
      throw new Error('Todo ID is required to update Todo details.');
    }

    const existingTodoData = await db.findById('Todo', todoID);

    if (!existingTodoData) {
      throw new Error(`Todo with ID ${todoID} not found.`);
    }

    const todo = new Todo(existingTodoData);

    if (title !== undefined) {
      todo.title = title;
    }
    if (description !== undefined) {
      todo.description = description;
    }
    if (dueDate !== undefined) {
      todo.dueDate = dueDate;
    }
    if (priority !== undefined) {
      todo.priority = priority;
    }

    await db.update('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default UpdateTodoDetailsCommand;