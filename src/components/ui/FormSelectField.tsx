import * as React from "react"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface FormSelectFieldProps {
  label: string
  placeholder?: string
  disabled?: boolean
  className?: string
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
}

export function FormSelectField({
  label,
  placeholder,
  disabled = false,
  className,
  options,
  value,
  onValueChange,
}: FormSelectFieldProps) {
  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )
}