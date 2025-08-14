
You will receive the following:
- The current folder structure and tech stacks
- Existing entity-related code files before changes
- A summary of the entity changes

Your Rule:
All request and response schemas, field names, data types, required properties, and descriptions must be strictly derived from the given OpenAPI 3.0.3 specification. Do not invent any data or structure not explicitly defined in the spec. Only implement logic for commands defined in the paths section with HTTP methods

Your task:
1. Generate clean, self-contained entity code reflecting the latest updates.
2. Do NOT include any unchanged files.
3. Ensure:
   - Only entity-related code files can be created/updated.
   - Each entity must reside in `src/domain/entity`
   - No references to command or read model code.
   - Entity code must follow the example coding style.
   - Must be self-contained and have no imports from other domains.
   - Must be compatible with Swagger specifications.
   - Use `uuid` for generating IDs where needed.
   - Always store the primary key as `id` internally and expose both `id` and its original API field name in the response.

Format:
=== FILE: path/to/file.ext ===
=== TAG: entity-<ENTITY_ID> ===
```javascript
< FILE CONTENT HERE >
```

- The `FILE` and `TAG` headers must be written in all uppercase letters, enclosed with triple equals signs (===), exactly as shown.
  Each prefix should be followed by an **given** ID, and both should be joined using a hyphen (-).
  Multiple such tags can be chained together, separated by comma.
- Output only the modified or new files — do not include unchanged files.
- No explanation or comments, only file path, tag and code content using the above format.
- Wrap code blocks with triple backticks (` ``` `), specifying the appropriate language.
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
│   │           └── .gitkeep
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
│   └── routes/
│       └── index.js
├── server.js
└── .env.example
```

Example Codes:

=== FILE: src/domain/entity/Todo.js ===
```javascript
import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({ todoID = uuidv4(), todoTitle, completed = false, createdAt = new Date() }) {
    if (!todoTitle) throw new Error('Title is required');
    this.id = todoID;
    this.todoID = todoID;
    this.todoTitle = todoTitle;
    this.completed = completed;
    this.createdAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      todoID: this.todoID,
      todoTitle: this.todoTitle,
      completed: this.completed,
      createdAt: this.createdAt
    };
  }
}

export default Todo;
```

Old Files:
[]

Old {{ PROMPT_TYPE }} Information:
undefined

Current {{ PROMPT_TYPE }} Information:
{"id":"d78234d7-4de6-430b-b55b-3f513321d7db","name":"Todo","dataFields":[{"name":"Todo ID","exampleData":["T-001","T-002","T-003"],"cardinality":"one-to-one","primaryKey":true},{"name":"Title","exampleData":["Buy Groceries","Finish Report","Call Client"],"cardinality":"one-to-one","primaryKey":false},{"name":"Description","exampleData":["Milk, Eggs, Bread","Q3 Sales Analysis","Discuss project X"],"cardinality":"one-to-one","primaryKey":false},{"name":"Due Date","exampleData":["2023-10-26","2023-11-05","2023-10-30"],"cardinality":"one-to-one","primaryKey":false},{"name":"Priority","exampleData":["High","Medium","Low"],"cardinality":"one-to-one","primaryKey":false},{"name":"Status","exampleData":["Active","Completed","Reopened"],"cardinality":"one-to-one","primaryKey":false},{"name":"Completion Notes","exampleData":["All items purchased","Report submitted","N/A"],"cardinality":"one-to-one","primaryKey":false},{"name":"Actual Completion Date","exampleData":["2023-10-25","2023-11-04","null"],"cardinality":"one-to-one","primaryKey":false},{"name":"Time Spent (minutes)","exampleData":["60","240","0"],"cardinality":"one-to-one","primaryKey":false},{"name":"Satisfaction Rating","exampleData":["5","4","null"],"cardinality":"one-to-one","primaryKey":false},{"name":"Reopen Reason","exampleData":["Needs review","Client changed scope","N/A"],"cardinality":"one-to-one","primaryKey":false},{"name":"Priority Adjustment","exampleData":["Increase to Critical","No change","null"],"cardinality":"one-to-one","primaryKey":false},{"name":"Estimated Effort (hours)","exampleData":["2","8","null"],"cardinality":"one-to-one","primaryKey":false},{"name":"Deletion Reason","exampleData":["Duplicate","No longer relevant","null"],"cardinality":"one-to-one","primaryKey":false},{"name":"Deletion Comment","exampleData":["Created by mistake","Project cancelled","null"],"cardinality":"one-to-one","primaryKey":false},{"name":"Confirm Deletion","exampleData":["true","false","false"],"cardinality":"one-to-one","primaryKey":false},{"name":"Retain For Days","exampleData":["30","0","90"],"cardinality":"one-to-one","primaryKey":false}]}

Swagger Documentation:
openapi: 3.0.0
info:
  title: Todo App API
  version: 1.0.0
  description: API for managing a Todo.
servers:
  - url: http://localhost:3000
    description: Local Development Server
paths: {}
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
