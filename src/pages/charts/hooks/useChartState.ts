import { useState, useMemo } from "react";

const DEFAULT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

interface UseChartStateProps {
  keys: string[];
}

export function useChartState({ keys }: UseChartStateProps) {
  const defaultColors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    keys.forEach((key, idx) => {
      colorMap[key] = DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
    });
    return colorMap;
  }, [keys]);

  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const colors = useMemo(() => ({ ...defaultColors, ...customColors }), [defaultColors, customColors]);

  const handleColorChange = (key: string, color: string) => {
    setCustomColors((prev) => ({ ...prev, [key]: color }));
  };

  const toggleVisibility = (key: string) => {
    setHiddenKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  return {
    colors,
    hiddenKeys,
    handleColorChange,
    toggleVisibility,
  };
}
