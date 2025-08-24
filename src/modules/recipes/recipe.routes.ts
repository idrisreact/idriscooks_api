import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { recipeRepository } from './recipe.store';

const RecipeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().default(''),
  ingredients: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

const CreateRecipeSchema = RecipeSchema.omit({ id: true });
const UpdateRecipeSchema = CreateRecipeSchema.partial();

export async function registerRecipeRoutes(app: FastifyInstance) {
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
    return recipeRepository.listRecipes();
  });

  app.get('/recipes/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }).strict(),
    },
  }, async (req) => {
    const { id } = req.params as { id: string };
    const recipe = await recipeRepository.getRecipeById(id);
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
    const recipe = await recipeRepository.createRecipe(req.body as z.infer<typeof CreateRecipeSchema>);
    reply.code(201);
    return recipe;
  });

  app.put('/recipes/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }).strict(),
      body: UpdateRecipeSchema,
    },
  }, async (req) => {
    const { id } = req.params as { id: string };
    const updated = await recipeRepository.updateRecipe(id, req.body as z.infer<typeof UpdateRecipeSchema>);
    if (!updated) {
      throw app.httpErrors.notFound('Recipe not found');
    }
    return updated;
  });

  app.delete('/recipes/:id', {
    schema: {
      params: z.object({ id: z.string().uuid() }).strict(),
    },
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const deleted = await recipeRepository.deleteRecipe(id);
    if (!deleted) {
      throw app.httpErrors.notFound('Recipe not found');
    }
    reply.code(204);
    return null;
  });
}

export type Recipe = z.infer<typeof RecipeSchema>;
export type CreateRecipeInput = z.infer<typeof CreateRecipeSchema>;
export type UpdateRecipeInput = z.infer<typeof UpdateRecipeSchema>;



