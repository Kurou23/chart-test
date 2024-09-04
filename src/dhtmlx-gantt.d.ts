// src/dhtmlx-gantt.d.ts
declare module "dhtmlx-gantt" {
  interface GanttTask {
    id: number;
    text: string;
    start_date: string;
    duration: number;
    [key: string]: any; // Allow additional properties
  }

  interface GanttLink {
    id: number;
    source: number;
    target: number;
    type: string;
    [key: string]: any; // Allow additional properties
  }

  export const gantt: {
    init(containerId: string): void;
    parse(tasks: { data: GanttTask[]; links: GanttLink[] }): void;
    clearAll(): void;
    [key: string]: any; // Allow additional methods
  };
}
