/**
 * Validates a token by making a POST request to the "/api/validate-token" endpoint.
 *
 * @param {string} token - The token to validate.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating whether the token is valid.
 */
export const validateToken = async (token) => {
  try {
    //TODO validate token endpoint
    const response = await fetch("/api/validate-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Auth: `${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Token validation failed");
    }
    const data = await response.json();
    return data.valid; // Assuming the API returns { valid: true/false }
  } catch (error) {
    return false;
  }
};

/**
 * Validates a form based on provided values and exceptions.
 *
 * @param {object} values - The values to validate.
 * @param {array} exceptions - The exceptions to skip during validation.
 * @return {boolean} Returns true if form is valid, false otherwise.
 */
export const validateForm = (values = {}, exceptions = []) => {
  let shouldSkip = false;
  Object.keys(values).forEach((key) => {
    exceptions.includes[key];
    if (values[key] === "" && !shouldSkip && !exceptions.includes(key)) {
      shouldSkip = true;
    }
  });
  return !shouldSkip;
};
