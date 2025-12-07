interface StackedDataPoint {
  category: string;
  [key: string]: string | number;
}

export const transformToStackedData = <T extends object>(
  data: T[],
  categoryKey: keyof T,
  valueKeys: (keyof T)[]
): StackedDataPoint[] => {
  return data.map((item) => {
    const result: StackedDataPoint = {
      category: String(item[categoryKey]),
    };
    valueKeys.forEach((key) => {
      result[String(key)] = Number(item[key]);
    });
    return result;
  });
};
