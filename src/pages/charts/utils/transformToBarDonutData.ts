interface ChartItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

export const transformToBarDonutData = <T extends object>(
  data: T[],
  nameKey: keyof T,
  valueKey: keyof T
): ChartItem[] => {
  return data.map((item) => ({
    name: String(item[nameKey]),
    value: Number(item[valueKey]),
  }));
};
