import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
  id: number;
  name: string;
  start: Date;
  end: Date;
}

interface D3GanttChartProps {
  data: DataItem[];
}

// Adjust the height for a smaller chart
const margin = { top: 20, right: 30, bottom: 60, left: 75 };
const width = 960 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom; // Smaller height

// Material Design color palette
const materialColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
];

const usedColors = new Set<string>();

// Function to get a unique Material Design color
const getUniqueMaterialColor = () => {
  if (usedColors.size >= materialColors.length) {
    usedColors.clear(); // Reset the set if all colors have been used
  }

  let color: string;
  do {
    color = materialColors[Math.floor(Math.random() * materialColors.length)];
  } while (usedColors.has(color));

  usedColors.add(color);
  return color;
};

const D3Page: React.FC<D3GanttChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale for time
    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(data, (d) => d.start) as Date,
        d3.max(data, (d) => d.end) as Date,
      ])
      .range([0, width]);

    // Y scale for task names
    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, height])
      .padding(0.3); // Adjust padding to fit within smaller height

    // Append bars for tasks
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.start))
      .attr("y", (d) => yScale(d.name)!)
      .attr("width", (d) => xScale(d.end) - xScale(d.start))
      .attr("height", yScale.bandwidth()) // Ensure bars fit within smaller height
      .attr("fill", getUniqueMaterialColor); // Use unique Material Design colors

    // X axis with monthly ticks
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMonth.every(1)) // Show ticks every month
          .tickFormat((domainValue: Date | d3.NumberValue) => {
            if (domainValue instanceof Date) {
              return d3.timeFormat("%b %Y")(domainValue);
            } else {
              return ""; // Handle number case if needed
            }
          })
      );

    // Y axis
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    svg
      .selectAll(".x-axis text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
  }, [data]);

  return (
    <div>
      <h1>D3.js Gantt Chart</h1>
      <svg ref={svgRef} />
    </div>
  );
};

export default D3Page;
