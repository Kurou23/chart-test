import React from "react";
import { Chart } from "react-google-charts";

interface Task {
  id: number;
  name: string;
  start: Date;
  end: Date;
}

interface GoogleChartsPageProps {
  tasks: Task[];
}

const transformData = (tasks: Task[]) => {
  const columns = [
    { type: "string", label: "Task ID" },
    { type: "string", label: "Task Name" },
    { type: "string", label: "Resource" },
    { type: "date", label: "Start Date" },
    { type: "date", label: "End Date" },
    { type: "number", label: "Duration" },
    { type: "number", label: "Percent Complete" },
    { type: "string", label: "Dependencies" },
  ];

  const rows = tasks.map((task) => [
    task.id,
    task.name,
    task.name, // You can use the task name as the resource if needed
    task.start,
    task.end,
    null, // Duration is optional
    100, // Percent Complete, you can customize this if needed
    null, // Dependencies are optional
  ]);

  return [columns, ...rows];
};

const GoogleChartsPage: React.FC<GoogleChartsPageProps> = ({ tasks }) => {
  const data = transformData(tasks);

  const options = {
    gantt: {
      trackHeight: 30,
      barHeight: 20,
      barCornerRadius: 5,
      gridlineColor: "#e0e0e0",
      criticalPathEnabled: true,
      criticalPathStyle: {
        stroke: "#e64a19",
        strokeWidth: 2,
      },
      labelStyle: {
        fontName: "Arial",
        fontSize: 12,
        color: "#757575",
      },
    },
  };

  return (
    <div>
      <Chart
        chartType="Gantt"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default GoogleChartsPage;
