
import { useState, useEffect, useRef } from "react";
import { Story } from "@/types/story";
import { SliderQuestion } from "../slider-comparison/useSliderQuestions";
import React from "react";
import * as d3 from "d3";

interface ChartPoint {
  x: number;
  y: number;
  id: string | number;
  title: string;
}

export function useContourChart(
  chartRef: React.RefObject<HTMLDivElement>,
  stories: Story[],
  isLoading: boolean,
  xAxisQuestion: number | null,
  yAxisQuestion: number | null,
  sliderQuestions: SliderQuestion[]
) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Resize observer logic
  useEffect(() => {
    if (!chartRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    
    resizeObserver.observe(chartRef.current);
    return () => resizeObserver.disconnect();
  }, [chartRef]);

  // Process data for contour chart
  useEffect(() => {
    if (isLoading || !xAxisQuestion || !yAxisQuestion || stories.length === 0) {
      setChartData([]);
      return;
    }

    try {
      // Find the selected slider questions
      const xAxisQ = sliderQuestions.find(q => q.id === xAxisQuestion);
      const yAxisQ = sliderQuestions.find(q => q.id === yAxisQuestion);
      
      if (!xAxisQ || !yAxisQ) {
        console.error("Could not find slider questions for axes");
        setChartData([]);
        return;
      }
      
      // Process story data to extract x and y coordinates
      const points = stories.map(story => {
        // Get slider responses for this story
        const sliderResponses = story.sliderResponses || [];
        
        // Find the responses for our x and y axis questions
        const xResponse = sliderResponses.find(r => r.question_id === xAxisQuestion);
        const yResponse = sliderResponses.find(r => r.question_id === yAxisQuestion);
        
        // If we have valid responses, include this point
        if (xResponse && yResponse) {
          return {
            x: xResponse.value || 50,  // Default to middle if null
            y: yResponse.value || 50,  // Default to middle if null
            id: story.id,
            title: story.title
          };
        }
        
        return null;
      }).filter((point): point is ChartPoint => point !== null);
      
      setChartData(points);
    } catch (error) {
      console.error("Error processing contour chart data:", error);
      setChartData([]);
    }
  }, [stories, xAxisQuestion, yAxisQuestion, sliderQuestions, isLoading]);

  // Render D3 visualization
  useEffect(() => {
    if (!chartRef.current || dimensions.width === 0 || chartData.length < 3) {
      return;
    }

    try {
      // Get the SVG element
      const svg = d3.select(chartRef.current).select("svg");
      svg.selectAll("*").remove(); // Clear previous visualization
      
      // Set margins and dimensions
      const margin = { top: 40, right: 40, bottom: 60, left: 60 };
      const width = dimensions.width - margin.left - margin.right;
      const height = dimensions.height - margin.top - margin.bottom;
      
      // Create scales
      const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
        
      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

      // Create a group element for the chart
      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Generate contour data
      const contourDensity = d3.contourDensity<ChartPoint>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .size([width, height])
        .bandwidth(20)
        .thresholds(10);

      const density = contourDensity(chartData);

      // Create a color scale
      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(density, d => d.value) || 0.01]);

      // Draw contours
      g.append("g")
        .selectAll("path")
        .data(density)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", d => colorScale(d.value))
        .attr("stroke", "#262d57")
        .attr("stroke-width", d => d.value > 0.05 ? 1.5 : 0.5)
        .attr("stroke-opacity", 0.8);

      // Draw data points
      g.selectAll("circle")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", 4)
        .attr("fill", "#262d57")
        .attr("opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .append("title")
        .text(d => d.title);

      // Add axes
      g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text(sliderQuestions.find(q => q.id === xAxisQuestion)?.question.substring(0, 30) + "...");

      g.append("g")
        .call(d3.axisLeft(yScale).ticks(5))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text(sliderQuestions.find(q => q.id === yAxisQuestion)?.question.substring(0, 30) + "...");
        
      // Save the svg reference
      svgRef.current = svg.node() as SVGSVGElement;
    } catch (error) {
      console.error("Error rendering contour chart:", error);
    }
  }, [dimensions, chartData, xAxisQuestion, yAxisQuestion, sliderQuestions]);

  return {
    dimensions,
    chartData,
    svgRef
  };
}
