import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataItem {
  id: number;
  name: string;
  start: string;
  end: string;
}

interface D3GanttChartProps {
  data: DataItem[];
}

// Adjust the height for a smaller chart
const margin = { top: 20, right: 30, bottom: 60, left: 100 };
const width = 960 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom; // Smaller height

// Extended color palette
const materialColors = [
  "#4A90E2", "#50E3C2", "#7ED321", "#F5A623", "#D0021B", "#B8E986", 
  "#BD10E0", "#F8E71C", "#B0BEC5", "#FF9800", "#009688", "#795548", 
  "#9C27B0", "#FF5722", "#4CAF50", "#FFC107", "#673AB7", "#03A9F4", 
  "#E91E63", "#3F51B5", "#8BC34A", "#FFEB3B", "#00BCD4", "#607D8B", 
  "#9E9E9E", "#F44336",
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

// Helper function to calculate duration
const getDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  return `${duration}d`;
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
        d3.min(data, (d) => new Date(d.start)) as Date,
        d3.max(data, (d) => new Date(d.end)) as Date,
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
      .attr("x", (d) => xScale(new Date(d.start)))
      .attr("y", (d) => yScale(d.name)!)
      .attr("width", (d) => xScale(new Date(d.end)) - xScale(new Date(d.start)))
      .attr("height", yScale.bandwidth())
      .attr("fill", getUniqueMaterialColor) // Use unique Material Design colors
      .attr("rx", 5) // Add rounded corners
      .attr("ry", 5) // Add rounded corners
      .transition()
      .duration(500) // Smooth transition
      .attr("fill-opacity", 0.8);

    // Append text for durations
    // svg
    //   .append("g")
    //   .selectAll("text")
    //   .data(data)
    //   .enter()
    //   .append("text")
    //   .attr("x", (d) => xScale(new Date(d.start)) + (xScale(new Date(d.end)) - xScale(new Date(d.start))) / 2)
    //   .attr("y", (d) => yScale(d.name)! + yScale.bandwidth() / 2)
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "central")
    //   .style("font-size", "12px") // Modern font size
    //   .style("fill", "#fff") // Text color (white for contrast)
    //   .text((d) => getDuration(d.start, d.end)); // Display duration

     // Current time point
     const now = new Date();
     const currentX = xScale(now);
 
   // Add vertical line for current time
    svg
    .append("line")
    .attr("x1", currentX)
    .attr("x2", currentX)
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#FF5722") // Red color for current time line
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4,4"); // Dashed line style

    // Add text label for current time above the chart
    svg
    .append("text")
    .attr("x", currentX)
    .attr("y", -10) // Position above the chart
    .attr("text-anchor", "middle")
    .style("font-size", "12px") // Modern font size
    .style("fill", "#FF5722") // Red color for text
    .text(`Now : ${d3.timeFormat("%b %d, %Y")(now)}`);


    // X axis with custom monthly ticks
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
              const monthFormat = d3.timeFormat("%b"); // Abbreviated month
              const yearFormat = d3.timeFormat("%y"); // Last two digits of the year
              return `${monthFormat(domainValue)} ${yearFormat(domainValue)}`;
            } else {
              return ""; // Handle number case if needed
            }
          })
      )
      .selectAll("text")
      .style("font-size", "12px") // Modern font size
      .style("fill", "#333") // Modern color
      .style("text-anchor", "middle"); // Center align text

    // Y axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px") // Modern font size
      .style("fill", "#333"); // Modern color
      

    // Rotate X axis labels for better readability
    // svg
    //   .selectAll(".x-axis text")
    //   .attr("transform", "rotate(-0)")
    //   .style("text-anchor", "end");

  }, [data]);

  return (
    <div>
      <h1>D3.js Gantt Chart</h1>
      <svg ref={svgRef} />
    </div>
  );
};

export default D3Page;
