export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validateForm = (formData) => {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.name && !validateName(formData.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  return errors;
};
