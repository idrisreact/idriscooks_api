"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const sensible_1 = __importDefault(require("@fastify/sensible"));
const recipe_routes_1 = require("./modules/recipes/recipe.routes");
async function buildServer() {
    const app = (0, fastify_1.default)({ logger: true }).withTypeProvider();
    // Enable Zod runtime validation and serialization
    app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
    app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
    await app.register(swagger_1.default, {
        openapi: {
            info: {
                title: 'Recipes API',
                description: 'Fastify REST API for managing recipes',
                version: '1.0.0',
            },
            servers: [{ url: '/' }],
        },
        transform: fastify_type_provider_zod_1.jsonSchemaTransform,
    });
    await app.register(swagger_ui_1.default, {
        routePrefix: '/docs',
    });
    await app.register(sensible_1.default);
    await (0, recipe_routes_1.registerRecipeRoutes)(app);
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
