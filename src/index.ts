import fastify from 'fastify';
import { ZodTypeProvider, jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import sensible from '@fastify/sensible';
import dotenv from 'dotenv';
import { registerRecipeRoutes } from './modules/recipes/recipe.routes';

dotenv.config()

async function buildServer() {
  const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  // Enable Zod runtime validation and serialization
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Recipes API',
        description: 'Fastify REST API for managing recipes',
        version: '1.0.0',
      },
      servers: [{ url: '/' }],
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  });

  await app.register(sensible);

  await registerRecipeRoutes(app);

  return app;
}

async function start() {
  const app = await buildServer();
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen({ port, host });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});

export type AppInstance = Awaited<ReturnType<typeof buildServer>>;


