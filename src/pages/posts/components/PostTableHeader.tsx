interface Column<T extends string = string> {
  key: T;
  label: string;
}

interface PostTableHeaderProps<T extends string = string> {
  columns: Column<T>[];
  visibleColumns: Record<T, boolean>;
  columnWidths: Record<T, number>;
  onResizeStart: (left: T, right: T, e: React.MouseEvent) => void;
}

function PostTableHeader<T extends string = string>({
  columns,
  visibleColumns,
  columnWidths,
  onResizeStart,
}: PostTableHeaderProps<T>) {
  const visibleColumnKeys = columns.filter((col) => visibleColumns[col.key]).map((col) => col.key);

  return (
    <thead>
      <tr className="bg-gray-100">
        {columns.map(({ key, label }) => {
          if (!visibleColumns[key]) return null;
          const currentIndex = visibleColumnKeys.indexOf(key);
          const nextKey = visibleColumnKeys[currentIndex + 1];
          return (
            <th key={key} className="relative border px-4 py-2 text-left" style={{ width: `${columnWidths[key]}%` }}>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap">{label}</div>
              {nextKey && (
                <div
                  className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-300 hover:bg-blue-500"
                  onMouseDown={(e) => onResizeStart(key, nextKey, e)}
                />
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export default PostTableHeader;
