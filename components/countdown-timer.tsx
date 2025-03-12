"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center space-x-4 text-center">
      <div className="flex flex-col">
        <div className="text-3xl font-bold bg-blue-600 text-white rounded-md px-3 py-2 min-w-[60px]">
          {timeLeft.days.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Days</span>
      </div>
      <div className="flex flex-col">
        <div className="text-3xl font-bold bg-blue-600 text-white rounded-md px-3 py-2 min-w-[60px]">
          {timeLeft.hours.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Hours</span>
      </div>
      <div className="flex flex-col">
        <div className="text-3xl font-bold bg-blue-600 text-white rounded-md px-3 py-2 min-w-[60px]">
          {timeLeft.minutes.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Minutes</span>
      </div>
      <div className="flex flex-col">
        <div className="text-3xl font-bold bg-blue-600 text-white rounded-md px-3 py-2 min-w-[60px]">
          {timeLeft.seconds.toString().padStart(2, "0")}
        </div>
        <span className="text-sm mt-1">Seconds</span>
      </div>
    </div>
  )
}

