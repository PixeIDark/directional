import { useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChartState } from "../hooks/useChartState.ts";
import ChartLegend from "./ChartLegend.tsx";

interface ChartItem {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface BarDonutChartProps {
  title: string;
  data: ChartItem[];
}

function BarDonutChart({ title, data }: BarDonutChartProps) {
  const keys = useMemo(() => data.map((item) => item.name), [data]);
  const { colors, hiddenKeys, handleColorChange, toggleVisibility } = useChartState({ keys });

  const filteredData = useMemo(() => data.filter((item) => !hiddenKeys.has(item.name)), [data, hiddenKeys]);

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <ChartLegend
        keys={keys}
        colors={colors}
        hiddenKeys={hiddenKeys}
        onColorChange={handleColorChange}
        onToggleVisibility={toggleVisibility}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-center font-medium">바 차트</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={hiddenKeys.has(entry.name) ? "transparent" : colors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-center font-medium">도넛 차트</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

export default BarDonutChart;
