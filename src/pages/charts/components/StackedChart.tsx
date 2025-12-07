import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { WeeklyMoodItem, WeeklyWorkoutItem } from "../../../types/mock.ts";
import { useChartState } from "../hooks/useChartState.ts";
import ChartLegend from "./ChartLegend.tsx";

interface StackedChartProps {
  title: string;
  data: WeeklyMoodItem[] | WeeklyWorkoutItem[];
  dataKeys: string[];
}

function StackedChart({ title, data, dataKeys }: StackedChartProps) {
  const { colors, hiddenKeys, handleColorChange, toggleVisibility } = useChartState({ keys: dataKeys });

  const convertToPercent = (data: WeeklyMoodItem[] | WeeklyWorkoutItem[]) => {
    return data.map((item) => {
      const values = Object.entries(item)
        .filter(([key]) => key !== "week")
        .map(([, value]) => value as number);
      const total = values.reduce((sum, val) => sum + val, 0);
      const result: Record<string, string | number> = { week: item.week };
      Object.entries(item).forEach(([key, value]) => {
        if (key !== "week") result[key] = Number((((value as number) / total) * 100).toFixed(1));
      });
      return result;
    });
  };

  const percentData = convertToPercent(data);

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <ChartLegend
        keys={dataKeys}
        colors={colors}
        hiddenKeys={hiddenKeys}
        onColorChange={handleColorChange}
        onToggleVisibility={toggleVisibility}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-center font-medium">스택형 바 차트</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={percentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((key) =>
                !hiddenKeys.has(key) ? <Bar key={key} dataKey={key} stackId="a" fill={colors[key]} /> : null
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-center font-medium">스택형 면적 차트</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={percentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              {dataKeys.map((key) =>
                !hiddenKeys.has(key) ? (
                  <Area key={key} type="monotone" dataKey={key} stackId="1" fill={colors[key]} />
                ) : null
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default StackedChart;
