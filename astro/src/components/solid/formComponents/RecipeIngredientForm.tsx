import { type Component } from "solid-js";

import { type ComboboxOption, type RecipeIngredient, type Unit } from "@utils/interfaces";
import FormInput from "@solidcomponents/formComponents/FormInput";
import { SelectInput } from "@solidcomponents/formComponents/SelectInput";

const RecipeIngredientForm: Component<{
  id: string;
  unitOptions: ComboboxOption[];
  ingredientData?: RecipeIngredient;
}> = (props) => {
  const prefix = props?.ingredientData?.ingredient?.prefix;
  const name = props?.ingredientData?.ingredient?.name;
  const quantity = props?.ingredientData?.quantity;
  const unit = props?.ingredientData?.unit;
  return (
    <>
      <div class="ingredient-form mb-6 mt-2 border-b-2 border-dashed border-gray-300 pb-4 last:mb-0 last:border-0 last:pb-2 md:mb-0 md:border-0 md:pb-0">
        <div class="flex flex-wrap items-end gap-y-2">
          <div class="w-full px-1 sm:w-1/2 md:mb-0 md:w-1/5 lg:px-1.5">
            <FormInput
              name="ingredient_prefix[]"
              autocomplete="off"
              label="Prefijo"
              value={prefix}
            />
          </div>
          <div class="w-full px-1 sm:w-1/2 md:mb-0 md:w-2/5 lg:px-1.5">
            <FormInput
              name="ingredient_name[]"
              autocomplete="off"
              label="Nombre"
              value={name}
            />
          </div>
          <div class="w-1/2 px-1 md:mb-0 md:w-1/5 lg:px-1.5">
            <FormInput
              name="ingredient_quantity[]"
              label="Cantidad"
              type="number"
              min="1"
              required={true}
              classes={"text-center"}
              value={quantity}
            />
          </div>
          <div class="w-1/2 px-1 md:mb-0 md:w-1/5 lg:px-1.5">
            <SelectInput
              label="Unidad"
              name="ingredient_unit[]"
              options={props.unitOptions}
              classes={"text-center"}
              required={true}
              value={[unit]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeIngredientForm;
