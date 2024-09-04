import React, { useEffect } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "dhtmlx-gantt/codebase/dhtmlxgantt.js";
import { gantt } from "dhtmlx-gantt";

interface Task {
  id: number;
  name: string;
  start: Date;
  end: Date;
}

interface DhtmlxGanttChartProps {
  tasks: Task[];
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();
  return `${day}-${month}-${year}`;
};

const transformData = (tasks: Task[]) => {
  return {
    data: tasks.map((task) => ({
      id: task.id,
      text: task.name,
      start_date: formatDate(task.start),
      end_date: formatDate(task.end),
      duration: 0,
      progress: 0.5,
      dependencies: null,
    })),
    links: [],
  };
};

const DhtmlxGanttChart: React.FC<DhtmlxGanttChartProps> = ({ tasks }) => {
  useEffect(() => {
    const data = transformData(tasks);

    // Set the Gantt chart to display months only
    gantt.config.scale_unit = "month"; // Set the scale to month
    gantt.config.date_scale = "%F, %Y"; // Display month and year
    gantt.config.subscales = []; // Remove subscales to avoid showing days

    gantt.config.readonly = true;
    gantt.config.drag_move = false;
    gantt.config.drag_resize = false;
    gantt.config.drag_links = false;
    gantt.config.editable = false;

    gantt.config.show_grid = true; // Ensure the grid is shown if needed
    gantt.config.columns = [
      // Define the columns to show in the grid
      { name: "text", label: "Task name", width: "*", tree: true },
      { name: "start_date", label: "Start date", align: "center" },
      { name: "end_date", label: "End date", align: "center" },
      { name: "duration", label: "Duration", align: "center" },
    ];

    // Remove the "+" button by disabling the add column
    gantt.config.buttons_left = []; // Disable left buttons (like "+")
    gantt.config.buttons_right = []; // Disable right buttons

    gantt.config.scale_height = 50;
    gantt.config.row_height = 30;
    gantt.config.min_column_width = 50;

    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1);
    const end = new Date(today.getFullYear() + 1, 0, 0);

    gantt.config.start_date = start;
    gantt.config.end_date = end;

    gantt.init("gantt_here");
    gantt.parse(data);

    return () => {
      gantt.clearAll();
    };
  }, [tasks]);

  return <div id="gantt_here" style={{ width: "100%", height: "500px" }} />;
};

export default DhtmlxGanttChart;
