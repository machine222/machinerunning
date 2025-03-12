"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export const DatePicker = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof Calendar>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <Calendar ref={ref} className={className} {...props} />
      </div>
    )
  },
)
DatePicker.displayName = "DatePicker"

