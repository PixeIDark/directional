interface SeriesPoint {
  [key: string]: string | number;
}

interface MultiLineDataPoint {
  [key: string]: string | number;
}

interface MultiLineConfig<T> {
  data: T[];
  nameKey: keyof T;
  seriesKey: keyof T;
  xAxisKey: string;
  leftMetric: string;
  rightMetric: string;
}

interface SeriesConfig {
  name: string;
  leftMetric: string;
  rightMetric: string;
}

export const transformToMultiLineData = <T extends object>(
  config: MultiLineConfig<T>
): {
  data: MultiLineDataPoint[];
  series: SeriesConfig[];
} => {
  const { data, nameKey, seriesKey, xAxisKey, leftMetric, rightMetric } = config;
  const dataMap = new Map<number, Record<string, number>>();

  data.forEach((item) => {
    const name = String(item[nameKey]);
    const seriesData = item[seriesKey] as SeriesPoint[];

    seriesData.forEach((point) => {
      const xValue = point[xAxisKey] as number;

      if (!dataMap.has(xValue)) {
        dataMap.set(xValue, { [xAxisKey]: xValue });
      }

      const entry = dataMap.get(xValue)!;
      entry[`${name}_${leftMetric}`] = point[leftMetric] as number;
      entry[`${name}_${rightMetric}`] = point[rightMetric] as number;
    });
  });

  const chartData = Array.from(dataMap.values()).sort((a, b) => a[xAxisKey] - b[xAxisKey]);

  const series = data.map((item) => ({
    name: String(item[nameKey]),
    leftMetric: `${String(item[nameKey])}_${leftMetric}`,
    rightMetric: `${String(item[nameKey])}_${rightMetric}`,
  }));

  return { data: chartData, series };
};
