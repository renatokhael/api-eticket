




# E-Ticket API RESTful


Essa é uma API RESTful para **gestão de participantes** em eventos presenciais. Ela possui recursos bem definidos para lidar com operações como criação, leitura, atualização e exclusão (CRUD) de participantes, além de funcionalidades adicionais para lidar com a gestão dos eventos em si. 

## Recursos

### Eventos

- **GET /events:** Retorna a lista de todos os eventos.
- **GET /events/{id}:** Retorna detalhes de um evento específico.
- **POST /events:** Cria um novo evento.
- **PUT /events/{id}:** Atualiza os detalhes de um evento existente.
- **DELETE /events/{id}:** Exclui um evento.

### Participants

- **GET /eventos/{evento_id}/participantes:** Retorna a lista de participantes para um evento específico.
- **GET /participantes/{id}:** Retorna detalhes de um participante específico.
- **POST /eventos/{evento_id}/participantes:** Adiciona um novo participante a um evento.
- **PUT /participantes/{id}:** Atualiza os detalhes de um participante existente.
- **DELETE /participantes/{id}:** Remove um participante.

## Estrutura de Dados

### Evento

```json
{
    "id": "string",
    "name": "string",
    "description": "string",
    "data": "string (formato ISO)",
    "location": "string"
}
```

### Participante

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "evento_id": "string (referência ao evento)"
}
```
## Bibliotecas e Ferramentas:

- [Fastify](https://fastify.dev/): Para roteamento e manipulação de solicitações HTTP.
- [Prisma](https://www.prisma.io/) ORM para modelagem e interação com o banco de dados MongoDB (ou MySQL, PostgreSQL etc.).
- [Body-parser](https://www.npmjs.com/package/body-parser): Para análise de corpo de solicitação JSON.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Para autenticação e autorização (se necessário).
- [bcrypt](https://www.npmjs.com/package/bcrypt): Para criptografar senhas (se houver autenticação de usuário).
- [Zod](https://zod.dev/): Para validação de entrada de dados.
- [Helmet](https://helmetjs.github.io/): Para proteção contra várias vulnerabilidades da web.
- - [Swagger](https://github.com/fastify/fastify-swagger-ui): Para documentar as rotas

### Fluxo de trabalho:

1. Receber solicitações HTTP através do Fastify.
2. Roteamento para manipuladores de solicitação apropriados.
3. Validar e processar dados usando Zod e outras ferramentas conforme necessário.
4. Interagir com o banco de dados usando Prisma/SQLite.
5. Retornar respostas adequadas.
6. Documentação usando Swagger



### Estrutura do banco (SQL)

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


Desenvolvido com 💓por **Renato Khael**

Acesse: [renatokhael.dev](https://renatokhael.dev)