import type { CollectionEntry } from 'astro:content'

import OptimizedImage from "@solidcomponents/OptimizedImage";
import { ImgSizeTypes, type ImgSizes } from '@utils/interfaces';

export default function RecipeCard(props: {
  recipe: CollectionEntry<'recipes'> | null;
  lazyLoad: boolean;
}) {
  const recipe = (): CollectionEntry<'recipes'> => {
    return props.recipe;
  };
  const getIngredientsString = (): string => {
    let ingredients_string = "";
    recipe().data.ingredients.forEach((element, index: number) => {
      let name = element.ingredient.name.toLowerCase();
      if (index == 0) ingredients_string = name;
      else ingredients_string = ingredients_string + ", " + name;
    });
    return ingredients_string;
  };
  const imageSizes = (): ImgSizes  => {
    return {
        sizes: [
          {
            size: 180,
            media: "(max-width: 550px) 180px",
          },
          {
            size: 220,
            media: ", 220px",
          },
        ]
      }
  };

  return (
    <>
      <a href={"/recipes/" + recipe().slug}>
        <div class="bg-base-100 grid grid-cols-3 overflow-hidden rounded-xl bg-white shadow-md h-[240px] sm:h-[220px]">
          <div class="col-span-1 min-h-full">
            <figure class="h-full">
              {!recipe().data.image ? (
                <div class="flex h-full w-full bg-slate-100">
                  <div class="m-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M17 12c0 .54-.1 1.05-.26 1.54L15 11.78A3.057 3.057 0 0 0 12.22 9l-1.76-1.74c.49-.16 1-.26 1.54-.26c2.76 0 5 2.24 5 5M9.88 4h4.24l1.83 2H20v10.8l1.88 1.88c.08-.21.12-.44.12-.68V6c0-1.11-.89-2-2-2h-3.17L15 2H9L7.18 4L8.6 5.4L9.88 4m12.23 17.46l-1.27 1.27L18.11 20H4a2 2 0 0 1-2-2V6c0-.58.25-1.1.65-1.46L1.11 3l1.28-1.27l19.72 19.73M9 12c0 1.66 1.34 3 3 3c.33 0 .65-.07.94-.17l-3.77-3.77c-.1.3-.17.61-.17.94m7.11 6l-1.66-1.66c-.73.41-1.56.66-2.45.66c-2.76 0-5-2.24-5-5c0-.89.25-1.72.66-2.45L4.11 6H4v12h12.11Z"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                <OptimizedImage
                  lazyLoad={props.lazyLoad}
                  width={200}
                  height={220}
                  classes={"h-full min-w-full flex-1 object-cover"}
                  altTitle={recipe().data.title}
                  filename={recipe().data.image}
                  sizes={imageSizes()}
                  sizeType={ImgSizeTypes.height}
                />
              )}
            </figure>
          </div>
          <div class="col-span-2 flex h-full flex-col justify-around px-2 py-3">
            <div>
              <h2 class="line-clamp-2 font-sans text-2xl font-bold tracking-tight">
                {props.recipe.data.title}
              </h2>
              <div class="text-secondary-contrast mb-3 mt-4 font-semibold">
                <span class="inline-block">
                  <svg
                    class="inline-block w-6  align-text-bottom"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </span>
                <span class="align-text-baseline ml-1 text-xl font-medium">
                  {props.recipe.data.cooking_time} m
                </span>
              </div>
            </div>
            <div>
              <p class="text-secondary-contrast line-clamp-2 sm:line-clamp-3">
                {getIngredientsString()}
              </p>
            </div>
          </div>
        </div>
      </a>
    </>
  );
}
