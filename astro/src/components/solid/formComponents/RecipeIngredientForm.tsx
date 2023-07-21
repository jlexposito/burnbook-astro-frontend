import { v4 as uuidv4 } from "uuid";
import FormInput from "@solidcomponents/formComponents/FormInput";
import Select from "@solidcomponents/formComponents/SelectInput";
import LabelComponent from "./LabelComponent";

export default function RecipeIngredientForm() {
  const ingredientSelectId = uuidv4();
  const unitSelectId = uuidv4();
  const options = ["apple", "bannana"]
  return (
    <>
      <div class="ingredient-form mt-4 border-b-blue-300 px-6 py-3">
        <div class="flex flex-wrap -mx-3">
        <div class="w-full md:w-2/6 px-3 md:mb-0">
            <FormInput name="prefix[]" autocomplete="off" label="Ingredient prefix" />
          </div>
          <div class="w-full md:w-2/6 px-3 md:mb-0">
            <LabelComponent label="Ingredient name" id={ingredientSelectId} />
            <Select options={options} name="ingredient_name[]" placeholder="search..." id={ingredientSelectId} />
          </div>
          <div class="w-full md:w-1/6 px-3 md:mb-0">
            <LabelComponent label="Unit" id={unitSelectId} />
            <Select options={options} name="ingredient_name[]" placeholder="" id={unitSelectId} />
          </div>
          <div class="w-full md:w-1/6 px-3 md:mb-0">
            <FormInput name="quantity[]" label="quantity" type="number" min="0" />
          </div>
        </div>
      </div>
    </>
  );
}
