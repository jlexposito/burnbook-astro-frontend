import { Component } from "solid-js";

import { ComboboxOption } from "@utils/interfaces";
import FormInput from "@solidcomponents/formComponents/FormInput";
import { SelectInput } from "@solidcomponents/formComponents/ZagSelectInput";

const RecipeIngredientForm: Component<{
  options: ComboboxOption[];
  unitOptions: ComboboxOption[];
}> = (props) => {

  return (
    <>
      <div class="ingredient-form mt-2 border-gray-300 border-b-2 border-dashed mb-6 pb-4 md:border-0 md:mb-0 md:pb-0 last:border-0 last:mb-0 last:pb-2">
        <div class="flex flex-wrap">
          <div class="w-full sm:w-1/2 md:w-1/5 px-1 lg:px-3 md:mb-0">
            <FormInput
              name="prefix[]"
              autocomplete="off"
              label="Ingredient prefix"
            />
          </div>
          <div class="w-full sm:w-1/2 md:w-2/5 px-1 lg:px-3 md:mb-0">
            <SelectInput
              label={"Ingredient"}
              name={"ingredients[]"}
              options={props.options}
              allowCreate={true}
            />
          </div>
          <div class="w-1/2 md:w-1/5 px-1 lg:px-3 md:mb-0">
            <FormInput
              name="quantity[]"
              label="quantity"
              type="number"
              min="0"
              value={12}
              required={true}
            />
          </div>
          <div class="w-1/2 md:w-1/5 px-1 lg:px-3 md:mb-0">
            <SelectInput
              label={"Unit"}
              name={"unit[]"}
              options={props.unitOptions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeIngredientForm;
