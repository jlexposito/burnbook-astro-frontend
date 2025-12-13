import type { CollectionEntry } from 'astro:content';
import type { RecipeInterface } from './interfaces';

export function adaptRecipes(
  recipes: CollectionEntry<'recipes'>[]
): RecipeInterface[] {
  return recipes.map(r => ({
    id: r.id,
    slug: r.slug,
    title: r.data.title,
    status: r.data.status,
    image: r.data.image ?? "",
    cooking_time: r.data.cooking_time,
    servings: r.data.servings,
    ingredients: r.data.ingredients.map(i => ({
      quantity: i.quantity,
      unit: i.unit,
      ingredient: { name: i.ingredient.name, prefix: i.ingredient.prefix },
    })),
    references: r.data.references ?? [],
    tags: r.data.tags ?? [],
  }));
}
