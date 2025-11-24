// Validation utilities for API routes

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Password strength validation
const isValidPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// URL validation
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// UUID validation
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Credit card validation (basic Luhn algorithm)
const isValidCreditCard = (number) => {
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Date validation
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Price validation
const isValidPrice = (price) => {
  return typeof price === 'number' && price >= 0 && isFinite(price);
};

// Quantity validation
const isValidQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity > 0;
};

// Sanitize input (remove HTML tags and scripts)
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim();
};

// Validate required fields
const validateRequiredFields = (data, requiredFields) => {
  const errors = [];
  
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  }
  
  return errors;
};

// Validate field types
const validateFieldTypes = (data, fieldTypes) => {
  const errors = [];
  
  for (const [field, type] of Object.entries(fieldTypes)) {
    if (data[field] !== undefined && data[field] !== null) {
      const actualType = Array.isArray(data[field]) ? 'array' : typeof data[field];
      if (actualType !== type) {
        errors.push(`${field} must be of type ${type}`);
      }
    }
  }
  
  return errors;
};

// Validate field lengths
const validateFieldLengths = (data, fieldLengths) => {
  const errors = [];
  
  for (const [field, { min, max }] of Object.entries(fieldLengths)) {
    if (data[field] && typeof data[field] === 'string') {
      const length = data[field].length;
      if (min !== undefined && length < min) {
        errors.push(`${field} must be at least ${min} characters`);
      }
      if (max !== undefined && length > max) {
        errors.push(`${field} must be at most ${max} characters`);
      }
    }
  }
  
  return errors;
};

// Validate enum values
const validateEnumValues = (data, fieldEnums) => {
  const errors = [];
  
  for (const [field, validValues] of Object.entries(fieldEnums)) {
    if (data[field] && !validValues.includes(data[field])) {
      errors.push(`${field} must be one of: ${validValues.join(', ')}`);
    }
  }
  
  return errors;
};

// Main validation function
const validate = (data, rules) => {
  const errors = [];
  
  // Required fields
  if (rules.required) {
    errors.push(...validateRequiredFields(data, rules.required));
  }
  
  // Field types
  if (rules.types) {
    errors.push(...validateFieldTypes(data, rules.types));
  }
  
  // Field lengths
  if (rules.lengths) {
    errors.push(...validateFieldLengths(data, rules.lengths));
  }
  
  // Enum values
  if (rules.enums) {
    errors.push(...validateEnumValues(data, rules.enums));
  }
  
  // Custom validations
  if (rules.custom) {
    for (const [field, validator] of Object.entries(rules.custom)) {
      if (data[field] !== undefined) {
        const result = validator(data[field], data);
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : `${field} is invalid`);
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export all validation functions
module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidUrl,
  isValidUUID,
  isValidCreditCard,
  isValidDate,
  isValidPrice,
  isValidQuantity,
  sanitizeInput,
  validateRequiredFields,
  validateFieldTypes,
  validateFieldLengths,
  validateEnumValues,
  validate
};
