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
  return /^\d+$/.test(salary) && parseInt(salary) > 0;
};