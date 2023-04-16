interface SessionHook {
    getSessionItem: <T>(key: string, defaultValue?: T) => T | null;
    setSessionItem: <T>(key: string, value: T) => void;
    removeSessionItem: (key: string) => void;
    clearSession: () => void;
  }
  
const useSessionStorage = (): SessionHook => {
    const getSessionItem = (key: string, defaultValue?: any) => {
      const storedValue = sessionStorage.getItem(key);
      if (storedValue) {
        return JSON.parse(storedValue);
      }
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      return null;
    };
  
    const setSessionItem = <T>(key: string, value: T): void => {
      sessionStorage.setItem(key, JSON.stringify(value));
    };
  
    const removeSessionItem = (key: string): void => {
      sessionStorage.removeItem(key);
    };
  
    const clearSession = (): void => {
      sessionStorage.clear();
    };
  
    return { getSessionItem, setSessionItem, removeSessionItem, clearSession };
  };
  
  export default useSessionStorage;