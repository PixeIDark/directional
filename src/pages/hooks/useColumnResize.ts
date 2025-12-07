import { useEffect, useState } from "react";
import { loadFromStorage } from "../../utils/storage.ts";

interface UseColumnResizeParams<T extends string> {
  initialWidths: Record<T, number>;
  minWidths: Record<T, number>;
  storageKey: string;
  tableRef: React.RefObject<HTMLTableElement>;
}

interface UseColumnResizeReturn<T extends string> {
  columnWidths: Record<T, number>;
  startResize: (leftColumn: T, rightColumn: T, e: React.MouseEvent) => void;
}

export function useColumnResize<T extends string>({
  initialWidths,
  minWidths,
  storageKey,
  tableRef,
}: UseColumnResizeParams<T>): UseColumnResizeReturn<T> {
  const [columnWidths, setColumnWidths] = useState<Record<T, number>>(loadFromStorage(storageKey, initialWidths));
  const [resizing, setResizing] = useState<{
    leftColumn: T | null;
    rightColumn: T | null;
    startX: number;
    leftStartWidth: number;
    rightStartWidth: number;
  }>({
    leftColumn: null,
    rightColumn: null,
    startX: 0,
    leftStartWidth: 0,
    rightStartWidth: 0,
  });

  useEffect(() => {
    if (!resizing.leftColumn || !resizing.rightColumn) return;

    const leftColumn = resizing.leftColumn;
    const rightColumn = resizing.rightColumn;

    const handleMouseMove = (e: MouseEvent) => {
      if (!tableRef.current) return;

      const tableWidth = tableRef.current.offsetWidth;
      const diff = e.clientX - resizing.startX;
      const diffPercent = (diff / tableWidth) * 100;
      const leftMin = minWidths[leftColumn];
      const rightMin = minWidths[rightColumn];
      const totalWidth = resizing.leftStartWidth + resizing.rightStartWidth;
      let newLeftWidth = resizing.leftStartWidth + diffPercent;
      let newRightWidth = resizing.rightStartWidth - diffPercent;

      if (newLeftWidth < leftMin) {
        newLeftWidth = leftMin;
        newRightWidth = totalWidth - leftMin;
      } else if (newRightWidth < rightMin) {
        newRightWidth = rightMin;
        newLeftWidth = totalWidth - rightMin;
      }

      setColumnWidths((prev) => ({
        ...prev,
        [leftColumn]: newLeftWidth,
        [rightColumn]: newRightWidth,
      }));
    };

    const handleMouseUp = () =>
      setResizing({
        leftColumn: null,
        rightColumn: null,
        startX: 0,
        leftStartWidth: 0,
        rightStartWidth: 0,
      });

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing, tableRef, minWidths]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(columnWidths));
    } catch (error) {
      console.error("로컬스토리지 저장 실패:", error);
    }
  }, [columnWidths, storageKey]);

  const startResize = (leftColumn: T, rightColumn: T, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing({
      leftColumn,
      rightColumn,
      startX: e.clientX,
      leftStartWidth: columnWidths[leftColumn],
      rightStartWidth: columnWidths[rightColumn],
    });
  };

  return {
    columnWidths,
    startResize,
  };
}
