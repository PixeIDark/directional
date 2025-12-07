import { useState } from "react";

interface TooltipData {
  x: number;
  y: number;
  [key: string]: string | number;
}

export function useChartInteraction() {
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  const handleDotEnter = (e: React.MouseEvent, data: Record<string, string | number>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const parent = e.currentTarget.closest(".recharts-wrapper")?.getBoundingClientRect();

    if (parent) {
      setTooltipData({
        x: rect.left - parent.left + rect.width / 2,
        y: rect.top - parent.top,
        ...data,
      });
    }
  };

  const handleDotLeave = () => {
    setTooltipData(null);
    setHoveredDot(null);
  };

  return {
    hoveredDot,
    setHoveredDot,
    tooltipData,
    handleDotEnter,
    handleDotLeave,
  };
}
