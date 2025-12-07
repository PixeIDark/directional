import { useMemo } from "react";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useChartState } from "../hooks/useChartState.ts";
import ChartLegend from "./ChartLegend.tsx";

interface StackedDataPoint {
  category: string;
  [key: string]: string | number;
}

interface StackedChartProps {
  title: string;
  data: StackedDataPoint[];
  categoryKey: string;
  stackKeys: string[];
}

function StackedChart({ title, data, categoryKey, stackKeys }: StackedChartProps) {
  const { colors, hiddenKeys, handleColorChange, toggleVisibility } = useChartState({ keys: stackKeys });

  const percentData = useMemo(() => {
    return data.map((item) => {
      const values = stackKeys.map((key) => item[key] as number);
      const total = values.reduce((sum, val) => sum + val, 0);
      const result: Record<string, string | number> = { [categoryKey]: item[categoryKey] };
      stackKeys.forEach((key) => {
        result[key] = Number((((item[key] as number) / total) * 100).toFixed(1));
      });
      return result;
    });
  }, [data, categoryKey, stackKeys]);

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <ChartLegend
        keys={stackKeys}
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
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              {stackKeys.map((key) =>
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
              <XAxis dataKey={categoryKey} />
              <YAxis />
              <Tooltip />
              {stackKeys.map((key) =>
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
