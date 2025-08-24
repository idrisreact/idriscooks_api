"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recipeRepository = void 0;
const node_crypto_1 = require("node:crypto");
class InMemoryRecipeRepository {
    constructor() {
        this.recipesById = new Map();
    }
    async listRecipes() {
        return Array.from(this.recipesById.values());
    }
    async getRecipeById(id) {
        return this.recipesById.get(id);
    }
    async createRecipe(input) {
        const recipe = {
            id: (0, node_crypto_1.randomUUID)(),
            title: input.title,
            description: input.description ?? '',
            ingredients: input.ingredients ?? [],
            steps: input.steps ?? [],
            tags: input.tags ?? [],
        };
        this.recipesById.set(recipe.id, recipe);
        return recipe;
    }
    async updateRecipe(id, input) {
        const existing = this.recipesById.get(id);
        if (!existing)
            return undefined;
        const updated = {
            ...existing,
            ...input,
        };
        this.recipesById.set(id, updated);
        return updated;
    }
    async deleteRecipe(id) {
        return this.recipesById.delete(id);
    }
}
exports.recipeRepository = new InMemoryRecipeRepository();
