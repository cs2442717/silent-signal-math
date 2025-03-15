
// Simple utility to save and load from localStorage with encryption

const STORAGE_PREFIX = 'dvhelp_';

// In a real app, this would use proper encryption
const encrypt = (data: any): string => {
  return JSON.stringify(data);
};

const decrypt = (data: string): any => {
  return JSON.parse(data);
};

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    const encryptedData = encrypt(data);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, encryptedData);
  } catch (error) {
    console.error('Error saving data to storage:', error);
  }
};

export const loadFromStorage = <T>(key: string): T | null => {
  try {
    const encryptedData = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!encryptedData) return null;
    
    return decrypt(encryptedData);
  } catch (error) {
    console.error('Error loading data from storage:', error);
    return null;
  }
};

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('Error removing data from storage:', error);
  }
};

export const clearStorage = (): void => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
