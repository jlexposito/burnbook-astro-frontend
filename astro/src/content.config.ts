// Import utilities from `astro:content`
import { defineCollection } from "astro:content";
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const Ingredient = z.object({
  name: z.string(),
  prefix: z.string()
});

const IngredientRecipe = z.object({
  id: z.number(),
  ingredient: Ingredient,
  optional: z.boolean(),
  quantity: z.string(),
  unit: z.string(),
  recipe: z.number().optional(),
})

// Define a `type` and `schema` for each collection
const recipeCollection = defineCollection({
    // ⚡ REQUIRED IN ASTRO 6: Tell it exactly where to find the files
    loader: glob({ 
      pattern: '**/[^_]*.md', // matches all non-private markdown files
      base: './src/content/recipes' 
    }),
    schema: z.object({
      cooking_time: z.number(),
      created: z.string(),
      id: z.number(),
      image: z.nullable(z.string().optional()),
      ingredients: z.array(IngredientRecipe),
      references: z.array(z.string()),
      servings: z.number(),
      status: z.string().optional(),
      title: z.string(),
      tags: z.array(z.string()),
      updated: z.string(),
    })
});
// Export a single `collections` object to register your collection(s)
export const collections = {
  recipes: recipeCollection,
};