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
import type { TopCoffeeBrandItem, PopularSnackBrandItem } from "../../../types/mock.ts";

interface BarDonutChartProps {
  title: string;
  data: TopCoffeeBrandItem[] | PopularSnackBrandItem[];
  dataKey: string;
  nameKey: string;
}

function BarDonutChart({ title, data, dataKey, nameKey }: BarDonutChartProps) {
  const keys = useMemo(() => data.map((item) => String(item[nameKey as keyof typeof item])), [data, nameKey]);
  const { colors, hiddenKeys, handleColorChange, toggleVisibility } = useChartState({ keys });

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
            <BarChart data={data as unknown as Record<string, unknown>[]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={dataKey}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      hiddenKeys.has(String(entry[nameKey as keyof typeof entry]))
                        ? "transparent"
                        : colors[String(entry[nameKey as keyof typeof entry])]
                    }
                  />
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
                data={
                  data.filter(
                    (item) => !hiddenKeys.has(String(item[nameKey as keyof typeof item]))
                  ) as unknown as Record<string, unknown>[]
                }
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {data
                  .filter((item) => !hiddenKeys.has(String(item[nameKey as keyof typeof item])))
                  .map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[String(entry[nameKey as keyof typeof entry])]} />
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
