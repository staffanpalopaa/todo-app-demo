import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(__filename, '..'); // Adjusted to correctly resolve 'tests/' directory

const feature = loadFeature(path.resolve(__dirname, 'delete-todo.feature'));

defineFeature(feature, test => {
  let todoIdToDelete;
  let createTodoResponse;
  let deleteTodoResponse;

  test(
    'Given an existing todo, When the user clicks \'Delete\', Then the todo is removed from the system.',
    ({ given, when, then }) => {
      given('an existing todo', async () => {
        const createTodoPayload = {
          title: 'Prepare presentation slides',
          description: 'Gather data and design for quarterly review',
          dueDate: '2025-08-20',
          priority: 'High'
        };

        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload)
          .expect(200);

        expect(createTodoResponse.body).toBeDefined();
        expect(createTodoResponse.body.todoID).toBeDefined();
        expect(createTodoResponse.body.title).toBe(createTodoPayload.title);
        expect(createTodoResponse.body.status).toBe('Active'); // Assuming default status
        todoIdToDelete = createTodoResponse.body.todoID;
      });

      when('the user clicks \'Delete\'', async () => {
        const deleteTodoPayload = {
          // NOTE: todoID is not explicitly in DeleteTodoRequest schema in OpenAPI spec,
          // but is logically required to identify which todo to delete.
          // Assuming it's part of the request body for a command operation.
          todoID: todoIdToDelete,
          deletionReason: 'No longer relevant',
          deletionComment: 'Automated test cleanup of temporary todo.',
          confirmDeletion: 'true', // As per OpenAPI example, this is a string
          retainForDays: '0'
        };

        deleteTodoResponse = await request(app)
          .post('/api/v1/delete-todo')
          .send(deleteTodoPayload)
          .expect(200);

        expect(deleteTodoResponse.body).toBeDefined();
        expect(deleteTodoResponse.body.todoID).toBe(todoIdToDelete);
        // The spec implies a successful deletion returns the (now deleted/inactive) Todo object.
        // It does not specify a 'deleted' status, but we'll check it's gone from active list.
      });

      then('the todo is removed from the system', async () => {
        // Verify the todo is no longer in the list of all todos
        const getAllTodosResponse = await request(app)
          .get('/api/v1/get-all-todos')
          .expect(200);

        expect(Array.isArray(getAllTodosResponse.body)).toBe(true);
        const foundTodo = getAllTodosResponse.body.find(
          todo => todo.todoID === todoIdToDelete
        );
        expect(foundTodo).toBeUndefined(); // The todo should not be found in the system
      });
    }
  );
});