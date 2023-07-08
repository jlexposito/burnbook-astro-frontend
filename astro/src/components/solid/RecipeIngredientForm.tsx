import { v4 as uuidv4 } from "uuid";

export default function RecipeIngredientForm() {
  return (
    <>
      <div class="ingredient-form mt-4 bg-slate-500 p-10">
        <h2 class="text-xl text-right">Ingredient X</h2>
        <hr />
        <div class="form-group">
          <label
            for="ingredient1"
            class="cursor-pointer block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ingredient
          </label>
          <input
            id="ingredient1"
            name="ingredient"
            list="europe-countries"
            placeholder="Ingredient name..."
          />
          <datalist id="europe-countries">
            {/*  Autopopulate */}
            <option>Russia</option>
            <option>Germany</option>
            <option>United Kingdom</option>
            <option>France</option>
            <option>Italy</option>
            <option>Spain</option>
            <option>Ukraine</option>
            <option>Poland</option>
            <option>Romania</option>
            <option>Netherlands</option>
            <option>Belgium</option>
          </datalist>
        </div>

        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-state"
            >
              Unit
            </label>
            <select
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-state"
            >
               {/*  Autopopulate */}
               <option>Gr</option>
              <option>ml</option>
              <option>tbsp</option>
            </select>
          </div>
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              for="grid-city"
            >
              Quantity
            </label>
            <input
              class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-city"
              type="number"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
