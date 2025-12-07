import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useChartState } from "../../hooks/useChartState.ts";
import ChartLegend from "../ChartLegend.tsx";
import { useChartInteraction } from "./hooks/useChartInteraction.ts";

interface ChartDataPoint {
  [key: string]: number | string;
}

interface SeriesConfig {
  name: string;
  leftMetric: string;
  rightMetric: string;
}

interface MultiLineChartProps {
  title: string;
  data: ChartDataPoint[];
  series: SeriesConfig[];
  xAxisKey: string;
  xAxisLabel: string;
  leftYAxisLabel: string;
  rightYAxisLabel: string;
}

function MultiLineChart({
  title,
  data,
  series,
  xAxisKey,
  xAxisLabel,
  leftYAxisLabel,
  rightYAxisLabel,
}: MultiLineChartProps) {
  const keys = useMemo(() => series.map((s) => s.name), [series]);
  const { colors, hiddenKeys, handleColorChange, toggleVisibility } = useChartState({ keys });
  const { hoveredDot, setHoveredDot, tooltipData, handleDotEnter, handleDotLeave } = useChartInteraction();

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
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} label={{ value: xAxisLabel, position: "insideBottom", offset: -4 }} />
            <YAxis yAxisId="left" label={{ value: leftYAxisLabel, angle: -90, position: "insideLeft", dy: 20 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: rightYAxisLabel, angle: 90, position: "insideRight", dy: 20 }}
            />
            {series.map(({ name, leftMetric, rightMetric }) => {
              if (hiddenKeys.has(name)) return null;

              return (
                <g key={name}>
                  <Line
                    yAxisId="left"
                    dataKey={leftMetric}
                    stroke={colors[name]}
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, index, payload } = props;
                      if (cx === undefined || cy === undefined) return null;

                      const dotId = `${name}_${leftMetric}_${index}`;
                      const isHovered = hoveredDot === dotId;

                      return (
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : 5}
                          fill={colors[name]}
                          onMouseMove={(e) => {
                            setHoveredDot(dotId);
                            handleDotEnter(e, {
                              team: name,
                              xValue: payload[xAxisKey],
                              leftValue: payload[leftMetric],
                              rightValue: payload[rightMetric],
                            });
                          }}
                          onMouseLeave={handleDotLeave}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }}
                    activeDot={false}
                  />
                  <Line
                    yAxisId="right"
                    dataKey={rightMetric}
                    stroke={colors[name]}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={(props) => {
                      const { cx, cy, index, payload } = props;
                      if (cx === undefined || cy === undefined) return null;

                      const dotId = `${name}_${rightMetric}_${index}`;
                      const isHovered = hoveredDot === dotId;
                      const size = isHovered ? 10 : 8;

                      return (
                        <rect
                          x={cx - size / 2}
                          y={cy - size / 2}
                          width={size}
                          height={size}
                          fill={colors[name]}
                          onMouseMove={(e) => {
                            setHoveredDot(dotId);
                            handleDotEnter(e, {
                              team: name,
                              xValue: payload[xAxisKey],
                              leftValue: payload[leftMetric],
                              rightValue: payload[rightMetric],
                            });
                          }}
                          onMouseLeave={handleDotLeave}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }}
                    activeDot={false}
                  />
                </g>
              );
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
