"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRecipeRoutes = registerRecipeRoutes;
const zod_1 = require("zod");
const recipe_store_1 = require("./recipe.store");
const RecipeSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().default(''),
    ingredients: zod_1.z.array(zod_1.z.string()).default([]),
    steps: zod_1.z.array(zod_1.z.string()).default([]),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
});
const CreateRecipeSchema = RecipeSchema.omit({ id: true });
const UpdateRecipeSchema = CreateRecipeSchema.partial();
async function registerRecipeRoutes(app) {
    app.addSchema({ $id: 'Recipe', type: 'object', properties: {} });
    app.get('/health', async () => ({ status: 'ok' }));
    app.get('/recipes', {
        schema: {
            response: {
                200: {
                    description: 'List recipes',
                    type: 'array',
                    items: { type: 'object' },
                },
            },
        },
    }, async () => {
        return recipe_store_1.recipeRepository.listRecipes();
    });
    app.get('/recipes/:id', {
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string().uuid() }).strict(),
        },
    }, async (req) => {
        const { id } = req.params;
        const recipe = await recipe_store_1.recipeRepository.getRecipeById(id);
        if (!recipe) {
            throw app.httpErrors.notFound('Recipe not found');
        }
        return recipe;
    });
    app.post('/recipes', {
        schema: {
            body: CreateRecipeSchema,
            response: { 201: RecipeSchema },
        },
    }, async (req, reply) => {
        const recipe = await recipe_store_1.recipeRepository.createRecipe(req.body);
        reply.code(201);
        return recipe;
    });
    app.put('/recipes/:id', {
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string().uuid() }).strict(),
            body: UpdateRecipeSchema,
        },
    }, async (req) => {
        const { id } = req.params;
        const updated = await recipe_store_1.recipeRepository.updateRecipe(id, req.body);
        if (!updated) {
            throw app.httpErrors.notFound('Recipe not found');
        }
        return updated;
    });
    app.delete('/recipes/:id', {
        schema: {
            params: zod_1.z.object({ id: zod_1.z.string().uuid() }).strict(),
        },
    }, async (req, reply) => {
        const { id } = req.params;
        const deleted = await recipe_store_1.recipeRepository.deleteRecipe(id);
        if (!deleted) {
            throw app.httpErrors.notFound('Recipe not found');
        }
        reply.code(204);
        return null;
    });
}
