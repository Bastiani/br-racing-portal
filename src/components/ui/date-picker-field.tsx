"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"

interface DatePickerFieldProps {
  id?: string
  label: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  className,
}: DatePickerFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}{required && ' *'}</Label>
      <DatePicker
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </div>
  )
}