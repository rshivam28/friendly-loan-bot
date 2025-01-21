export const validateName = (name: string): { isValid: boolean; message: string } => {
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

export const validateGender = (gender: string): { isValid: boolean; message: string } => {
  const validGenders = ['male', 'female', 'other'];
  return {
    isValid: validGenders.includes(gender.toLowerCase()),
    message: "Please enter Male, Female, or Other"
  };
};

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
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

export const validatePinCode = (pinCode: string): boolean => {
  return /^[1-9][0-9]{5}$/.test(pinCode);
};

export const validateSalary = (salary: string): boolean => {
  const salaryNum = parseInt(salary);
  return /^\d+$/.test(salary) && salaryNum >= 10000 && salaryNum <= 10000000;
};

export const validateEmploymentType = (type: string): { isValid: boolean; message: string } => {
  const validTypes = ['salaried', 'self-employed'];
  return {
    isValid: validTypes.includes(type.toLowerCase()),
    message: "Please enter either Salaried or Self-employed"
  };
};

export const validateCity = (city: string): { isValid: boolean; message: string } => {
  const cityRegex = /^[A-Za-z\s]{2,50}$/;
  return {
    isValid: cityRegex.test(city),
    message: "Please enter a valid city name (2-50 characters, letters only)"
  };
};