## Recipes API Architecture

### Overview
This service is a Fastify-based REST API written in TypeScript. It exposes CRUD endpoints to manage recipes, validates request/response payloads via Zod, and ships with OpenAPI documentation via Swagger UI.

### Goals
- Fast startup and low overhead using Fastify
- Strong typing and runtime validation (TypeScript + Zod)
- Minimal, clean layering to support future growth

### Tech Stack
- Node.js + TypeScript
- Fastify (HTTP server)
- Zod + fastify-type-provider-zod (runtime validation + type inference)
- @fastify/swagger + @fastify/swagger-ui (OpenAPI docs)

### Project Structure
```
src/
  index.ts                         # Server bootstrap, plugins, routing registration
  modules/
    recipes/
      recipe.routes.ts             # HTTP routes, validation schemas, handlers
      recipe.store.ts              # Repository abstraction (in-memory for now)
```

### Layers and Responsibilities
- API Layer (`recipe.routes.ts`)
  - Defines Zod schemas for params, body, and responses
  - Implements handlers and HTTP error mapping
  - Does not contain persistence logic

- Repository Layer (`recipe.store.ts`)
  - Data access abstraction; currently in-memory using a Map
  - Can be replaced with a database adapter (PostgreSQL, MongoDB, etc.) without changing routes

### Endpoints
- `GET /health` – health check
- `GET /recipes` – list all recipes
- `GET /recipes/:id` – fetch single recipe
- `POST /recipes` – create recipe
- `PUT /recipes/:id` – update recipe
- `DELETE /recipes/:id` – delete recipe

All request bodies are validated using Zod, and 404 is returned when a recipe is not found.

### OpenAPI Docs
Swagger UI is available at `/docs`. The OpenAPI spec is provided by `@fastify/swagger`.

### Configuration
- `PORT` and `HOST` env variables control server binding (defaults 3000 and 0.0.0.0)

### Future Enhancements
- Replace in-memory store with persistent DB repository
- Add pagination, filtering, and search to `GET /recipes`
- Add authentication/authorization layer
- Add request logging correlation IDs and metrics
- Introduce domain services for more complex business rules


