import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'mark-todo-as-completed-status-update.feature'));

defineFeature(feature, test => {
  let todoId;
  let markCompletedResponse;
  const requestApp = request(app);

  // Constants for the test
  const completionNotesValue = "Project documentation completed ahead of schedule.";
  const actualCompletionDateValue = "2025-08-14"; // From current date: 2025-08-14T09:01:45.998Z
  const timeSpentMinutesValue = "120";
  const satisfactionRatingValue = "5";

  test(
    'Given an active todo, When the user marks it as complete, Then the todo\'s status is changed to completed.',
    ({ given, when, then }) => {
      given('an active todo', async () => {
        const createTodoPayload = {
          title: "Complete Project Documentation",
          description: "Write detailed documentation for the new module.",
          dueDate: "2025-08-20",
          priority: "High"
        };

        const response = await requestApp.post('/api/v1/create-todo').send(createTodoPayload);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('todoID');
        expect(response.body).toHaveProperty('status', 'Active'); // Ensure initial status is Active

        todoId = response.body.todoID;
      });

      when('the user marks it as complete', async () => {
        // NOTE: The OpenAPI spec for MarkTodoAsCompletedRequest does not explicitly include todoID in its schema.
        // Assuming todoID is passed in the request body as is common for DDD commands when not using path params.
        const markCompletePayload = {
          todoID: todoId, // Assuming todoID is part of the command payload
          completionNotes: completionNotesValue,
          actualCompletionDate: actualCompletionDateValue,
          timeSpentMinutes: timeSpentMinutesValue,
          satisfactionRating: satisfactionRatingValue,
        };

        const response = await requestApp.post('/api/v1/mark-todo-as-completed').send(markCompletePayload);

        expect(response.statusCode).toBe(200);
        markCompletedResponse = response.body;
      });

      then('the todo\'s status is changed to completed.', async () => {
        expect(markCompletedResponse).toBeDefined();
        expect(markCompletedResponse).toHaveProperty('todoID', todoId);
        expect(markCompletedResponse).toHaveProperty('status', 'Completed');
        expect(markCompletedResponse).toHaveProperty('completionNotes', completionNotesValue);
        expect(markCompletedResponse).toHaveProperty('actualCompletionDate', actualCompletionDateValue);
        expect(markCompletedResponse).toHaveProperty('timeSpentMinutes', timeSpentMinutesValue);
        expect(markCompletedResponse).toHaveProperty('satisfactionRating', satisfactionRatingValue);

        // Optional: Verify by fetching the todo details if a reliable GET endpoint with ID existed.
        // Given ambiguity in get-todo-details for passing ID, we rely on the command's response.
      });
    }
  );
});