import * as React from "react"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DatePicker } from "@/components/ui/date-picker"
import { cn } from "@/lib/utils"

interface FormDatePickerFieldProps {
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
  value?: string
  onChange?: (value: string) => void
}

export function FormDatePickerField({
  label,
  placeholder,
  disabled = false,
  className,
  value,
  onChange,
}: FormDatePickerFieldProps) {
  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <DatePicker
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}