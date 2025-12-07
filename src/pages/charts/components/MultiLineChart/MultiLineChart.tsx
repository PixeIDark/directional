import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { CoffeeTeam, SnackImpactDepartment } from "../../../../types/mock.ts";
import { useChartState } from "../../hooks/useChartState.ts";
import { useMultiLineChart } from "./hooks/useMultiLineChart.ts";
import ChartLegend from "../ChartLegend.tsx";

interface MultiLineChartProps {
  title: string;
  data: CoffeeTeam[] | SnackImpactDepartment[];
  xAxisKey: string;
  xAxisLabel: string;
  leftYAxisLabel: string;
  rightYAxisLabel: string;
  leftMetric: string;
  rightMetric: string;
  type: "coffee" | "snack";
}

function MultiLineChart({
  title,
  data,
  xAxisKey,
  xAxisLabel,
  leftYAxisLabel,
  rightYAxisLabel,
  leftMetric,
  rightMetric,
  type,
}: MultiLineChartProps) {
  const keys = useMemo(() => data.map((item) => ("team" in item ? item.team : item.name)), [data]);
  const { colors, hiddenKeys, handleColorChange, toggleVisibility } = useChartState({ keys });
  const { hoveredDot, setHoveredDot, tooltipData, chartData, handleDotEnter, handleDotLeave } = useMultiLineChart({
    data,
    xAxisKey,
    leftMetric,
    rightMetric,
  });

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
      <div className="relative rounded-lg border p-4">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} label={{ value: xAxisLabel, position: "insideBottom", offset: -4 }} />
            <YAxis yAxisId="left" label={{ value: leftYAxisLabel, angle: -90, position: "insideLeft", dy: 20 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: rightYAxisLabel, angle: 90, position: "insideRight", dy: 20 }}
            />
            {data.map((item) => {
              const name = "team" in item ? item.team : item.name;
              const series = "series" in item ? item.series : item.metrics;

              return !hiddenKeys.has(name) ? (
                <g key={name}>
                  <Line
                    yAxisId="left"
                    dataKey={`${name}_${leftMetric}`}
                    stroke={colors[name]}
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, index, payload } = props;
                      if (cx === undefined || cy === undefined) return null;

                      const dotId = `${name}_${leftMetric}_${index}`;
                      const isHovered = hoveredDot === dotId;
                      const pointData = series[index];

                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill={colors[name]}
                          onMouseMove={(e) => {
                            setHoveredDot(dotId);
                            handleDotEnter(
                              e,
                              name,
                              payload[xAxisKey],
                              pointData[leftMetric as keyof typeof pointData] as number,
                              pointData[rightMetric as keyof typeof pointData] as number
                            );
                          }}
                          onMouseLeave={handleDotLeave}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }}
                    activeDot={false}
                    name={`${name}_${leftMetric}`}
                  />
                  <Line
                    yAxisId="right"
                    dataKey={`${name}_${rightMetric}`}
                    stroke={colors[name]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={(props) => {
                      const { cx, cy, index, payload } = props;
                      if (cx === undefined || cy === undefined) return null;

                      const dotId = `${name}_${rightMetric}_${index}`;
                      const isHovered = hoveredDot === dotId;
                      const size = isHovered ? 10 : 8;
                      const pointData = series[index];

                      return (
                        <rect
                          x={cx - size / 2}
                          y={cy - size / 2}
                          width={size}
                          height={size}
                          fill={colors[name]}
                          onMouseMove={(e) => {
                            setHoveredDot(dotId);
                            handleDotEnter(
                              e,
                              name,
                              payload[xAxisKey],
                              pointData[leftMetric as keyof typeof pointData] as number,
                              pointData[rightMetric as keyof typeof pointData] as number
                            );
                          }}
                          onMouseLeave={handleDotLeave}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }}
                    activeDot={false}
                    name={`${name}_${rightMetric}`}
                  />
                </g>
              ) : null;
            })}
          </LineChart>
        </ResponsiveContainer>
        {tooltipData && (
          <div
            className="pointer-events-none absolute rounded border border-gray-300 bg-white p-3 shadow-lg"
            style={{
              left: `${tooltipData.x + 10}px`,
              top: `${tooltipData.y - 10}px`,
              transform: "translateY(-100%)",
            }}
          >
            <p className="mb-1 font-semibold">{tooltipData.team}</p>
            <p className="text-sm">
              {xAxisLabel}: {tooltipData.xValue}
              {type === "coffee" ? "잔" : "개"}
            </p>
            <p className="text-sm">
              {leftYAxisLabel}: {tooltipData.leftValue}
            </p>
            <p className="text-sm">
              {rightYAxisLabel}: {tooltipData.rightValue}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default MultiLineChart;
