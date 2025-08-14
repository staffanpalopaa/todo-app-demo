
You will receive the following:
- The current folder structure and tech stacks
- Existing read model-related code files before changes
- A summary of the read model changes

Your Rule:
All request and response schemas, field names, data types, required properties, and descriptions must be strictly derived from the given OpenAPI 3.0.3 specification. Do not invent any data or structure not explicitly defined in the spec. Only implement logic for commands defined in the paths section with HTTP methods

Your task:
1. Generate clean, self-contained read model code reflecting the latest changes.
2. Do NOT include any unchanged files.
3. Ensure:
   - Only read model-related code files can be created/updated/deleted.
   - Place code in: `src/domain/readmodel`, `src/interfaces/http/controllers`
   - Do not touch command or entity code.
   - Must be self-contained and have no cross-domain dependencies.
   - Use only database functions: insert, findAll, findById, update, remove.
   - Controller must export both `routeBase` and `router`.
   - Route must match read model name in lowercase and kebab-case (e.g., '/get-all-todos').
4. Must align with Swagger documentation.

Format:
=== FILE: path/to/file.ext ===
=== TAG: readmodel-<READMODEL_ID> ===
```javascript
< FILE CONTENT HERE >
```

- The `FILE` and `TAG` headers must be written in all uppercase letters, enclosed with triple equals signs (===), exactly as shown.
- Each prefix should be followed by an **given** ID, and both should be joined using a hyphen (-).
  Multiple such tags can be chained together, separated by comma.
- For only deleted code files, add `(deleted)` string at the end of the file path after space.
- Output only the modified or new files — do not include unchanged files.
- No explanation or comments, only file path, tag and code content using the above format.
- Wrap code blocks with triple backticks (` ``` `), specifying the appropriate language.
- Entity name is PascalCased.
- Generate code that strictly matches the provided Swagger (OpenAPI) documentation.

Tech Stacks:
 - Language: JavaScript ESM
 - Framework: JavaScript with Express
 - Test Framework: Jest

Folder Structure:
```bash
server/
├── package.json
├── .gitignore
├── src/
│   ├── interfaces/
│   │   └── http/
│   │       └── controllers/
│   │           ├── .gitkeep
│   │           ├── CreateTodoController.js
│   │           ├── UpdateTodoDetailsController.js
│   │           ├── MarkTodoAsCompletedController.js
│   │           ├── MarkTodoAsReopenedController.js
│   │           ├── DeleteTodoController.js
│   │           ├── GetAllTodosController.js
│   │           ├── GetTodoDetailsController.js
│   │           ├── GetActiveTodosController.js
│   │           └── GetCompletedTodosController.js
│   ├── config/
│   │   └── index.js
│   ├── infrastructure/
│   │   └── db/
│   │       ├── mongo.js
│   │       ├── memory.js
│   │       ├── index.js
│   │       └── sqlite.js
│   ├── bootstrap/
│   │   ├── app.js
│   │   ├── express.js
│   │   └── loader.js
│   ├── docs/
│   │   └── .gitkeep
│   ├── routes/
│   │   └── index.js
│   └── domain/
│       ├── entity/
│       │   └── Todo.js
│       ├── command/
│       │   ├── CreateTodoCommand.js
│       │   ├── UpdateTodoDetailsCommand.js
│       │   ├── MarkTodoAsCompletedCommand.js
│       │   ├── MarkTodoAsReopenedCommand.js
│       │   └── DeleteTodoCommand.js
│       └── readmodel/
│           ├── GetAllTodosReadModel.js
│           ├── GetTodoDetailsReadModel.js
│           ├── GetActiveTodosReadModel.js
│           └── GetCompletedTodosReadModel.js
├── server.js
└── .env.example
```

Route Codes:
=== FILE: root/src/routes/index.js ===
```javascript
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const controllersPath = path.join(__dirname, '../interfaces/http/controllers');

const files = fs.readdirSync(controllersPath);

for (const file of files) {
  if (!file.endsWith('.js')) continue;

  const modulePath = pathToFileURL(path.join(controllersPath, file)).href;
  const controller = await import(modulePath);

  if (controller.default?.router && controller.default?.routeBase) {
    router.use(controller.default.routeBase, controller.default.router);
  }
}

export default router;
```

Example Codes:

=== FILE: src/domain/readmodel/GetAllTodosReadModel.js ===
```javascript
import db from '../../infrastructure/db/index.js';

class GetAllTodosReadModel {
  static async query() {
    return await db.findAll('<entity name here>');
  }
}

export default GetAllTodosReadModel;
```

=== FILE: src/interfaces/http/controllers/GetAllTodosController.js ===
```javascript
import express from 'express';
import GetAllTodosReadModel from '../../../domain/todo/readmodel/GetAllTodosReadModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const todos = await GetAllTodosReadModel.query();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

export default {
  routeBase: '/todos',
  router,
};
```

Old Files:
[]

Old ReadModel Information:
undefined

Current ReadModel Information:
{"id":"eb332c60-655b-4f0d-82ce-5a0d2454f8ac","description":"Get Todo Details","cardinality":"one-to-many","dataFields":[{"name":"Todo Title","type":null},{"name":"Description","type":null},{"name":"Due Date","type":null},{"name":"Status","type":null},{"name":"Created Date","type":null},{"name":"Last Modified Date","type":null}],"gwtDescriptions":["Given an existing todo, When the user clicks 'Delete', Then the todo is removed from the system."]}

Swagger Documentation:
openapi: 3.0.0
info:
  title: Todo App API
  version: 1.0.0
  description: API for managing a Todo.
servers:
  - url: http://localhost:3000
    description: Local Development Server
paths:
  /get-todo-details:
    get:
      summary: Get Todo Details
      tags:
        - Read Models
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                properties:
                  todoTitle:
                    type: string
                  description:
                    type: string
                  dueDate:
                    type: string
                  status:
                    type: string
                  createdDate:
                    type: string
                  lastModifiedDate:
                    type: string
        '400':
          description: Bad Request
      parameters: []
components:
  schemas:
    Todo:
      type: object
      properties:
        todoID:
          type: string
          example: T-001
        title:
          type: string
          example: Buy Groceries
        description:
          type: string
          example: Milk, Eggs, Bread
        dueDate:
          type: string
          example: '2023-10-26'
        priority:
          type: string
          example: High
        status:
          type: string
          example: Active
        completionNotes:
          type: string
          example: All items purchased
        actualCompletionDate:
          type: string
          example: '2023-10-25'
        timeSpentMinutes:
          type: string
          example: '60'
        satisfactionRating:
          type: string
          example: '5'
        reopenReason:
          type: string
          example: Needs review
        priorityAdjustment:
          type: string
          example: Increase to Critical
        estimatedEffortHours:
          type: string
          example: '2'
        deletionReason:
          type: string
          example: Duplicate
        deletionComment:
          type: string
          example: Created by mistake
        confirmDeletion:
          type: string
          example: 'true'
        retainForDays:
          type: string
          example: '30'


Update the given code files or create new ones if needed.
Output only the updated or newly added code files, excluding any unchanged content.
