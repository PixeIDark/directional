interface ChartLegendProps {
  keys: string[];
  colors: Record<string, string>;
  hiddenKeys: Set<string>;
  onColorChange: (key: string, color: string) => void;
  onToggleVisibility: (key: string) => void;
}

function ChartLegend({ keys, colors, hiddenKeys, onColorChange, onToggleVisibility }: ChartLegendProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      {keys.map((key) => (
        <div key={key} className="flex items-center gap-2">
          <input type="checkbox" checked={!hiddenKeys.has(key)} onChange={() => onToggleVisibility(key)} />
          <input
            type="color"
            value={colors[key] || "#000000"}
            onChange={(e) => onColorChange(key, e.target.value)}
            className="h-6 w-6 cursor-pointer"
          />
          <span className="text-sm">{key}</span>
        </div>
      ))}
    </div>
  );
}

export default ChartLegend;
