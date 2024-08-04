import rss from '@astrojs/rss';
import { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const recipes = await getCollection("recipes");
    return rss({
        title: 'Burnbook Recipes',
        description: 'Curated list of recipes that we love',
        site: import.meta.env.SITE,
        items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
        items: recipes.map((recipe) => ({
            title: recipe.data.title,
            pubDate: recipe.data.updated,
            description: recipe.data.description,
            link: `/recipes/${recipe.slug}/`,
        })),
        customData: `<language>es-es</language>`,
    })
}