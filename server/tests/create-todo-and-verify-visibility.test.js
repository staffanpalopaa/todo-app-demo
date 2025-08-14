import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'create-todo-and-verify-visibility.feature'));

defineFeature(feature, test => {
  let todoTitle;
  let todoDescription;
  let todoDueDate;
  let todoPriority;
  let createTodoResponse;
  let createdTodoId;
  let getAllTodosResponse;

  test(
    'Given the user is on the todo creation page, When the user enters a title and clicks \'Add\', Then a new todo is created and visible in the list.',
    ({ given, when, then }) => {
      given('the user is on the todo creation page', () => {
        const timestamp = new Date().getTime();
        todoTitle = `Task for Test ${timestamp}`;
        todoDescription = `Description for task ${timestamp}`;
        todoDueDate = '2025-08-15'; // Using a date near the current date 2025-08-14
        todoPriority = 'Low';
        createdTodoId = null;
      });

      when('the user enters a title and clicks \'Add\'', async () => {
        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({
            title: todoTitle,
            description: todoDescription,
            dueDate: todoDueDate,
            priority: todoPriority,
          })
          .set('Accept', 'application/json');
        
        if (createTodoResponse.statusCode === 200) {
          createdTodoId = createTodoResponse.body.todoID;
        }
      });

      then('a new todo is created and visible in the list.', async () => {
        expect(createTodoResponse.statusCode).toBe(200);
        expect(createTodoResponse.body).toBeDefined();
        expect(createTodoResponse.body.todoID).toBeDefined();
        expect(createTodoResponse.body.title).toBe(todoTitle);
        expect(createTodoResponse.body.status).toBe('Active'); // Default status for new todo

        // Verify it's visible in the list
        getAllTodosResponse = await request(app)
          .get('/api/v1/get-all-todos')
          .set('Accept', 'application/json');

        expect(getAllTodosResponse.statusCode).toBe(200);
        expect(Array.isArray(getAllTodosResponse.body)).toBe(true);

        const foundTodo = getAllTodosResponse.body.find(
          (todo) => todo.todoID === createdTodoId
        );
        expect(foundTodo).toBeDefined();
        expect(foundTodo.title).toBe(todoTitle);
        expect(foundTodo.description).toBe(todoDescription);
        expect(foundTodo.dueDate).toBe(todoDueDate);
        expect(foundTodo.priority).toBe(todoPriority);
        expect(foundTodo.status).toBe('Active');
      });
    }
  );
});