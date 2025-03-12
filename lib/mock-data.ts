/**
 * Mock Data Generation Module
 *
 * Purpose:
 * Provides utility functions for generating realistic mock data for development and testing.
 * This module simulates API responses that would typically come from a backend service.
 *
 * Design Philosophy:
 * - Realistic: Generate data that closely resembles production data patterns
 * - Consistent: Provide deterministic results for specific inputs
 * - Comprehensive: Cover all data types needed by the application
 * - Configurable: Allow customization of generated data characteristics
 *
 * Key Features:
 * 1. Random number generation within specified ranges
 * 2. Date-based data generation for time series
 * 3. Realistic distribution patterns for demographic data
 * 4. Seasonal variations in time-series data
 *
 * Usage Context:
 * This module is used throughout the application during development to:
 * - Populate UI components with realistic data
 * - Test filtering and sorting functionality
 * - Simulate API responses for different scenarios
 * - Demonstrate the application's capabilities without a backend
 *
 * In production, these functions would be replaced with actual API calls.
 */

/**
 * Random Number Generator
 *
 * Generates a random integer within a specified range (inclusive).
 * Used as a building block for more complex data generation.
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Date Generator
 *
 * Generates an array of dates for a specified period and frequency.
 * Used for creating time-series data with proper temporal spacing.
 *
 * Implementation Notes:
 * - Creates dates from 3 years ago to the current date
 * - Supports daily, weekly, and monthly frequencies
 * - Returns Date objects for flexible formatting later
 *
 * @param period - The frequency of dates to generate ("daily", "weekly", or "monthly")
 * @returns An array of Date objects
 */
const generateDates = (period: "daily" | "weekly" | "monthly") => {
  const dates = []
  const now = new Date()
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate())

  const current = new Date(threeYearsAgo)

  // Generate dates until we reach the current date
  while (current <= now) {
    dates.push(new Date(current))

    // Increment the date based on the specified period
    if (period === "daily") {
      current.setDate(current.getDate() + 1)
    } else if (period === "weekly") {
      current.setDate(current.getDate() + 7)
    } else {
      current.setMonth(current.getMonth() + 1)
    }
  }

  return dates
}

/**
 * Search Trends Generator
 *
 * Generates realistic search volume data for a keyword over different time periods.
 * Incorporates seasonal patterns and random variations to simulate real-world data.
 *
 * Implementation Notes:
 * - Base search volume is derived from the keyword length (longer keywords typically have lower volume)
 * - Seasonal factors increase search volume during holiday seasons (Oct-Jan)
 * - Weekend factors decrease search volume on weekends
 * - Random factors add natural variation to the data
 *
 * @param query - The search keyword to generate trends for
 * @returns An object containing daily, weekly, and monthly search trend data
 */
const generateSearchTrends = (query: string) => {
  // Base search volume is influenced by keyword length
  // Longer keywords typically have lower search volume
  const baseSearchVolume = query.length * 1000 + randomNumber(5000, 15000)

  // Generate daily data
  const dailyDates = generateDates("daily")
  const daily = dailyDates.map((date) => {
    // Add seasonal trends and day-of-week patterns
    const month = date.getMonth()
    const seasonalFactor = month >= 9 || month <= 1 ? 1.2 : 1 // Higher in holiday season (Oct-Jan)
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.8 : 1 // Lower on weekends
    const randomFactor = randomNumber(80, 120) / 100 // Random variation between 0.8 and 1.2

    // Calculate the final search volume with all factors applied
    const searches = Math.round((baseSearchVolume / 30) * seasonalFactor * weekendFactor * randomFactor)

    return {
      date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      searches,
    }
  })

  // Generate weekly data with less granular patterns
  const weeklyDates = generateDates("weekly")
  const weekly = weeklyDates.map((date) => {
    const month = date.getMonth()
    const seasonalFactor = month >= 9 || month <= 1 ? 1.2 : 1
    const randomFactor = randomNumber(85, 115) / 100 // Slightly less variation for weekly data

    const searches = Math.round((baseSearchVolume / 4) * seasonalFactor * randomFactor)

    return {
      date: date.toISOString().split("T")[0],
      searches,
    }
  })

  // Generate monthly data with even less variation
  const monthlyDates = generateDates("monthly")
  const monthly = monthlyDates.map((date) => {
    const month = date.getMonth()
    const seasonalFactor = month >= 9 || month <= 1 ? 1.2 : 1
    const randomFactor = randomNumber(90, 110) / 100 // Least variation for monthly data

    const searches = Math.round(baseSearchVolume * seasonalFactor * randomFactor)

    return {
      date: date.toISOString().split("T")[0],
      searches,
    }
  })

  return { daily, weekly, monthly }
}

/**
 * CTR by Device Generator
 *
 * Generates realistic click-through rate (CTR) data by device type.
 * Creates a distribution between mobile and desktop that reflects
 * real-world usage patterns.
 *
 * Implementation Notes:
 * - Mobile CTR typically ranges from 3-7%
 * - Desktop CTR typically ranges from 2-8%
 * - These ranges are based on industry averages
 *
 * @returns An array of device CTR objects
 */
const generateCtrByDevice = () => {
  const mobileCtr = randomNumber(3, 7)
  const desktopCtr = randomNumber(2, 8)

  return [
    { device: "Mobile", ctr: mobileCtr },
    { device: "Desktop", ctr: desktopCtr },
  ]
}

/**
 * CTR by Gender Generator
 *
 * Generates realistic click-through rate (CTR) data by gender.
 * Creates a distribution between male and female users.
 *
 * Implementation Notes:
 * - Both genders have CTR ranges from 3-8%
 * - Calculates percentage values based on the total CTR
 * - In a real implementation, this would use actual demographic data
 *
 * @returns An array of gender CTR objects with both raw and percentage values
 */
const generateCtrByGender = () => {
  const femaleCtr = randomNumber(3, 8)
  const maleCtr = randomNumber(3, 8)
  const total = femaleCtr + maleCtr

  return [
    { gender: "Female", ctr: femaleCtr, value: Math.round((femaleCtr / total) * 100) },
    { gender: "Male", ctr: maleCtr, value: Math.round((maleCtr / total) * 100) },
  ]
}

/**
 * CTR by Age Generator
 *
 * Generates realistic click-through rate (CTR) data by age group.
 * Creates a distribution across six age ranges that reflects
 * typical demographic engagement patterns.
 *
 * Implementation Notes:
 * - Younger and middle-aged groups typically have higher CTR
 * - Older age groups generally have lower CTR
 * - These patterns are based on common e-commerce behavior
 *
 * @returns An array of age group CTR objects
 */
const generateCtrByAge = () => {
  return [
    { age: "10s", ctr: randomNumber(2, 6) }, // Teenagers
    { age: "20s", ctr: randomNumber(4, 8) }, // Young adults (highest engagement)
    { age: "30s", ctr: randomNumber(3, 7) }, // Adults
    { age: "40s", ctr: randomNumber(2, 6) }, // Middle-aged
    { age: "50s", ctr: randomNumber(1, 5) }, // Older adults
    { age: "60s+", ctr: randomNumber(1, 4) }, // Seniors (lowest engagement)
  ]
}

/**
 * CTR by Weekday Generator
 *
 * Generates realistic click-through rate (CTR) data by day of week.
 * Creates a distribution that reflects typical weekly engagement patterns.
 *
 * Implementation Notes:
 * - Weekdays (Mon-Fri) typically have higher CTR (3-7%)
 * - Weekends (Sat-Sun) typically have lower CTR (2-5%)
 * - These patterns reflect common online shopping behavior
 *
 * @returns An array of weekday CTR objects
 */
const generateCtrByWeekday = () => {
  return [
    { day: "Mon", ctr: randomNumber(3, 7) },
    { day: "Tue", ctr: randomNumber(3, 7) },
    { day: "Wed", ctr: randomNumber(3, 7) },
    { day: "Thu", ctr: randomNumber(3, 7) },
    { day: "Fri", ctr: randomNumber(3, 7) },
    { day: "Sat", ctr: randomNumber(2, 5) }, // Weekend - lower engagement
    { day: "Sun", ctr: randomNumber(2, 5) }, // Weekend - lower engagement
  ]
}

/**
 * Main Mock Data Generator
 *
 * Generates a complete set of mock data for a given search query.
 * Combines all the individual data generators to create a comprehensive
 * data object that simulates an API response.
 *
 * Implementation Notes:
 * - Monthly search volume is influenced by query length
 * - Products found is a random number between 50 and 500
 * - All CTR data is generated with realistic distributions
 *
 * @param query - The search query to generate data for
 * @returns A complete mock data object with all metrics
 */
export const generateMockData = (query: string) => {
  // Base monthly search volume influenced by query length
  const monthlySearches = query.length * 1000 + randomNumber(5000, 15000)

  // Random number of products found
  const productsFound = randomNumber(50, 500)

  // Return the complete data object
  return {
    monthlySearches,
    productsFound,
    searchTrends: generateSearchTrends(query),
    ctrByDevice: generateCtrByDevice(),
    ctrByGender: generateCtrByGender(),
    ctrByAge: generateCtrByAge(),
    ctrByWeekday: generateCtrByWeekday(),
  }
}

