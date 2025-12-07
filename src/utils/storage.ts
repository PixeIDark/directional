export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  } catch (error) {
    console.error("로컬스토리지 저장 실패:", error);
  }
};

export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) return JSON.parse(saved) as T;
  } catch (error) {
    console.error("로컬스토리지 로드 실패:", error);
  }
  return fallback;
};
