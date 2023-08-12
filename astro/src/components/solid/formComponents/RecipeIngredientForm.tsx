import { Component, createUniqueId } from "solid-js";

import FormInput from "@solidcomponents/formComponents/FormInput";
import LabelComponent from "@solidcomponents/formComponents/LabelComponent";
import SelectInput from "@solidcomponents/formComponents/SelectInput";
import { Option } from "@utils/interfaces";


const RecipeIngredientForm: Component<{
  options: Option[];
  unitOptions: Option[];
}> = (props) => {
  const ingredientSelectId = createUniqueId();
  const unitSelectId = createUniqueId();

  return (
    <>
      <div class="ingredient-form mt-2 border-gray-300 border-b-2 border-dashed mb-6 pb-2 md:border-0 md:mb-0 md:pb-0 last:border-0 last:mb-0">
        <div class="flex flex-wrap -mx-3">
          <div class="w-full sm:w-1/2 md:w-2/6 px-3 md:mb-0">
            <FormInput
              name="prefix[]"
              autocomplete="off"
              label="Ingredient prefix"
            />
          </div>
          <div class="w-full sm:w-1/2 md:w-2/6 px-3 md:mb-0">
            <LabelComponent label="Ingredient name" id={ingredientSelectId} required={true}/>
            <SelectInput
              options={props.options}
              name="ingredient_name[]"
              placeholder="search..."
              id={ingredientSelectId}
              createable={true}
            />
          </div>
          <div class="w-1/2 md:w-1/6 px-3 md:mb-0">
            <FormInput
              name="quantity[]"
              label="quantity"
              type="number"
              min="0"
              value={12}
              required={true}
            />
          </div>
          <div class="w-1/2 md:w-1/6 px-3 md:mb-0">
            <LabelComponent label="Unit" id={unitSelectId} required={true} />
            <SelectInput
              options={props.unitOptions}
              name="unit[]"
              placeholder=""
              id={unitSelectId}
              createable={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeIngredientForm;
