"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Plus, Trash2, Table as TableIcon } from "lucide-react";

interface TableProps {
  headers?: string[];
  rows?: string[][];
  headerBg?: string;
  headerColor?: string;
  borderColor?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export const TableSettings = () => {
  const { actions: { setProp }, headers, rows, headerBg, headerColor, borderColor, striped, hoverable } = useNode((node) => ({
    headers: node.data.props.headers,
    rows: node.data.props.rows,
    headerBg: node.data.props.headerBg,
    headerColor: node.data.props.headerColor,
    borderColor: node.data.props.borderColor,
    striped: node.data.props.striped,
    hoverable: node.data.props.hoverable,
  }));

  const [newHeader, setNewHeader] = useState("");

  const addColumn = () => {
    if (newHeader.trim()) {
      setProp((p: TableProps) => {
        p.headers = [...(p.headers || []), newHeader.trim()];
        p.rows = (p.rows || []).map(row => [...row, ""]);
      });
      setNewHeader("");
    }
  };

  const removeColumn = (index: number) => {
    setProp((p: TableProps) => {
      p.headers = p.headers?.filter((_, i) => i !== index) || [];
      p.rows = (p.rows || []).map(row => row.filter((_, i) => i !== index));
    });
  };

  const addRow = () => {
    setProp((p: TableProps) => {
      const colCount = p.headers?.length || 0;
      p.rows = [...(p.rows || []), Array(colCount).fill("")];
    });
  };

  const removeRow = (index: number) => {
    setProp((p: TableProps) => {
      p.rows = p.rows?.filter((_, i) => i !== index) || [];
    });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    setProp((p: TableProps) => {
      if (p.rows && p.rows[rowIndex]) {
        p.rows[rowIndex][colIndex] = value;
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Columns</label>
        <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto">
          {headers?.map((header: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input 
                type="text" 
                value={header}
                onChange={(e) => {
                  setProp((p: TableProps) => {
                    if (p.headers) p.headers[index] = e.target.value;
                  });
                }}
                className="flex-1 border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#0066FF]"
              />
              <button
                onClick={() => removeColumn(index)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newHeader}
            onChange={(e) => setNewHeader(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addColumn()}
            placeholder="Add column..."
            className="flex-1 border border-[#E5E5E5] bg-[#FAFAFA] rounded px-2 py-1.5 text-[12px] focus:outline-none focus:border-[#0066FF]"
          />
          <button
            onClick={addColumn}
            className="p-1.5 bg-[#0066FF] text-white hover:bg-[#0052CC] rounded transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-700">Rows: {rows?.length || 0}</span>
        <div className="flex gap-2">
          <button
            onClick={addRow}
            className="px-3 py-1.5 bg-[#0066FF] text-white text-[11px] font-medium hover:bg-[#0052CC] rounded transition-colors"
          >
            Add Row
          </button>
          {rows && rows.length > 0 && (
            <button
              onClick={() => removeRow(rows.length - 1)}
              className="px-3 py-1.5 bg-red-500 text-white text-[11px] font-medium hover:bg-red-600 rounded transition-colors"
            >
              Remove Row
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Header BG</label>
          <input 
            type="color" 
            value={headerBg} 
            onChange={(e) => setProp((p: TableProps) => { p.headerBg = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] text-gray-500">Header Text</label>
          <input 
            type="color" 
            value={headerColor} 
            onChange={(e) => setProp((p: TableProps) => { p.headerColor = e.target.value; })}
            className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] text-gray-500">Border Color</label>
        <input 
          type="color" 
          value={borderColor} 
          onChange={(e) => setProp((p: TableProps) => { p.borderColor = e.target.value; })}
          className="w-full h-10 cursor-pointer rounded border border-[#E5E5E5]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Striped Rows</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={striped}
              onChange={(e) => setProp((p: TableProps) => { p.striped = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-gray-700">Hover Effect</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={hoverable}
              onChange={(e) => setProp((p: TableProps) => { p.hoverable = e.target.checked; })}
              className="sr-only peer" 
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0066FF]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export const Table = ({ 
  headers = ["Column 1", "Column 2", "Column 3"], 
  rows = [["Data 1", "Data 2", "Data 3"], ["Data 4", "Data 5", "Data 6"]],
  headerBg = "#0066FF",
  headerColor = "#FFFFFF",
  borderColor = "#E5E5E5",
  striped = true,
  hoverable = true
}: TableProps) => {
  const { connectors: { connect, drag }, isSelected } = useNode((state) => ({
    isSelected: state.events.selected,
  }));

  if (!headers || headers.length === 0) {
    return (
      <div
        ref={(ref) => { if (ref) connect(drag(ref)); }}
        className="w-full min-h-[200px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2"
        style={{
          outline: isSelected ? "2px solid #0066FF" : "none",
          outlineOffset: "2px",
        }}
      >
        <TableIcon size={48} className="text-gray-400" />
        <p className="text-sm text-gray-500">Add columns in settings</p>
      </div>
    );
  }

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{
        outline: isSelected ? "2px solid #0066FF" : "none",
        outlineOffset: "2px",
        width: "100%",
        overflowX: "auto",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr>
            {headers.map((header: string, index: number) => (
              <th
                key={index}
                style={{
                  backgroundColor: headerBg,
                  color: headerColor,
                  padding: "12px",
                  textAlign: "left",
                  fontWeight: 600,
                  borderBottom: `2px solid ${borderColor}`,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row: string[], rowIndex: number) => (
            <tr
              key={rowIndex}
              style={{
                backgroundColor: striped && rowIndex % 2 === 1 ? "#F9FAFB" : "transparent",
              }}
              className={hoverable ? "hover:bg-gray-100 transition-colors" : ""}
            >
              {row.map((cell: string, cellIndex: number) => (
                <td
                  key={cellIndex}
                  style={{
                    padding: "12px",
                    borderBottom: `1px solid ${borderColor}`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.craft = {
  displayName: "Table",
  props: { 
    headers: ["Column 1", "Column 2", "Column 3"], 
    rows: [["Data 1", "Data 2", "Data 3"], ["Data 4", "Data 5", "Data 6"]],
    headerBg: "#0066FF",
    headerColor: "#FFFFFF",
    borderColor: "#E5E5E5",
    striped: true,
    hoverable: true
  },
  related: { settings: TableSettings },
};
