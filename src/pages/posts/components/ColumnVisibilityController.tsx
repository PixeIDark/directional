interface Column {
  key: string;
  label: string;
}

interface ColumnVisibilityControlProps {
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  onToggle: (column: string) => void;
}

function ColumnVisibilityController({ columns, visibleColumns, onToggle }: ColumnVisibilityControlProps) {
  return (
    <div className="mb-4 flex gap-4">
      <span className="font-semibold">컬럼:</span>
      {columns.map(({ key, label }) => (
        <label key={key} className="flex items-center gap-1">
          <input type="checkbox" checked={visibleColumns[key]} onChange={() => onToggle(key)} />
          {label}
        </label>
      ))}
    </div>
  );
}

export default ColumnVisibilityController;
