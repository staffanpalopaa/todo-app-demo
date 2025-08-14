import db from '../../infrastructure/db/index.js';
import Todo from '../entity/Todo.js';

class UpdateTodoDetailsCommand {
  static async execute({ todoID, title, description, dueDate, priority }) {
    const todo = await db.findById('Todo', todoID);
    if (!todo) {
      throw new Error('Todo not found');
    }

    const updatedTodo = new Todo({
      ...todo,
      title: title || todo.title,
      description: description || todo.description,
      dueDate: dueDate || todo.dueDate,
      priority: priority || todo.priority,
    });

    await db.update('Todo', todoID, updatedTodo.toJSON());
    return updatedTodo.toJSON();
  }
}

export default UpdateTodoDetailsCommand;