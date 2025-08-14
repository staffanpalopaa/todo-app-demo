import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, './updates-its-title-or-description.feature'));

defineFeature(feature, test => {
  let todoId;
  let initialTitle;
  let initialDescription;
  let updatedTitle;
  let updatedDescription;
  let updateResponse;

  test(
    'Given an existing todo, When the user updates its title or description, Then the todo\'s details are updated.',
    ({ given, when, then }) => {
      given('an existing todo', async () => {
        initialTitle = 'Original Todo Title ' + Date.now();
        initialDescription = 'Original Todo Description';

        const createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({
            title: initialTitle,
            description: initialDescription,
            dueDate: '2025-08-20',
            priority: 'Medium'
          })
          .set('Accept', 'application/json');

        expect(createResponse.statusCode).toBe(200);
        expect(createResponse.body).toHaveProperty('todoID');
        expect(createResponse.body.title).toBe(initialTitle);
        expect(createResponse.body.description).toBe(initialDescription);
        expect(createResponse.body.status).toBe('Active');

        todoId = createResponse.body.todoID;
      });

      when('the user updates its title or description', async () => {
        updatedTitle = 'Updated Todo Title ' + Date.now();
        updatedDescription = 'Updated Todo Description content';

        // NOTE: The OpenAPI specification for UpdateTodoDetailsRequest does not explicitly include
        // 'todoID'. However, for a command like 'update-todo-details' to operate on a specific todo,
        // it must implicitly or explicitly receive the todoID. Assuming 'todoID' is passed in the body
        // as is common in DDD command patterns where the aggregate root ID is part of the command.
        updateResponse = await request(app)
          .post('/api/v1/update-todo-details')
          .send({
            // Assuming todoID is required in the body for targeted updates,
            // even if not explicitly listed in the OpenAPI schema for UpdateTodoDetailsRequest.
            todoID: todoId,
            title: updatedTitle,
            description: updatedDescription,
            dueDate: '2025-08-25', // Can also update other fields
            priority: 'High'
          })
          .set('Accept', 'application/json');
      });

      then('the todo\'s details are updated', async () => {
        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body).toHaveProperty('todoID', todoId);
        expect(updateResponse.body.title).toBe(updatedTitle);
        expect(updateResponse.body.description).toBe(updatedDescription);
        expect(updateResponse.body.priority).toBe('High');
        expect(updateResponse.body.dueDate).toBe('2025-08-25');

        // Verify the update by fetching all todos and finding the specific one
        // NOTE: The OpenAPI spec for /get-todo-details does not support fetching by ID
        // and returns an array. Therefore, we use /get-all-todos to verify.
        const getAllResponse = await request(app)
          .get('/api/v1/get-all-todos')
          .set('Accept', 'application/json');

        expect(getAllResponse.statusCode).toBe(200);
        expect(Array.isArray(getAllResponse.body)).toBe(true);

        const updatedTodo = getAllResponse.body.find(todo => todo.todoID === todoId);

        expect(updatedTodo).toBeDefined();
        expect(updatedTodo.title).toBe(updatedTitle);
        expect(updatedTodo.description).toBe(updatedDescription);
        expect(updatedTodo.priority).toBe('High');
        expect(updatedTodo.dueDate).toBe('2025-08-25');
      });
    }
  );
});