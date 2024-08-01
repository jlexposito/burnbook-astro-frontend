import rss from '@astrojs/rss';
import { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const recipes = await getCollection("recipes");
    return rss({
        title: 'Burnbook Recipes',
        description: 'Curated list of recipes that we love',
        site: context.site,
        items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
        items: recipes.map((recipes) => ({
            title: recipe.data.title,
            pubDate: recipe.data.pubDate,
            description: recipe.data.description,
            link: `/posts/${recipe.slug}/`,
        })),
        customData: `<language>es-es</language>`,
    })
}