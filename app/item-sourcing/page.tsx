/**
 * Item Sourcing Page
 *
 * Purpose:
 * This page provides a comprehensive interface for users to explore and analyze product keywords
 * based on search volume, competition, and other metrics. It serves as a powerful tool for
 * e-commerce sellers to identify profitable product opportunities.
 *
 * Design Philosophy:
 * - Clean, contemporary UI with generous whitespace to reduce cognitive load
 * - Consistent use of Pretendard font throughout for better readability
 * - Sophisticated form controls and interactive elements for intuitive user experience
 * - Seamless integration with the overall site design language
 *
 * Key Features:
 * 1. Hierarchical category navigation for targeted keyword research
 * 2. Advanced filtering system with multiple criteria (search volume, brand type, etc.)
 * 3. Interactive data table with sortable columns and drag-and-drop reordering
 * 4. Visual data representations (sparklines, color-coded badges)
 * 5. Infinite scroll pagination for performance optimization
 * 6. Excel export functionality for offline analysis
 *
 * Technical Implementation:
 * - Uses React's useState and useEffect for state management
 * - Implements custom hooks for specific functionalities
 * - Leverages dnd-kit for drag-and-drop interactions
 * - Utilizes re-resizable for column width adjustments
 * - Implements virtualized rendering pattern for handling large datasets
 *
 * Future Enhancement Opportunities:
 * - Add server-side pagination for better performance with very large datasets
 * - Implement saved filters/searches functionality
 * - Add trend comparison between multiple keywords
 * - Integrate with actual API endpoints when moving to production
 *
 * @component
 */

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Navbar from "@/components/navbar"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkline } from "@/components/ui/sparkline"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ArrowUpDown,
  Search,
  Info,
  ChevronRight,
  BarChart3,
  Tag,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Maximize2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import * as XLSX from "xlsx"
import { Resizable } from "re-resizable"

/**
 * Category Interface
 *
 * Defines the structure for category data used throughout the application.
 * Designed to support hierarchical category structures of arbitrary depth.
 *
 * @property id - Unique identifier for the category
 * @property name - Display name of the category
 * @property level - Depth level in the category hierarchy (1 = top level)
 * @property parentId - Optional reference to parent category
 * @property children - Optional array of child categories
 * @property hasChildren - Optional flag indicating if category has children (for optimization)
 */
interface Category {
  id: string
  name: string
  level: number
  parentId?: string
  children?: Category[]
  hasChildren?: boolean // Flag to indicate if category has children without loading them
}

/**
 * Keyword Interface
 *
 * Defines the structure for keyword data displayed in the table.
 * Contains all metrics and properties needed for analysis and filtering.
 *
 * @property id - Unique identifier for the keyword
 * @property name - The actual keyword text
 * @property searchVolume - Monthly search volume
 * @property productCount - Number of products found for this keyword
 * @property competitionLevel - Categorized competition intensity
 * @property trendData - 12-month trend data for sparkline visualization
 * @property isBrand - Whether the keyword contains a brand name
 * @property searchType - Classification of search intent (shopping vs. informational)
 */
interface Keyword {
  id: string
  name: string
  searchVolume: number
  productCount: number
  competitionLevel: "낮음" | "중간" | "높음"
  trendData: number[]
  isBrand: boolean
  searchType: "쇼핑성" | "정보성"
}

/**
 * Column Interface
 *
 * Defines the structure for table columns configuration.
 * Supports customization of display, sorting, and rendering behavior.
 *
 * @property id - Unique identifier for the column
 * @property name - Display name in the table header
 * @property sortable - Whether the column can be sorted
 * @property tooltip - Optional help text explaining the column's meaning
 * @property width - Optional default width for the column
 * @property render - Function to render cell content for this column
 */
interface Column {
  id: string
  name: string
  sortable: boolean
  tooltip?: string
  width?: string
  render: (keyword: Keyword, index?: number) => React.ReactNode
}

/**
 * Mock Category Data
 *
 * Simulates a hierarchical category structure that would typically
 * be fetched from an API in a production environment.
 *
 * This data structure demonstrates:
 * 1. Multi-level category hierarchy (up to 4 levels deep)
 * 2. Parent-child relationships via parentId references
 * 3. Realistic category naming conventions
 *
 * In production, this would be replaced with API calls to fetch
 * categories dynamically based on user navigation.
 */
const mockCategories: Category[] = [
  {
    id: "1",
    name: "패션의류",
    level: 1,
    children: [
      {
        id: "1-1",
        name: "여성의류",
        level: 2,
        parentId: "1",
        children: [
          {
            id: "1-1-1",
            name: "원피스",
            level: 3,
            parentId: "1-1",
            children: [
              { id: "1-1-1-1", name: "미니 원피스", level: 4, parentId: "1-1-1" },
              { id: "1-1-1-2", name: "맥시 원피스", level: 4, parentId: "1-1-1" },
            ],
          },
          { id: "1-1-2", name: "티셔츠", level: 3, parentId: "1-1" },
          { id: "1-1-3", name: "블라우스/셔츠", level: 3, parentId: "1-1" },
        ],
      },
      {
        id: "1-2",
        name: "남성의류",
        level: 2,
        parentId: "1",
        children: [
          { id: "1-2-1", name: "티셔츠", level: 3, parentId: "1-2" },
          { id: "1-2-2", name: "셔츠", level: 3, parentId: "1-2" },
          { id: "1-2-3", name: "바지", level: 3, parentId: "1-2" },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "가구/인테리어",
    level: 1,
    children: [
      {
        id: "2-1",
        name: "침실가구",
        level: 2,
        parentId: "2",
        children: [
          {
            id: "2-1-1",
            name: "침대",
            level: 3,
            parentId: "2-1",
            children: [
              { id: "2-1-1-1", name: "싱글 침대", level: 4, parentId: "2-1-1" },
              { id: "2-1-1-2", name: "더블 침대", level: 4, parentId: "2-1-1" },
              { id: "2-1-1-3", name: "퀸 침대", level: 4, parentId: "2-1-1" },
            ],
          },
          { id: "2-1-2", name: "매트리스", level: 3, parentId: "2-1" },
          { id: "2-1-3", name: "옷장", level: 3, parentId: "2-1" },
        ],
      },
      {
        id: "2-2",
        name: "거실가구",
        level: 2,
        parentId: "2",
        children: [
          { id: "2-2-1", name: "소파", level: 3, parentId: "2-2" },
          { id: "2-2-2", name: "테이블", level: 3, parentId: "2-2" },
          { id: "2-2-3", name: "의자", level: 3, parentId: "2-2" },
        ],
      },
    ],
  },
]

/**
 * Generate Mock Keywords Function
 *
 * Creates realistic mock keyword data for a given category.
 * In a production environment, this would be replaced with API calls.
 *
 * The function generates keywords with:
 * - Realistic naming based on the category
 * - Randomized but plausible metrics
 * - Varied competition levels and search types
 * - Trend data for visualization
 *
 * Keywords are sorted by search volume to simulate the most common
 * use case where users want to see high-volume keywords first.
 *
 * @param categoryId - The ID of the category to generate keywords for
 * @returns An array of keyword objects sorted by search volume (descending)
 */
const generateMockKeywords = (categoryId: string): Keyword[] => {
  const keywords: Keyword[] = []

  // Generate 500 keywords to simulate a realistic dataset size
  for (let i = 1; i <= 500; i++) {
    // Get the category name to make the keywords contextually relevant
    const categoryName = findCategoryName(categoryId, mockCategories)

    // Randomly determine if this is a brand keyword (30% chance)
    const isBrand = Math.random() > 0.7

    // Randomly determine search type (50/50 split between shopping and informational)
    const searchType = Math.random() > 0.5 ? "쇼핑성" : "정보성"

    keywords.push({
      id: `${categoryId}-kw-${i}`,
      name: `${categoryName} ${isBrand ? "브랜드" : ""} 키워드 ${i}`,
      // Generate realistic search volume between 1,000 and 51,000
      searchVolume: Math.floor(Math.random() * 50000) + 1000,
      // Generate realistic product count between 100 and 10,100
      productCount: Math.floor(Math.random() * 10000) + 100,
      // Distribute competition levels with weighted probabilities
      competitionLevel: Math.random() < 0.33 ? "낮음" : Math.random() < 0.66 ? "중간" : "높음",
      // Generate 12 months of trend data for the sparkline chart
      trendData: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
      isBrand,
      searchType,
    })
  }

  // Sort by search volume (descending) to prioritize high-volume keywords
  // This is a common default sort in keyword research tools
  return keywords.sort((a, b) => b.searchVolume - a.searchVolume)
}

/**
 * Find Category Name Helper Function
 *
 * Recursively searches through the category hierarchy to find a category by ID
 * and returns its name. This is used to generate contextually relevant keywords.
 *
 * The recursive approach allows searching through categories of any depth.
 *
 * @param categoryId - The ID of the category to find
 * @param categories - The array of categories to search through
 * @returns The name of the found category or an empty string if not found
 */
const findCategoryName = (categoryId: string, categories: Category[]): string => {
  for (const category of categories) {
    // Check if this is the category we're looking for
    if (category.id === categoryId) return category.name

    // If this category has children, recursively search them
    if (category.children) {
      const name = findCategoryName(categoryId, category.children)
      if (name) return name
    }
  }
  return ""
}

/**
 * Sortable Table Header Component
 *
 * A specialized table header component that supports:
 * 1. Drag-and-drop reordering of columns
 * 2. Column sorting (ascending/descending)
 * 3. Tooltips for explaining column meanings
 * 4. Resizable column widths
 *
 * This component is a key part of the table's interactivity and usability,
 * allowing users to customize their view of the data.
 *
 * @param column - The column configuration object
 * @param onSort - Callback function for sorting the column
 * @param sortConfig - Current sort configuration
 * @param onResize - Callback function for resizing the column
 * @param columnWidths - Current column width settings
 */
const SortableTableHeader = ({
  column,
  onSort,
  sortConfig,
  onResize,
  columnWidths,
}: {
  column: Column
  onSort: (columnId: string) => void
  sortConfig: { key: string; direction: "asc" | "desc" } | null
  onResize: (columnId: string, width: number) => void
  columnWidths: Record<string, number>
}) => {
  // Use the dnd-kit useSortable hook to make the header draggable
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: column.id,
  })

  // Define the style for the header, including transform for drag animation
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: columnWidths[column.id] || column.width || "auto",
    // Fix width during drag to prevent layout shifts
    maxWidth: columnWidths[column.id] || column.width || "auto",
    minWidth: columnWidths[column.id] || column.width || "auto",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }

  // Determine if this column is currently being sorted
  const isSorted = sortConfig?.key === column.id
  const sortDirection = isSorted ? sortConfig.direction : undefined

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-4 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50 first:rounded-l-lg last:rounded-r-lg relative group"
    >
      <div className="flex items-center space-x-1">
        {/* Drag handle for column reordering */}
        <div
          className="w-4 h-4 flex items-center justify-center cursor-grab mr-1 hover:bg-gray-200 rounded"
          {...attributes}
          {...listeners}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H16M8 12H16M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Column name */}
        <span className="truncate">{column.name}</span>

        {/* Sort button - only shown for sortable columns */}
        {column.sortable && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSort(column.id)
            }}
            className="ml-1 focus:outline-none flex-shrink-0"
            aria-label={isSorted ? (sortDirection === "asc" ? "정렬: 오름차순" : "정렬: 내림차순") : "정렬"}
          >
            {isSorted ? (
              sortDirection === "asc" ? (
                <ChevronUp className="h-4 w-4 text-blue-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-blue-600" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}

        {/* Tooltip - only shown for columns with tooltip text */}
        {column.tooltip && (
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 ml-1 cursor-help hover:text-gray-600 transition-colors" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="max-w-xs bg-gray-900 text-white p-3 rounded-md shadow-lg"
              >
                <p className="text-xs leading-relaxed">{column.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Resizing handle - allows users to adjust column width */}
      <Resizable
        size={{ width: columnWidths[column.id] || Number.parseInt(column.width || "100"), height: "auto" }}
        onResizeStop={(e, direction, ref, d) => {
          const newWidth = (columnWidths[column.id] || Number.parseInt(column.width || "100")) + d.width
          onResize(column.id, newWidth)
        }}
        enable={{ right: true }}
        handleComponent={{
          right: (
            <div className="absolute right-0 top-0 h-full w-2 bg-transparent cursor-col-resize hover:bg-gray-300 hover:opacity-50" />
          ),
        }}
      />
    </th>
  )
}

/**
 * Item Sourcing Page Component
 *
 * The main component for the item sourcing page. This component orchestrates
 * all the functionality and UI elements for keyword research and analysis.
 *
 * Key responsibilities:
 * 1. Managing category navigation and selection
 * 2. Handling keyword data loading and filtering
 * 3. Managing table state (sorting, column order, column widths)
 * 4. Implementing infinite scroll pagination
 * 5. Providing data export functionality
 *
 * @returns The rendered Item Sourcing page
 */
export default function ItemSourcingPage() {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================

  /**
   * Category Navigation State
   *
   * These state variables manage the hierarchical category navigation.
   * The design allows for dynamic loading of subcategories as users
   * navigate deeper into the category tree.
   */
  const [selectedCategories, setSelectedCategories] = useState<{ id: string; name: string; level: number }[]>([
    { id: "1", name: "패션의류", level: 1 }, // Default to Fashion category
  ])
  const [categoryOptions, setCategoryOptions] = useState<{ level: number; categories: Category[] }[]>([
    { level: 1, categories: mockCategories }, // Initialize with top-level categories
  ])

  /**
   * Keyword Data State
   *
   * These state variables manage the keyword data and its filtering.
   * We maintain both the original keywords and the filtered keywords
   * to avoid re-fetching data when filters change.
   */
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [filteredKeywords, setFilteredKeywords] = useState<Keyword[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Filter State
   *
   * These state variables manage the various filters that can be applied
   * to the keyword data. Each filter type has its own state to allow for
   * independent control and clear UI feedback.
   */
  const [searchVolumeFilter, setSearchVolumeFilter] = useState<string>("")
  const [minSearchVolume, setMinSearchVolume] = useState<string>("")
  const [maxSearchVolume, setMaxSearchVolume] = useState<string>("")
  const [brandFilter, setBrandFilter] = useState<string[]>(["all"])
  const [searchTypeFilter, setSearchTypeFilter] = useState<string[]>(["all"])
  const [competitionFilter, setCompetitionFilter] = useState<string[]>(["all"])
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [ageFilter, setAgeFilter] = useState<string[]>([])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false)
  const [bestSellingMonthFilter, setBestSellingMonthFilter] = useState<string>("")
  const [searchVolumeIncreaseFilter, setSearchVolumeIncreaseFilter] = useState<string>("")
  const [customSearchVolumeIncrease, setCustomSearchVolumeIncrease] = useState<string>("")

  /**
   * Table UI State
   *
   * These state variables manage the table's UI behavior, including
   * expanded view, column widths, and pagination.
   */
  const [expandedTable, setExpandedTable] = useState(false)
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
  const [visibleKeywords, setVisibleKeywords] = useState<number>(30) // Initial page size
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)

  /**
   * Table Configuration State
   *
   * These state variables manage the table's configuration, including
   * sorting and column definitions.
   */
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>({
    key: "searchVolume", // Default sort by search volume
    direction: "desc", // Default sort direction is descending
  })

  // Table scroll container reference for infinite scroll implementation
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  /**
   * Brand Filter Change Handler
   *
   * Manages the multi-select behavior of the brand filter.
   * Special handling for the "all" option which acts as a select/deselect all.
   *
   * @param value - The filter value being toggled
   */
  const handleBrandFilterChange = (value: string) => {
    if (value === "all") {
      // If "all" is selected, clear other selections
      setBrandFilter(["all"])
    } else {
      // If a specific value is selected, toggle it
      const newFilter = brandFilter.includes(value)
        ? brandFilter.filter((item) => item !== value)
        : [...brandFilter.filter((item) => item !== "all"), value]

      // If no specific values are selected, default back to "all"
      setBrandFilter(newFilter.length ? newFilter : ["all"])
    }
  }

  /**
   * Excel Download Handler
   *
   * Exports the current filtered keywords to an Excel file.
   * Formats the data for better readability in Excel.
   */
  const downloadExcel = () => {
    // Prepare data for Excel export with formatted column names
    const data = filteredKeywords.map((keyword, index) => ({
      순위: index + 1,
      키워드: keyword.name,
      검색량: keyword.searchVolume,
      상품수: keyword.productCount,
      "경쟁 강도": keyword.competitionLevel,
      "브랜드 여부": keyword.isBrand ? "브랜드" : "일반",
      "검색어 유형": keyword.searchType,
      "TOP10 평균 가격": Math.floor(Math.random() * 50000) + 10000, // Mock data for demo
    }))

    // Create worksheet from data
    const ws = XLSX.utils.json_to_sheet(data)

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "키워드 데이터")

    // Trigger file download
    XLSX.writeFile(wb, "키워드_데이터.xlsx")
  }

  /**
   * Column Resize Handler
   *
   * Updates the column width state when a user resizes a column.
   *
   * @param columnId - The ID of the column being resized
   * @param width - The new width in pixels
   */
  const handleColumnResize = (columnId: string, width: number) => {
    setColumnWidths((prev) => ({
      ...prev,
      [columnId]: width,
    }))
  }

  /**
   * Search Type Filter Change Handler
   *
   * Manages the multi-select behavior of the search type filter.
   *
   * @param value - The filter value being toggled
   */
  const handleSearchTypeFilterChange = (value: string) => {
    if (value === "all") {
      // If "all" is selected, clear other selections
      setSearchTypeFilter(["all"])
    } else {
      // If a specific value is selected, toggle it
      const newFilter = searchTypeFilter.includes(value)
        ? searchTypeFilter.filter((item) => item !== value)
        : [...searchTypeFilter.filter((item) => item !== "all"), value]

      // If no specific values are selected, default back to "all"
      setSearchTypeFilter(newFilter.length ? newFilter : ["all"])
    }
  }

  /**
   * Competition Filter Change Handler
   *
   * Manages the multi-select behavior of the competition level filter.
   *
   * @param value - The filter value being toggled
   */
  const handleCompetitionFilterChange = (value: string) => {
    if (value === "all") {
      // If "all" is selected, clear other selections
      setCompetitionFilter(["all"])
    } else {
      // If a specific value is selected, toggle it
      const newFilter = competitionFilter.includes(value)
        ? competitionFilter.filter((item) => item !== value)
        : [...competitionFilter.filter((item) => item !== "all"), value]

      // If no specific values are selected, default back to "all"
      setCompetitionFilter(newFilter.length ? newFilter : ["all"])
    }
  }

  /**
   * Age Filter Change Handler
   *
   * Manages the multi-select behavior of the age filter.
   * Unlike other filters, this doesn't have an "all" option,
   * allowing users to select multiple specific age ranges.
   *
   * @param value - The age range being toggled
   */
  const handleAgeFilterChange = (value: string) => {
    // Toggle the selected age range
    const newFilter = ageFilter.includes(value) ? ageFilter.filter((item) => item !== value) : [...ageFilter, value]

    setAgeFilter(newFilter)
  }

  /**
   * Sort Handler
   *
   * Manages the sorting behavior of the table columns.
   * Clicking the same column toggles between ascending and descending.
   * Clicking a different column sorts by that column in descending order.
   *
   * @param columnId - The ID of the column to sort by
   */
  const handleSort = (columnId: string) => {
    setSortConfig((prevConfig) => {
      // If clicking the same column, toggle direction
      if (prevConfig && prevConfig.key === columnId) {
        return {
          key: columnId,
          direction: prevConfig.direction === "asc" ? "desc" : "asc",
        }
      }

      // If clicking a different column, sort descending by default
      return {
        key: columnId,
        direction: "desc",
      }
    })
  }

  /**
   * Drag End Handler
   *
   * Manages the column reordering behavior when a user drags a column.
   *
   * @param event - The drag end event from dnd-kit
   */
  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = [...items]
        const [removed] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, removed)

        return newItems
      })
    }
  }

  /**
   * Reset Filters Function
   *
   * Resets all filter states to their default values.
   * This provides users with a quick way to clear all applied filters.
   */
  const resetFilters = () => {
    setSearchTerm("")
    setSearchVolumeFilter("")
    setMinSearchVolume("")
    setMaxSearchVolume("")
    setBrandFilter(["all"])
    setSearchTypeFilter(["all"])
    setCompetitionFilter(["all"])
    setGenderFilter("all")
    setAgeFilter([])
    setBestSellingMonthFilter("")
    setSearchVolumeIncreaseFilter("")
    setCustomSearchVolumeIncrease("")
  }

  // =========================================================================
  // COMPUTED PROPERTIES
  // =========================================================================

  /**
   * Has Active Filters
   *
   * Computed property that checks if any filters are currently active.
   * Used to conditionally render UI elements like the reset filters button.
   */
  const hasActiveFilters =
    searchTerm !== "" ||
    searchVolumeFilter !== "" ||
    !brandFilter.includes("all") ||
    !searchTypeFilter.includes("all") ||
    !competitionFilter.includes("all") ||
    genderFilter !== "all" ||
    ageFilter.length > 0 ||
    bestSellingMonthFilter !== "" ||
    searchVolumeIncreaseFilter !== ""

  // =========================================================================
  // TABLE COLUMN DEFINITIONS
  // =========================================================================

  /**
   * Table Columns Configuration
   *
   * Defines the columns displayed in the keyword table, including:
   * - Display properties (name, width, tooltip)
   * - Behavior properties (sortable)
   * - Rendering function for each cell
   *
   * This configuration-based approach makes it easy to:
   * 1. Add/remove columns
   * 2. Customize column appearance and behavior
   * 3. Implement complex cell rendering logic
   */
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "rank",
      name: "순위",
      sortable: false,
      width: "80px",
      tooltip: "검색량을 기준으로 한 키워드의 순위입니다. 높은 순위는 높은 검색량을 의미합니다.",
      render: (_, index) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-medium">
          {index! + 1}
        </div>
      ),
    },
    {
      id: "name",
      name: "키워드",
      sortable: true,
      width: "250px",
      tooltip: "사용자들이 검색하는 실제 검색어입니다. 클릭하면 해당 키워드에 대한 상세 정보를 볼 수 있습니다.",
      render: (keyword) => (
        <div className="font-medium text-blue-600 hover:underline cursor-pointer truncate max-w-full">
          {keyword.name}
        </div>
      ),
    },
    {
      id: "searchVolume",
      name: "검색량",
      sortable: true,
      width: "120px",
      tooltip: "최근 30일 동안의 검색 횟수입니다. 높은 검색량은 높은 소비자 관심도를 의미합니다.",
      render: (keyword) => <div className="font-medium truncate">{keyword.searchVolume.toLocaleString()}</div>,
    },
    {
      id: "productCount",
      name: "상품수",
      sortable: true,
      width: "120px",
      tooltip: "해당 키워드로 검색했을 때 나오는 상품의 수입니다. 상품수가 많을수록 경쟁이 치열할 수 있습니다.",
      render: (keyword) => <div>{keyword.productCount.toLocaleString()}</div>,
    },
    {
      id: "competitionLevel",
      name: "경쟁 강도",
      sortable: true,
      width: "120px",
      tooltip:
        "키워드 경쟁 수준을 낮음, 중간, 높음으로 분류합니다. 검색량 대비 상품수와 광고 경쟁 정도를 고려하여 산출됩니다.",
      render: (keyword) => {
        // Color-code the competition level for quick visual assessment
        const color =
          keyword.competitionLevel === "낮음"
            ? "bg-green-100 text-green-800 border-green-200"
            : keyword.competitionLevel === "중간"
              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
              : "bg-red-100 text-red-800 border-red-200"

        return (
          <Badge variant="outline" className={color}>
            {keyword.competitionLevel}
          </Badge>
        )
      },
    },
    {
      id: "avgPrice",
      name: "TOP10 평균 가격",
      sortable: true,
      width: "150px",
      tooltip:
        "상위 10개 상품의 평균 가격입니다. 이 지표를 통해 해당 키워드의 가격 경쟁력과 시장 포지셔닝을 파악할 수 있습니다.",
      render: (keyword) => {
        // In a real implementation, this would use actual data from the API
        const avgPrice = Math.floor(Math.random() * 50000) + 10000
        return <div>₩{avgPrice.toLocaleString()}</div>
      },
    },
    {
      id: "trend",
      name: "1년 트렌드",
      sortable: false,
      width: "150px",
      tooltip:
        "최근 12개월 검색량 추이를 그래프로 표시합니다. 상승 추세는 녹색, 하락 추세는 빨간색으로 표시됩니다. 계절성 패턴이나 성장 추세를 파악하는 데 유용합니다.",
      render: (keyword) => {
        // Generate month labels for the sparkline tooltip
        const monthLabels = []
        const currentDate = new Date()
        for (let i = 11; i >= 0; i--) {
          const month = new Date(currentDate)
          month.setMonth(currentDate.getMonth() - i)
          monthLabels.push(month.toLocaleString("ko-KR", { month: "long" }))
        }

        // Color the sparkline based on trend direction (green for up, red for down)
        return (
          <div className="w-full">
            <Sparkline
              data={keyword.trendData}
              height={30}
              strokeWidth={2}
              color={keyword.trendData[11] > keyword.trendData[0] ? "#10b981" : "#ef4444"}
              labels={monthLabels}
            />
          </div>
        )
      },
    },
    {
      id: "gender",
      name: "성별",
      sortable: true,
      width: "120px",
      tooltip:
        "키워드 검색자의 주요 성별 분포입니다. 검색 비율이 70% 이상인 경우 해당 성별로 표시되며, 그 외에는 '일반'으로 표시됩니다.",
      render: (keyword) => {
        // In a real implementation, this would use actual data from the API
        const femaleRatio = Math.random() * 100
        let gender = "일반"
        let badgeClass = "bg-gray-50 text-gray-700 border-gray-200"

        // Determine gender category based on distribution
        if (femaleRatio >= 70) {
          gender = "여성"
          badgeClass = "bg-pink-50 text-pink-700 border-pink-200"
        } else if (femaleRatio <= 30) {
          gender = "남성"
          badgeClass = "bg-blue-50 text-blue-700 border-blue-200"
        }

        return (
          <Badge variant="outline" className={badgeClass}>
            {gender}
          </Badge>
        )
      },
    },
    {
      id: "ageDistribution",
      name: "연령별 분포",
      sortable: false,
      width: "200px",
      tooltip:
        "키워드 검색자의 연령대별 분포를 시각화합니다. 각 색상 막대는 해당 연령대의 검색 비율을 나타내며, 마우스를 올리면 정확한 비율을 확인할 수 있습니다.",
      render: (keyword) => {
        // Generate mock age distribution data
        // In a real implementation, this would use actual data from the API
        const ageData = [
          { age: "10대", value: Math.floor(Math.random() * 30) },
          { age: "20대", value: Math.floor(Math.random() * 30) },
          { age: "30대", value: Math.floor(Math.random() * 30) },
          { age: "40대", value: Math.floor(Math.random() * 30) },
          { age: "50대", value: Math.floor(Math.random() * 20) },
          { age: "60대", value: Math.floor(Math.random() * 10) },
        ]

        // Normalize values to sum to 100%
        const total = ageData.reduce((sum, item) => sum + item.value, 0)
        ageData.forEach((item) => {
          item.value = Math.round((item.value / total) * 100)
        })

        // Render a horizontal stacked bar chart
        return (
          <div className="w-full h-8 overflow-hidden">
            <div className="flex h-full">
              {ageData.map((item, i) => (
                <div
                  key={i}
                  className="h-full relative group"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor:
                      i === 0
                        ? "#c4b5fd"
                        : // 10대 (보라)
                          i === 1
                          ? "#93c5fd"
                          : // 20대 (파랑)
                            i === 2
                            ? "#6ee7b7"
                            : // 30대 (초록)
                              i === 3
                              ? "#fcd34d"
                              : // 40대 (노랑)
                                i === 4
                                ? "#fca5a5"
                                : // 50대 (빨강)
                                  "#f9a8d4", // 60대 (분홍)
                    minWidth: item.value > 0 ? "4px" : "0",
                  }}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    {item.age}: {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      },
    },
    {
      id: "isBrand",
      name: "브랜드 여부",
      sortable: true,
      width: "120px",
      tooltip:
        "키워드가 브랜드명을 포함하는지 여부입니다. 브랜드 키워드는 일반적으로 구매 의도가 높고 전환율이 높은 경향이 있습니다.",
      render: (keyword) => (
        <div>
          {keyword.isBrand ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              브랜드
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              일반
            </Badge>
          )}
        </div>
      ),
    },
    {
      id: "searchType",
      name: "검색어 유형",
      sortable: true,
      width: "120px",
      tooltip:
        "키워드의 검색 의도를 분류합니다. '쇼핑성'은 구매 의도가 높은 키워드, '정보성'은 정보 탐색이 주 목적인 키워드를 의미합니다. 쇼핑성 키워드는 일반적으로 전환율이 더 높습니다.",
      render: (keyword) => (
        <div>
          {keyword.searchType === "쇼핑성" ? (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              쇼핑성
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              정보성
            </Badge>
          )}
        </div>
      ),
    },
  ])

  // =========================================================================
  // EFFECTS
  // =========================================================================

  /**
   * Initial Data Loading Effect
   *
   * Loads keyword data for the default category when the component mounts.
   * In a production environment, this would make an API call.
   */
  useEffect(() => {
    // Only run once on initial load
    if (selectedCategories.length > 0 && isLoading) {
      const categoryId = selectedCategories[0].id

      // Simulate API call with timeout
      setTimeout(() => {
        const newKeywords = generateMockKeywords(categoryId)
        setKeywords(newKeywords)
        setFilteredKeywords(newKeywords)
        setIsLoading(false)
      }, 800)
    }
  }, [])

  /**
   * Filter and Sort Effect
   *
   * Applies filters and sorting to the keyword data whenever relevant state changes.
   * This keeps the filtered keywords in sync with the filter and sort settings.
   */
  useEffect(() => {
    let result = [...keywords]

    // Apply search term filter
    if (searchTerm) {
      result = result.filter((keyword) => keyword.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply search volume filter
    if (searchVolumeFilter) {
      if (searchVolumeFilter === "custom") {
        // Apply custom min/max search volume filters
        if (minSearchVolume) {
          result = result.filter((keyword) => keyword.searchVolume >= Number.parseInt(minSearchVolume))
        }
        if (maxSearchVolume) {
          result = result.filter((keyword) => keyword.searchVolume <= Number.parseInt(maxSearchVolume))
        }
      } else {
        // Apply preset search volume threshold
        const threshold = Number.parseInt(searchVolumeFilter)
        result = result.filter((keyword) => keyword.searchVolume >= threshold)
      }
    }

    // Apply brand filter
    if (!brandFilter.includes("all")) {
      const includeBrand = brandFilter.includes("brand")
      const includeNonBrand = brandFilter.includes("non-brand")

      if (includeBrand && !includeNonBrand) {
        result = result.filter((keyword) => keyword.isBrand)
      } else if (!includeBrand && includeNonBrand) {
        result = result.filter((keyword) => !keyword.isBrand)
      }
    }

    // Apply search type filter
    if (!searchTypeFilter.includes("all")) {
      result = result.filter((keyword) => searchTypeFilter.includes(keyword.searchType))
    }

    // Apply competition level filter
    if (!competitionFilter.includes("all")) {
      result = result.filter((keyword) => competitionFilter.includes(keyword.competitionLevel))
    }

    // Apply gender filter (mock implementation)
    if (genderFilter !== "all") {
      // In a real implementation, this would filter based on actual gender data
    }

    // Apply age filter (mock implementation)
    if (ageFilter.length > 0) {
      // In a real implementation, this would filter based on actual age data
    }

    // Apply best selling month filter (mock implementation)
    if (bestSellingMonthFilter) {
      // In a real implementation, this would filter based on actual monthly data
    }

    // Apply search volume increase filter (mock implementation)
    if (searchVolumeIncreaseFilter) {
      // In a real implementation, this would filter based on actual trend data
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    setFilteredKeywords(result)
  }, [
    keywords,
    searchTerm,
    searchVolumeFilter,
    minSearchVolume,
    maxSearchVolume,
    brandFilter,
    searchTypeFilter,
    competitionFilter,
    genderFilter,
    ageFilter,
    bestSellingMonthFilter,
    searchVolumeIncreaseFilter,
    customSearchVolumeIncrease,
    sortConfig,
  ])

  /**
   * Infinite Scroll Effect
   *
   * Implements infinite scrolling for the keyword table.
   * When the user scrolls near the bottom, more keywords are loaded.
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!tableContainerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current

      // Load more when user scrolls near the bottom
      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        !isLoadingMore &&
        visibleKeywords < filteredKeywords.length
      ) {
        setIsLoadingMore(true)

        // Simulate loading delay for better UX
        setTimeout(() => {
          // Load 20 more keywords
          setVisibleKeywords((prev) => Math.min(prev + 20, filteredKeywords.length))
          setIsLoadingMore(false)
        }, 300)
      }
    }

    // Add scroll event listener to the table container
    const tableContainer = tableContainerRef.current
    if (tableContainer) {
      tableContainer.addEventListener("scroll", handleScroll)
    }

    // Clean up event listener on unmount
    return () => {
      if (tableContainer) {
        tableContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [filteredKeywords.length, isLoadingMore, visibleKeywords])

  // =========================================================================
  // RENDER
  // =========================================================================

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar />

      <div className="container px-4 md:px-6 py-8">
        {/* Page Header Section */}
        <div className="mb-8">
          <div className="flex flex-col space-y-2">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>홈</span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>도구</span>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-blue-600 font-medium">아이템 소싱</span>
            </div>

            {/* Page Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <Tag className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">아이템 소싱하기</h1>
            </div>

            {/* Page Description */}
            <p className="text-gray-600 max-w-3xl">
              검색량 기반으로 인기 키워드를 분석하고 유망한 상품을 발굴하세요. 카테고리별 상위 500개 키워드의 검색량,
              경쟁 강도, 트렌드를 확인할 수 있습니다.
            </p>

            {/* Update Information */}
            <div className="flex items-center mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center">
                <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                최근 업데이트: 2025년 3월 1일
              </Badge>

              {/* Selected Category Path */}
              {selectedCategories.length > 0 && (
                <div className="ml-4 flex items-center text-sm text-gray-500">
                  <span>선택 카테고리:</span>
                  {selectedCategories.map((category, index) => (
                    <span key={index} className="flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 mx-1 text-gray-400" />
                      <span className={index === selectedCategories.length - 1 ? "font-medium text-blue-600" : ""}>
                        {category.name}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Selection Section */}
        <Card className="mb-8 shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-medium">카테고리 선택</CardTitle>
            <CardDescription>
              분석하고자 하는 카테고리를 선택하세요. 하위 카테고리로 이동할수록 더 구체적인 키워드를 확인할 수 있습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Dynamically Generated Category Selection UI */}
              {categoryOptions.map((option, index) => (
                <div key={`category-level-${option.level}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{option.level}차 카테고리</label>
                  <Select
                    value={selectedCategories[option.level - 1]?.id || ""}
                    onValueChange={(value) => {
                      // Update selected category
                      const selectedCategory = option.categories.find((c) => c.id === value)
                      if (!selectedCategory) return

                      // Clear deeper category selections
                      const newSelectedCategories = selectedCategories.filter((c) => c.level < option.level)
                      newSelectedCategories.push({
                        id: selectedCategory.id,
                        name: selectedCategory.name,
                        level: option.level,
                      })
                      setSelectedCategories(newSelectedCategories)

                      // Update category options for the next level
                      if (selectedCategory.children && selectedCategory.children.length > 0) {
                        const newCategoryOptions = categoryOptions.filter((o) => o.level <= option.level)
                        newCategoryOptions.push({
                          level: option.level + 1,
                          categories: selectedCategory.children,
                        })
                        setCategoryOptions(newCategoryOptions)
                      } else {
                        // If no children, remove deeper level options
                        setCategoryOptions(categoryOptions.filter((o) => o.level <= option.level))
                      }

                      // Load keywords for the selected category
                      const categoryId = selectedCategory.id
                      if (categoryId) {
                        setIsLoading(true)
                        // Simulate API call with timeout
                        setTimeout(() => {
                          const newKeywords = generateMockKeywords(categoryId)
                          setKeywords(newKeywords)
                          setFilteredKeywords(newKeywords)
                          setIsLoading(false)
                        }, 800)
                      }
                    }}
                  >
                    <SelectTrigger className="h-11 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <SelectValue placeholder={`${option.level}차 카테고리 선택`} />
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200 shadow-md rounded-md">
                      {option.categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="focus:bg-blue-50">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {/* Selected Category Path Display */}
              {selectedCategories.length > 0 && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>선택 카테고리:</span>
                  {selectedCategories.map((category, index) => (
                    <span key={index} className="flex items-center">
                      <ChevronRight className="h-3.5 w-3.5 mx-1 text-gray-400" />
                      <span className={index === selectedCategories.length - 1 ? "font-medium text-blue-600" : ""}>
                        {category.name}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filter and Search Section */}
        <Card className="mb-8 shadow-sm border border-gray-100 overflow-hidden">
          <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-medium">필터 및 검색</CardTitle>
                <CardDescription>원하는 조건에 맞는 키워드를 찾기 위해 필터를 적용하세요.</CardDescription>
              </div>

              {/* Reset Filters Button - Only shown when filters are active */}
              {(searchTerm ||
                searchVolumeFilter !== "" ||
                !brandFilter.includes("all") ||
                !searchTypeFilter.includes("all") ||
                !competitionFilter.includes("all") ||
                genderFilter !== "all" ||
                ageFilter.length > 0 ||
                bestSellingMonthFilter !== "" ||
                searchVolumeIncreaseFilter !== "") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-gray-600"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  필터 초기화
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Basic Filters Section */}
            <div className="space-y-6">
              {/* Row 1: Keyword Search and Search Volume Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Keyword Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">키워드 검색</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="키워드 검색..."
                      className="pl-10 h-11 bg-white border border-gray-200 rounded-lg shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Search Volume Filter */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">검색량</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <Button
                      variant={searchVolumeFilter === "5000" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchVolumeFilter("5000")}
                      className="h-11"
                    >
                      5,000 이상
                    </Button>
                    <Button
                      variant={searchVolumeFilter === "10000" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchVolumeFilter("10000")}
                      className="h-11"
                    >
                      10,000 이상
                    </Button>
                    <Button
                      variant={searchVolumeFilter === "20000" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchVolumeFilter("20000")}
                      className="h-11"
                    >
                      20,000 이상
                    </Button>
                    <Button
                      variant={searchVolumeFilter === "50000" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchVolumeFilter("50000")}
                      className="h-11"
                    >
                      50,000 이상
                    </Button>
                    <Button
                      variant={searchVolumeFilter === "custom" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSearchVolumeFilter("custom")}
                      className="h-11"
                    >
                      직접 입력
                    </Button>
                  </div>

                  {/* Custom Search Volume Input Fields - Only shown when "직접 입력" is selected */}
                  {searchVolumeFilter === "custom" && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">최소 검색량</label>
                        <Input
                          type="number"
                          placeholder="최소값"
                          className="h-9"
                          value={minSearchVolume}
                          onChange={(e) => setMinSearchVolume(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">최대 검색량</label>
                        <Input
                          type="number"
                          placeholder="최대값"
                          className="h-9"
                          value={maxSearchVolume}
                          onChange={(e) => setMaxSearchVolume(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Checkbox Filter Groups */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand Type Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">브랜드 여부</label>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="brand-all"
                        checked={brandFilter.includes("all")}
                        onChange={() => handleBrandFilterChange("all")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="brand-all" className="ml-2 text-sm text-gray-700">
                        전체
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="brand-brand"
                        checked={brandFilter.includes("brand")}
                        onChange={() => handleBrandFilterChange("brand")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="brand-brand" className="ml-2 text-sm text-gray-700">
                        브랜드
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="brand-non-brand"
                        checked={brandFilter.includes("non-brand")}
                        onChange={() => handleBrandFilterChange("non-brand")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="brand-non-brand" className="ml-2 text-sm text-gray-700">
                        일반
                      </label>
                    </div>
                  </div>
                </div>

                {/* Search Type Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">검색어 유형</label>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="search-type-all"
                        checked={searchTypeFilter.includes("all")}
                        onChange={() => handleSearchTypeFilterChange("all")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="search-type-all" className="ml-2 text-sm text-gray-700">
                        전체
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="search-type-shopping"
                        checked={searchTypeFilter.includes("쇼핑성")}
                        onChange={() => handleSearchTypeFilterChange("쇼핑성")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="search-type-shopping" className="ml-2 text-sm text-gray-700">
                        쇼핑성
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="search-type-info"
                        checked={searchTypeFilter.includes("정보성")}
                        onChange={() => handleSearchTypeFilterChange("정보성")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="search-type-info" className="ml-2 text-sm text-gray-700">
                        정보성
                      </label>
                    </div>
                  </div>
                </div>

                {/* Competition Level Checkboxes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">경쟁 강도</label>
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="competition-all"
                        checked={competitionFilter.includes("all")}
                        onChange={() => handleCompetitionFilterChange("all")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="competition-all" className="ml-2 text-sm text-gray-700">
                        전체
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="competition-low"
                        checked={competitionFilter.includes("낮음")}
                        onChange={() => handleCompetitionFilterChange("낮음")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="competition-low" className="ml-2 text-sm text-gray-700">
                        낮음
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="competition-medium"
                        checked={competitionFilter.includes("중간")}
                        onChange={() => handleCompetitionFilterChange("중간")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="competition-medium" className="ml-2 text-sm text-gray-700">
                        중간
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="competition-high"
                        checked={competitionFilter.includes("높음")}
                        onChange={() => handleCompetitionFilterChange("높음")}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="competition-high" className="ml-2 text-sm text-gray-700">
                        높음
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Gender and Age Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">성별</label>
                  <div className="flex space-x-2">
                    <Button
                      variant={genderFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGenderFilter("all")}
                      className="flex-1 h-11"
                    >
                      전체
                    </Button>
                    <Button
                      variant={genderFilter === "male" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGenderFilter("male")}
                      className="flex-1 h-11"
                    >
                      남성
                    </Button>
                    <Button
                      variant={genderFilter === "female" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGenderFilter("female")}
                      className="flex-1 h-11"
                    >
                      여성
                    </Button>
                  </div>
                </div>

                {/* Age Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">연령대</label>
                  <div className="grid grid-cols-6 gap-2">
                    {["10", "20", "30", "40", "50", "60"].map((age) => (
                      <Button
                        key={age}
                        variant={ageFilter.includes(age) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAgeFilterChange(age)}
                        className="h-11"
                      >
                        {age}대
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Filters Toggle Button */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-1.5"
                >
                  {showAdvancedFilters ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      고급 필터 닫기
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      고급 필터 열기
                    </>
                  )}
                </Button>
              </div>

              {/* Advanced Filters Section - Only shown when expanded */}
              {showAdvancedFilters && (
                <div className="pt-4 border-t border-gray-200 space-y-6">
                  {/* Best Selling Month Filter */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">가장 많이 팔린 달</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p className="text-xs">
                              각 키워드의 월별 검색량 데이터를 기반으로, 최대 검색량의 80% 이상을 만족하는 달들의
                              중앙값을 대표 검색월로 선정합니다. 이를 통해 계절성 패턴을 효과적으로 반영할 수 있습니다.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((month) => (
                        <Button
                          key={month}
                          variant={bestSellingMonthFilter === month ? "default" : "outline"}
                          size="sm"
                          onClick={() => setBestSellingMonthFilter(bestSellingMonthFilter === month ? "" : month)}
                          className="h-11"
                        >
                          {month}월
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Search Volume Increase Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">전달 대비 검색량 상승</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={searchVolumeIncreaseFilter === "any" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchVolumeIncreaseFilter("any")}
                        className="h-11"
                      >
                        상승 키워드
                      </Button>
                      <Button
                        variant={searchVolumeIncreaseFilter === "5000" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchVolumeIncreaseFilter("5000")}
                        className="h-11"
                      >
                        전달 대비 5,000 이상
                      </Button>
                      <Button
                        variant={searchVolumeIncreaseFilter === "10000" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchVolumeIncreaseFilter("10000")}
                        className="h-11"
                      >
                        전달 대비 10,000 이상
                      </Button>
                      <Button
                        variant={searchVolumeIncreaseFilter === "custom" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSearchVolumeIncreaseFilter("custom")}
                        className="h-11"
                      >
                        직접 입력
                      </Button>

                      {/* Custom Search Volume Increase Input - Only shown when "직접 입력" is selected */}
                      {searchVolumeIncreaseFilter === "custom" && (
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-sm">전달 대비</span>
                          <Input
                            type="number"
                            placeholder="검색량"
                            className="w-24 h-9"
                            value={customSearchVolumeIncrease}
                            onChange={(e) => setCustomSearchVolumeIncrease(e.target.value)}
                          />
                          <span className="text-sm">이상</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Filter Results Summary */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>검색 결과: </span>
                <span className="font-medium text-gray-900">{filteredKeywords.length}</span>
                <span> 개 키워드</span>
                {hasActiveFilters && <span className="ml-2 text-blue-600">(필터 적용됨)</span>}
              </div>

              {/* Reset Filters Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="flex items-center gap-1.5"
                disabled={!hasActiveFilters}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                필터 초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keywords Ranking Table */}
        <Card
          className="shadow-sm border border-gray-100 overflow-hidden relative"
          style={{ height: "calc(100vh - 150px)" }}
        >
          <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-medium">키워드 순위표</CardTitle>
                <CardDescription>검색량 기준 상위 500개 키워드 (컬럼 헤더를 드래그하여 순서 변경 가능)</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                {/* Reset Column Widths Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Reset all column widths to their default values
                    setColumnWidths({})
                  }}
                  className="flex items-center gap-1.5"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  컬럼 너비 초기화
                </Button>

                {/* Excel Download Button */}
                <Button variant="outline" size="sm" onClick={downloadExcel} className="flex items-center gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  엑셀 다운로드
                </Button>

                {/* Table Expand/Collapse Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedTable(!expandedTable)}
                  className="flex items-center gap-1.5"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  {expandedTable ? "너비 축소" : "너비 확장"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-500">키워드 데이터를 불러오는 중...</p>
                </div>
              </div>
            ) : (
              /* Table Container with Horizontal and Vertical Scrolling */
              <div
                ref={tableContainerRef}
                className="overflow-x-auto custom-scrollbar"
                style={{
                  maxHeight: "calc(100vh - 200px)",
                  height: "calc(100vh - 200px)",
                  minHeight: "800px", // Increased height to show more rows
                  width: expandedTable ? "100vw" : "100%",
                  transition: "width 0.3s ease",
                  marginLeft: expandedTable ? "calc(-1 * ((100vw - 100%) / 2))" : "0", // Adjust left margin when expanded
                  marginRight: expandedTable ? "calc(-1 * ((100vw - 100%) / 2))" : "0", // Adjust right margin when expanded
                  paddingLeft: expandedTable ? "24px" : "0",
                  paddingRight: expandedTable ? "24px" : "0",
                }}
              >
                <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <SortableContext items={columns.map((col) => col.id)} strategy={horizontalListSortingStrategy}>
                          {columns.map((column) => (
                            <SortableTableHeader
                              key={column.id}
                              column={column}
                              onSort={handleSort}
                              sortConfig={sortConfig}
                              onResize={handleColumnResize}
                              columnWidths={columnWidths}
                            />
                          ))}
                        </SortableContext>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* Render only visible keywords for performance */}
                      {filteredKeywords.slice(0, visibleKeywords).map((keyword, index) => (
                        <TableRow
                          key={keyword.id}
                          className="hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-0"
                        >
                          {columns.map((column) => (
                            <TableCell
                              key={`${keyword.id}-${column.id}`}
                              className="py-4 px-4 whitespace-nowrap"
                              style={{
                                width: columnWidths[column.id] || column.width || "auto",
                                minWidth: columnWidths[column.id] || column.width || "auto",
                                maxWidth: columnWidths[column.id] || column.width || "auto",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {column.id === "rank" ? column.render(keyword, index) : column.render(keyword)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}

                      {/* Loading More Indicator */}
                      {isLoadingMore && (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Empty State */}
                      {filteredKeywords.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="py-16 text-center text-gray-500">
                            <div className="flex flex-col items-center justify-center">
                              <Search className="h-10 w-10 text-gray-300 mb-2" />
                              <p>검색 결과가 없습니다.</p>
                              <p className="text-sm mt-1">다른 필터 조건을 시도해보세요.</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </DndContext>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        /* Pretendard Font Application */
        * {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
        }
        
        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        
        /* Table Row Animation */
        tbody tr {
          transition: all 0.2s ease;
        }
        
        /* Table Header Styling */
        th {
          position: sticky;
          top: 0;
          background-color: #f9fafb;
          z-index: 10;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        /* Select Element Styling */
        .select-trigger {
          transition: all 0.2s ease;
        }
        .select-trigger:hover {
          border-color: #d1d5db;
        }
        .select-trigger:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        /* Table Cell Text Overflow Handling */
        td {
          max-width: 0; /* This setting is necessary for text-overflow to work */
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  )
}

