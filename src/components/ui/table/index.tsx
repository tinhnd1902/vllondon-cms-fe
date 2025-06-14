import React, { ReactNode } from "react";
import LoadingView from "../loading/LoadingView";
import { EmptyDataIcon } from "@/assets/icons";

enum TableStatus {
  INITIAL = "INITIAL",
  LOADING = "LOADING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
  IS_EMPTY = "IS_EMPTY",
}

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
  status?: TableStatus;
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

const TableBodyLazy: React.FC<TableBodyProps> = ({ children, className, status }) => {
  let content: React.ReactNode;
  switch (status) {
    case TableStatus.INITIAL, TableStatus.SUCCESS:
      content = children;
      break;
    case TableStatus.LOADING:
      content = (
        <TableRow>
          <td colSpan={12} className="px-5 py-4 sm:px-6 text-center">
            <LoadingView />
          </td>
        </TableRow>
      );
      break;
    case TableStatus.ERROR:
      content = (
        <TableRow>
          <td colSpan={12} className="px-5 py-4 sm:px-6 text-center">
            <div className="flex center items-center justify-center gap-2 text-gray-500 font-medium text-xl">
              <EmptyDataIcon />
              <span>No data available</span>
            </div>
          </td>
        </TableRow>
      );
      break;
    default:
      content = children;
  }
  return (
    <tbody className={className}>
      {content}
    </tbody>
  );
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`}>{children}</CellTag>;
};

export { Table, TableHeader, TableBody, TableBodyLazy, TableRow, TableCell, TableStatus };
