export const validateCreatePoll = (data) => {
  const { question, options, expiresAt } = data;

  if (!question || typeof question !== "string") {
    throw new Error("Question is required and must be a string.");
  }

  if (!Array.isArray(options) || options.length < 2) {
    throw new Error("At least 2 options are required.");
  }

  const cleanedOptions = options.map((opt) => opt.trim()).filter(Boolean);

  if (cleanedOptions.length < 2) {
    throw new Error("Options cannot be empty.");
  }

  const expiryDate = new Date(expiresAt);

  if (!expiresAt || isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
    throw new Error("Expiration must be a valid future date.");
  }

  return {
    question: question.trim(),
    options: cleanedOptions,
    expiresAt: expiryDate,
  };
};
