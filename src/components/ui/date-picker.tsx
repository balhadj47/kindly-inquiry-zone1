
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  id?: string;
  onSelect?: (date: Date | undefined) => void;
  defaultMonth?: Date;
  mode?: "single";
  className?: string;
  placeholder?: string;
  selected?: Date;
}

export function DatePicker({
  id,
  onSelect,
  defaultMonth,
  mode = "single",
  className,
  placeholder = "Pick a date",
  selected
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(selected || defaultMonth);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onSelect?.(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          defaultMonth={defaultMonth}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  )
}
