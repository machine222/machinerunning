/**
 * Sparkline Component
 *
 * Purpose:
 * A lightweight, inline chart component that visualizes trends in a compact space without axes or labels.
 * Designed to show patterns and trends at a glance within limited UI space.
 *
 * Design Philosophy:
 * - Minimalist: Shows only essential information to reduce cognitive load
 * - Inline: Fits within text or table cells without disrupting layout
 * - Interactive: Provides tooltips on hover for detailed data points
 * - Responsive: Adapts to container width for flexible layout integration
 *
 * Key Features:
 * 1. Canvas-based rendering for optimal performance
 * 2. Customizable appearance (height, stroke width, color)
 * 3. Interactive tooltips showing exact values on hover
 * 4. Support for custom labels for each data point
 * 5. High-DPI display support for crisp rendering
 *
 * Technical Implementation:
 * - Uses HTML Canvas API for efficient rendering
 * - Implements useEffect for drawing and cleanup
 * - Handles device pixel ratio for retina displays
 * - Uses refs to access and manipulate the canvas element
 *
 * Usage Context:
 * Primarily used in the item sourcing page to display 12-month search volume trends
 * in a compact format within table cells.
 *
 * @component
 */

"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

/**
 * Sparkline Props Interface
 *
 * Defines the configuration options for the Sparkline component.
 *
 * @property data - Array of numeric values to visualize
 * @property height - Optional height of the sparkline in pixels (default: 20)
 * @property strokeWidth - Optional width of the line in pixels (default: 1.5)
 * @property color - Optional color of the line (default: "#3b82f6" - blue)
 * @property labels - Optional array of labels for each data point (e.g., month names)
 */
interface SparklineProps {
  data: number[]
  height?: number
  strokeWidth?: number
  color?: string
  labels?: string[] // Labels for each data point (e.g., month names)
}

/**
 * Sparkline Component
 *
 * Renders a small, inline chart that shows trends over time without axes or labels.
 * Includes interactive tooltips that display the exact value and label when hovering.
 *
 * Implementation Notes:
 * - Uses canvas for performance reasons instead of SVG
 * - Handles high-DPI displays by adjusting canvas size and scaling
 * - Implements custom tooltip positioning and content
 * - Optimizes rendering with requestAnimationFrame (implicit in React)
 *
 * @param props - The component props (see SparklineProps interface)
 * @returns A React component that renders a sparkline chart
 */
export function Sparkline({ data, height = 20, strokeWidth = 1.5, color = "#3b82f6", labels = [] }: SparklineProps) {
  // Reference to the canvas element for direct manipulation
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // State for tooltip display and positioning
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0, label: "" })

  // Reference to the container element for positioning calculations
  const containerRef = useRef<HTMLDivElement>(null)

  /**
   * Canvas Drawing Effect
   *
   * Handles the drawing of the sparkline on the canvas element.
   * Runs on component mount and whenever the data or styling props change.
   *
   * The drawing process:
   * 1. Sets up the canvas with the correct dimensions and scaling
   * 2. Calculates the data range and visualization parameters
   * 3. Draws the line connecting all data points
   * 4. Adds a dot at the end point for emphasis
   *
   * High-DPI Display Handling:
   * - Detects the device pixel ratio
   * - Scales the canvas dimensions and context accordingly
   * - Applies anti-aliasing for smooth rendering
   */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Adjust canvas size for high-DPI displays to ensure sharp rendering
    const devicePixelRatio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * devicePixelRatio
    canvas.height = height * devicePixelRatio

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Scale the context to account for the device pixel ratio
    ctx.scale(devicePixelRatio, devicePixelRatio)

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, rect.width, height)

    // Handle empty data case
    if (!data.length) return

    // Calculate dimensions and padding
    const width = rect.width
    const padding = strokeWidth
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2

    // Find min and max values to normalize the data
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1 // Avoid division by zero

    // Enable anti-aliasing for smoother lines
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Begin drawing the line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = strokeWidth
    ctx.lineJoin = "round"
    ctx.lineCap = "round" // Round line ends for better appearance

    // Plot each data point
    data.forEach((value, i) => {
      // Calculate x position based on index and available width
      const x = padding + (i / (data.length - 1)) * graphWidth

      // Normalize the value to fit within the available height
      const normalizedValue = (value - min) / range

      // Calculate y position (inverted because canvas y increases downward)
      const y = height - padding - normalizedValue * graphHeight

      // Move to the first point or draw a line to subsequent points
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Draw the line
    ctx.stroke()

    // Add a dot at the end point for emphasis
    const lastX = padding + graphWidth
    const lastY = height - padding - ((data[data.length - 1] - min) / range) * graphHeight

    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(lastX, lastY, strokeWidth * 1.5, 0, Math.PI * 2)
    ctx.fill()
  }, [data, height, strokeWidth, color])

  /**
   * Mouse Move Handler
   *
   * Shows a tooltip with the value and label when hovering over the sparkline.
   * Calculates which data point is closest to the mouse position.
   *
   * Implementation Notes:
   * - Uses client coordinates to determine mouse position relative to canvas
   * - Calculates the nearest data point based on x-coordinate
   * - Updates tooltip state with position and content information
   *
   * @param e - The mouse move event
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !data.length) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = canvas.width
    const padding = strokeWidth
    const graphWidth = width - padding * 2

    // Find the closest data point to the mouse position
    const dataPointWidth = graphWidth / (data.length - 1)
    const index = Math.round((x - padding) / dataPointWidth)

    if (index >= 0 && index < data.length) {
      const max = Math.max(...data)
      const min = Math.min(...data)
      const range = max - min || 1

      const value = data[index]
      const normalizedValue = (value - min) / range
      const y = height - padding - normalizedValue * (height - padding * 2)

      // Use the provided label or generate a default one
      const label = labels[index] || `${index + 1}월`

      setTooltip({
        visible: true,
        x: padding + index * dataPointWidth,
        y,
        value,
        label,
      })
    }
  }

  /**
   * Mouse Leave Handler
   *
   * Hides the tooltip when the mouse leaves the sparkline.
   */
  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false })
  }

  return (
    <div ref={containerRef} className="relative inline-block w-full">
      {/* Canvas element for drawing the sparkline */}
      <canvas
        ref={canvasRef}
        height={height}
        width={100} // Initial width, will be resized based on container
        className="w-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Tooltip - only shown when hovering over a data point */}
      {tooltip.visible && (
        <div
          className="absolute bg-white text-xs px-2 py-1 rounded shadow-md pointer-events-none z-10 transform -translate-x-1/2 -translate-y-full border border-gray-200"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 5}px`, // Offset slightly above the point
          }}
        >
          <div className="font-medium">{tooltip.label}</div>
          <div className="text-blue-600 font-semibold">{tooltip.value.toLocaleString()} 검색량</div>
        </div>
      )}
    </div>
  )
}

