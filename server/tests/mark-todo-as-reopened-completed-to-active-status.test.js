import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'mark-todo-as-reopened-completed-to-active-status.feature'));

defineFeature(feature, test => {
  let todoId;
  let createTodoResponse;
  let markCompletedResponse;
  let markReopenedResponse;

  test(
    'Given a completed todo, When the user marks it as reopened, Then the todo\'s status is changed back to active.',
    ({ given, when, then }) => {
      given('a completed todo', async () => {
        // Create a new todo
        const createTodoPayload = {
          title: `Task to be completed and reopened ${Date.now()}`,
          description: 'This task will be completed and then reopened.',
          dueDate: '2025-08-15',
          priority: 'Medium'
        };
        createTodoResponse = await request(app)
          .post('/api/v1/create-todo')
          .send(createTodoPayload);

        expect(createTodoResponse.statusCode).toBe(200);
        expect(createTodoResponse.body).toHaveProperty('todoID');
        todoId = createTodoResponse.body.todoID;

        // Mark the newly created todo as completed
        const markCompletedPayload = {
          // NOTE: The OpenAPI spec for MarkTodoAsCompletedRequest does not explicitly include todoID.
          // Assuming todoID must be sent in the request body for the command to operate on a specific entity.
          todoID: todoId,
          completionNotes: 'Successfully completed the task.',
          actualCompletionDate: '2025-08-14', // Current date is 2025-08-14
          timeSpentMinutes: '30',
          satisfactionRating: '4'
        };
        markCompletedResponse = await request(app)
          .post('/api/v1/mark-todo-as-completed')
          .send(markCompletedPayload);

        expect(markCompletedResponse.statusCode).toBe(200);
        expect(markCompletedResponse.body.todoID).toBe(todoId);
        expect(markCompletedResponse.body.status).toBe('Completed');
      });

      when('the user marks it as reopened', async () => {
        const markReopenedPayload = {
          // NOTE: The OpenAPI spec for MarkTodoAsReopenedRequest does not explicitly include todoID.
          // Assuming todoID must be sent in the request body for the command to operate on a specific entity.
          todoID: todoId,
          reopenReason: 'Had to re-verify details after initial completion.',
          dueDate: '2025-08-20', // Updated due date example from spec
          priorityAdjustment: 'Increase to Critical', // Example from spec
          estimatedEffortHours: '1' // Example from spec
        };
        markReopenedResponse = await request(app)
          .post('/api/v1/mark-todo-as-reopened')
          .send(markReopenedPayload);
      });

      then('the todo\'s status is changed back to active.', async () => {
        expect(markReopenedResponse.statusCode).toBe(200);
        expect(markReopenedResponse.body.todoID).toBe(todoId);
        expect(markReopenedResponse.body.status).toBe('Active');

        // Verify the status change by querying the todo details
        // NOTE: The OpenAPI spec for get-todo-details does not define parameters.
        // Assuming todoID is passed as a query parameter and the response is an array with one Todo.
        const getTodoDetailsResponse = await request(app)
          .get(`/api/v1/get-todo-details?todoID=${todoId}`);

        expect(getTodoDetailsResponse.statusCode).toBe(200);
        expect(Array.isArray(getTodoDetailsResponse.body)).toBe(true);
        expect(getTodoDetailsResponse.body.length).toBe(1);
        expect(getTodoDetailsResponse.body[0].todoID).toBe(todoId);
        expect(getTodoDetailsResponse.body[0].status).toBe('Active');
      });
    }
  );
});