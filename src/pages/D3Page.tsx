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

const margin = { top: 20, right: 30, bottom: 60, left: 100 };
const width = 960 - margin.left - margin.right;
const height = 250 - margin.top - margin.bottom;

const materialColors = [
  "#4A90E2",
  "#50E3C2",
  "#7ED321",
  "#F5A623",
  "#D0021B",
  "#B8E986",
  "#BD10E0",
  "#F8E71C",
  "#B0BEC5",
  "#FF9800",
  "#009688",
  "#795548",
  "#9C27B0",
  "#FF5722",
  "#4CAF50",
  "#FFC107",
  "#673AB7",
  "#03A9F4",
  "#E91E63",
  "#3F51B5",
  "#8BC34A",
  "#FFEB3B",
  "#00BCD4",
  "#607D8B",
  "#9E9E9E",
  "#F44336",
];

const usedColors = new Set<string>();

const getUniqueMaterialColor = () => {
  if (usedColors.size >= materialColors.length) {
    usedColors.clear();
  }

  let color: string;
  do {
    color = materialColors[Math.floor(Math.random() * materialColors.length)];
  } while (usedColors.has(color));

  usedColors.add(color);
  return color;
};

const getDuration = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const duration = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
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

    const now = new Date();
    const minStartDate = d3.min(data, (d) => new Date(d.start)) as Date;
    const maxEndDate = d3.max(data, (d) => new Date(d.end)) as Date;

    // Adjust X scale to include the current date if it is earlier than the earliest start date
    const xScale = d3
      .scaleTime()
      .domain([d3.min([minStartDate, now]) as Date, maxEndDate])
      .range([0, width]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, height])
      .padding(0.1); // Remove padding to close the gap for the entire row

    // Apply zebra striping effect
    svg
      .selectAll(".zebra-row")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "zebra-row")
      .attr("x", 0)
      .attr("y", (d) => yScale(d.name)!)
      .attr("width", width)
      .attr("height", yScale.bandwidth())
      .attr("fill", (d, i) => (i % 2 === 0 ? "#f9f9f9" : "#ececec")); // Alternating colors

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
      .attr("fill", getUniqueMaterialColor)
      .attr("rx", yScale.bandwidth() / 2) // Increase rounding
      .attr("ry", yScale.bandwidth() / 2) // Increase rounding
      .transition()
      .duration(500)
      .attr("fill-opacity", 0.8);

    const currentX = xScale(now);

    svg
      .append("line")
      .attr("x1", currentX)
      .attr("x2", currentX)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#FF5722")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4");

    svg
      .append("text")
      .attr("x", currentX)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#FF5722")
      .style("font-weight", "bold") // Make the text bold
      .text(`Now : ${d3.timeFormat("%b %d, %Y")(now)}`);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(d3.timeMonth.every(1))
          .tickFormat((domainValue: Date | d3.NumberValue) => {
            if (domainValue instanceof Date) {
              const monthFormat = d3.timeFormat("%b");
              const yearFormat = d3.timeFormat("%y");
              return `${monthFormat(domainValue)} ${yearFormat(domainValue)}`;
            } else {
              return "";
            }
          })
      )
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("text-anchor", "middle");

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#333");
  }, [data]);

  return (
    <div>
      <h1>D3.js Gantt Chart</h1>
      <svg ref={svgRef} />
    </div>
  );
};

export default D3Page;
