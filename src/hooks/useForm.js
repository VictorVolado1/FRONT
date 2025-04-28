import { useState } from "react";

export const useForm = (initialForm = {}) => {
  const [formState, setFormState] = useState(initialForm);

  /**
   * Updates the form state when an input value changes.
   *
   * @param {Object} target - The target input element.
   * @param {string} target.name - The name of the input.
   * @param {string} target.value - The new value of the input.
   * @return {void}
   */
  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  /**
   * Resets the form state to its initial values.
   *
   * @return {void} This function does not return anything.
   */
  const onResetForm = () => {
    setFormState(initialForm);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
  };
};
