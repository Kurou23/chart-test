import React, { useState, useCallback, useRef } from 'react';
import { Chart } from 'react-google-charts';
import Tooltip from './Tooltip'; // Import the Tooltip component

interface Task {
  id: number;
  name: string;
  start: string;
  end: string;
}

interface GoogleChartsPageProps {
  tasks: Task[];
}

const createCustomHTMLContent = (taskName: string, startDate: Date, endDate: Date) => {
  return `
    <div style="padding: 5px; font-family: Arial, sans-serif;">
      <strong>Task:</strong> ${taskName} <br>
      <strong>Start Date:</strong> ${startDate.toLocaleDateString()} <br>
      <strong>End Date:</strong> ${endDate.toLocaleDateString()} <br>
    </div>
  `;
};

const transformData = (tasks: Task[]) => {
  const columns = [
    { type: 'string', label: 'Task ID' },
    { type: 'string', label: 'Task Name' },
    { type: 'string', label: 'Resource' },
    { type: 'date', label: 'Start Date' },
    { type: 'date', label: 'End Date' },
    { type: 'number', label: 'Duration' },
    { type: 'number', label: 'Percent Complete' },
    { type: 'string', label: 'Dependencies' },
    { role: 'tooltip', p: { html: true } },
  ];

  const rows = tasks.map((task) => [
    task.id.toString(),
    task.name,
    task.name,
    new Date(task.start),
    new Date(task.end),
    null,
    100,
    null,
    createCustomHTMLContent(task.name, new Date(task.start), new Date(task.end)),
  ]);

  return [columns, ...rows];
};

const GoogleChartsPage: React.FC<GoogleChartsPageProps> = ({ tasks }) => {
  const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number; visible: boolean }>({
    content: '',
    x: 0,
    y: 0,
    visible: false,
  });

  const chartRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Example logic to determine tooltip content based on mouse position
    const content = `
      <div style="padding: 5px; font-family: Arial, sans-serif;">
        <strong>Tooltip content</strong>
      </div>
    `;

    setTooltip({
      content,
      x,
      y,
      visible: true,
    });
  }, []);

  const data = transformData(tasks);

  const options = {
    gantt: {
      trackHeight: 30,
      barHeight: 20,
      barCornerRadius: 8,
      gridlineColor: '#e0e0e0',
      criticalPathEnabled: true,
      criticalPathStyle: {
        stroke: '#e64a19',
        strokeWidth: 2,
      },
      labelStyle: {
        fontName: 'Arial',
        fontSize: 13,
      },
    },
    focusTarget: 'category',
    tooltip: { isHtml: true }, // Keep this for fallback
  };

  return (
    <div
      ref={chartRef}
      onMouseMove={handleMouseMove}
    >
      <Chart
        chartType="Gantt"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
      {/* <Tooltip content={tooltip.content} x={tooltip.x} y={tooltip.y} visible={tooltip.visible} /> */}
    </div>
  );
};

export default GoogleChartsPage;
