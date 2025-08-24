import { randomUUID } from 'node:crypto';
import { CreateRecipeInput, Recipe, UpdateRecipeInput } from './recipe.routes';

class InMemoryRecipeRepository {
  private recipesById: Map<string, Recipe> = new Map();

  async listRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipesById.values());
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    return this.recipesById.get(id);
  }

  async createRecipe(input: CreateRecipeInput): Promise<Recipe> {
    const recipe: Recipe = {
      id: randomUUID(),
      title: input.title,
      description: input.description ?? '',
      ingredients: input.ingredients ?? [],
      steps: input.steps ?? [],
      tags: input.tags ?? [],
    };
    this.recipesById.set(recipe.id, recipe);
    return recipe;
  }

  async updateRecipe(id: string, input: UpdateRecipeInput): Promise<Recipe | undefined> {
    const existing = this.recipesById.get(id);
    if (!existing) return undefined;
    const updated: Recipe = {
      ...existing,
      ...input,
    };
    this.recipesById.set(id, updated);
    return updated;
  }

  async deleteRecipe(id: string): Promise<boolean> {
    return this.recipesById.delete(id);
  }
}

export const recipeRepository = new InMemoryRecipeRepository();



