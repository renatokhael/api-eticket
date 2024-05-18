# E-Ticket RESTful API

This is a RESTful API for **participant management** in in-person events. It has well-defined resources to handle operations such as creating, reading, updating, and deleting (CRUD) participants, as well as additional functionalities for managing the events themselves.

## Resources

### Events

- **GET /events:** Returns the list of all events.
- **GET /events/{id}:** Returns details of a specific event.
- **POST /events:** Creates a new event.
- **PUT /events/{id}:** Updates the details of an existing event.
- **DELETE /events/{id}:** Deletes an event.

### Participants

- **GET /events/{event_id}/participants:** Returns the list of participants for a specific event.
- **GET /participants/{id}:** Returns details of a specific participant.
- **POST /events/{event_id}/participants:** Adds a new participant to an event.
- **PUT /participants/{id}:** Updates the details of an existing participant.
- **DELETE /participants/{id}:** Removes a participant.

## Data Structure

### Event

```json
{
    "id": "string",
    "name": "string",
    "description": "string",
    "date": "string (ISO format)",
    "location": "string"
}

### Participants

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "event_id": "string (reference to the event)"
}
```
## Bibliotecas e Ferramentas:

- [Fastify](https://fastify.dev/): For routing and handling HTTP requests.
- [Prisma](https://www.prisma.io/) ORM for modeling and interacting with the database (MongoDB, MySQL, PostgreSQL, etc.).
- [Body-parser](https://www.npmjs.com/package/body-parser): For parsing JSON request bodies.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For authentication and authorization (if needed).
- [bcrypt](https://www.npmjs.com/package/bcrypt): For encrypting passwords (if user authentication is needed).
- [Zod](https://zod.dev/): For data validation.
- [Helmet](https://helmetjs.github.io/): For protection against various web vulnerabilities.
- - [Swagger](https://github.com/fastify/fastify-swagger-ui): To document the routes.

### Fluxo de trabalho:

1. Receive HTTP requests through Fastify.
2. Route to appropriate request handlers.
3. Validate and process data using Zod and other tools as needed.
4. Interact with the database using Prisma/SQLite.
5. Return appropriate responses.
6. Documentation using Swagger.



### Database Schema (SQL)

```sql
-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "slug" TEXT NOT NULL,
    "maximum_attendees" INTEGER
);

-- CreateTable
CREATE TABLE "participants" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "check_ins" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participantId" INTEGER NOT NULL,
    CONSTRAINT "check_ins_attendeeId_fkey" FOREIGN KEY ("participantId") REFERENCES "participants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "participants"("event_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_attendeeId_key" ON "check_ins"("participantId");
```


Developed with 💓 by Renato Khael

Visit: [renatokhael.dev](https://renatokhael.dev)
