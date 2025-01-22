export const validateName = (name: string | File): { isValid: boolean; message: string } => {
  if (name instanceof File) {
    return { isValid: false, message: "Expected a string for name" };
  }
  
  const nameParts = name.trim().split(' ');
  if (nameParts.length < 2) {
    return { isValid: false, message: "Please enter both first name and last name" };
  }
  
  const nameRegex = /^[A-Za-z]+$/;
  if (!nameRegex.test(nameParts[0]) || !nameRegex.test(nameParts[1])) {
    return { isValid: false, message: "Names should only contain letters" };
  }
  
  if (nameParts[0].length < 2 || nameParts[1].length < 2) {
    return { isValid: false, message: "Each name should be at least 2 characters long" };
  }
  
  return { isValid: true, message: "" };
};

export const validateGender = (gender: string | File): { isValid: boolean; message: string } => {
  if (gender instanceof File) {
    return { isValid: false, message: "Expected a string for gender" };
  }
  const validGenders = ['male', 'female', 'other'];
  return {
    isValid: validGenders.includes(gender.toLowerCase()),
    message: "Please enter Male, Female, or Other"
  };
};

export const validateAge = (dob: Date): boolean => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age >= 18;
};

export const validatePAN = (pan: string | File): { isValid: boolean; message: string } => {
  if (pan instanceof File) {
    return { isValid: false, message: "Expected a string for PAN" };
  }
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return {
    isValid: panRegex.test(pan),
    message: "Please enter a valid PAN number (e.g., ABCDE1234F)"
  };
};

export const validatePinCode = (pinCode: string | File): { isValid: boolean; message: string } => {
  if (pinCode instanceof File) {
    return { isValid: false, message: "Expected a string for PIN code" };
  }
  const isValid = /^[1-9][0-9]{5}$/.test(pinCode);
  return {
    isValid,
    message: isValid ? "" : "Please enter a valid 6-digit PIN code"
  };
};

export const validateSalary = (salary: string | File): { isValid: boolean; message: string } => {
  if (salary instanceof File) {
    return { isValid: false, message: "Expected a string for salary" };
  }
  const salaryNum = parseInt(salary);
  const isValid = /^\d+$/.test(salary) && salaryNum >= 10000 && salaryNum <= 10000000;
  return {
    isValid,
    message: isValid ? "" : "Please enter a valid salary between 10,000 and 1,00,00,000"
  };
};

export const validateEmploymentType = (type: string | File): { isValid: boolean; message: string } => {
  if (type instanceof File) {
    return { isValid: false, message: "Expected a string for employment type" };
  }
  const validTypes = ['salaried', 'self-employed'];
  return {
    isValid: validTypes.includes(type.toLowerCase()),
    message: "Please enter either Salaried or Self-employed"
  };
};

export const validateCity = (city: string | File): { isValid: boolean; message: string } => {
  if (city instanceof File) {
    return { isValid: false, message: "Expected a string for city" };
  }
  const cityRegex = /^[A-Za-z\s]{2,50}$/;
  return {
    isValid: cityRegex.test(city),
    message: "Please enter a valid city name (2-50 characters, letters only)"
  };
};