import React from "react";

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties = {}
): React.CSSProperties => ({
  userSelect: "none",
  padding: 8,
  margin: `0 0 8px 0`,
  background: isDragging ? "#e0f7fa" : "#fff",
  border: "1px solid #ddd",
  borderTopWidth: "2px",
  borderTopColor: "#1876d2",
  borderRadius: "2px",
  borderBottom: "4px solid #ddd",
  ...draggableStyle,
});

const getCrewStyle = (
  isDragging: boolean,
  draggableStyle: React.CSSProperties = {}
): React.CSSProperties => ({
  userSelect: "none",
  padding: 8,
  margin: `0 0 8px 0`,
  background: isDragging ? "#e0f7fa" : "#fff",
  border: "1px solid #ddd",
  borderRadius: "2px",
  borderBottom: "4px solid #ddd",
  ...draggableStyle,
});

export {
  getItemStyle,
  getCrewStyle
}