// Comprehensive phone number validation utility
// Focused on Indian numbers with international support

export interface PhoneValidationResult {
  isValid: boolean;
  isDummy: boolean;
  isIndian: boolean;
  formatted: string;
  errors: string[];
}

// Common dummy number patterns to reject
const DUMMY_PATTERNS = [
  /^0{10}$/, // 0000000000
  /^1{10}$/, // 1111111111
  /^2{10}$/, // 2222222222
  /^3{10}$/, // 3333333333
  /^4{10}$/, // 4444444444
  /^5{10}$/, // 5555555555
  /^6{10}$/, // 6666666666
  /^7{10}$/, // 7777777777
  /^8{10}$/, // 8888888888
  /^9{10}$/, // 9999999999
  /^1234567890$/, // Sequential
  /^0123456789$/, // Sequential
  /^9876543210$/, // Reverse sequential
  /^1122334455$/, // Pattern
  /^1212121212$/, // Alternating
];

// Indian mobile number validation
const INDIAN_MOBILE_PREFIXES = ['6', '7', '8', '9'];

export function validatePhoneNumber(phone: string): PhoneValidationResult {
  const result: PhoneValidationResult = {
    isValid: false,
    isDummy: false,
    isIndian: false,
    formatted: '',
    errors: []
  };

  if (!phone || !phone.trim()) {
    result.errors.push('Phone number is required');
    return result;
  }

  // Clean the phone number - remove spaces, hyphens, parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Basic length validation
  if (cleanPhone.length < 10) {
    result.errors.push('Phone number must be at least 10 digits');
    return result;
  }

  if (cleanPhone.length > 15) {
    result.errors.push('Phone number cannot exceed 15 digits');
    return result;
  }

  // Check if it's all digits
  if (!/^\d+$/.test(cleanPhone)) {
    result.errors.push('Phone number must contain only digits');
    return result;
  }

  // Check for dummy patterns
  const is10DigitDummy = cleanPhone.length === 10 && DUMMY_PATTERNS.some(pattern => pattern.test(cleanPhone));
  const is13DigitDummy = cleanPhone.length === 13 && cleanPhone.startsWith('91') && 
    DUMMY_PATTERNS.some(pattern => pattern.test(cleanPhone.slice(2)));
  
  if (is10DigitDummy || is13DigitDummy) {
    result.isDummy = true;
    result.errors.push('Please enter a valid phone number (dummy numbers not allowed)');
    return result;
  }

  // Validate Indian numbers
  let mobileNumber = '';
  
  if (cleanPhone.length === 10) {
    // Direct 10-digit number
    mobileNumber = cleanPhone;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('91')) {
    // +91 prefix
    mobileNumber = cleanPhone.slice(2);
    result.isIndian = true;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    // 91 prefix without +
    mobileNumber = cleanPhone.slice(2);
    result.isIndian = true;
  }

  if (mobileNumber) {
    // Check if it's a valid Indian mobile number
    const firstDigit = mobileNumber.charAt(0);
    if (INDIAN_MOBILE_PREFIXES.includes(firstDigit)) {
      result.isIndian = true;
      result.isValid = true;
      result.formatted = formatIndianNumber(mobileNumber);
    } else {
      result.errors.push('Indian mobile numbers must start with 6, 7, 8, or 9');
      return result;
    }
  } else {
    // International number validation (basic)
    if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
      result.isValid = true;
      result.formatted = formatInternationalNumber(cleanPhone);
    } else {
      result.errors.push('Please enter a valid phone number');
    }
  }

  return result;
}

function formatIndianNumber(number: string): string {
  // Format as +91 XXXXX XXXXX
  return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
}

function formatInternationalNumber(number: string): string {
  // Basic international formatting
  if (number.length <= 10) {
    return number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  return `+${number}`;
}

// Utility function for real-time formatting as user types
export function formatPhoneInput(value: string): string {
  const cleanValue = value.replace(/[^\d]/g, '');
  
  if (cleanValue.length === 0) return '';
  
  if (cleanValue.length <= 10) {
    // Format as Indian number while typing
    if (cleanValue.length <= 5) {
      return cleanValue;
    }
    return `${cleanValue.slice(0, 5)} ${cleanValue.slice(5)}`;
  }
  
  // For longer numbers, basic formatting
  return cleanValue;
}

// Quick validation for forms (returns boolean)
export function isValidPhoneNumber(phone: string): boolean {
  const result = validatePhoneNumber(phone);
  return result.isValid && !result.isDummy;
}

// Get user-friendly error message
export function getPhoneErrorMessage(phone: string): string {
  const result = validatePhoneNumber(phone);
  return result.errors[0] || '';
}