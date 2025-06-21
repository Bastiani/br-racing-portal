import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { IconType } from 'react-icons'
import { cva, type VariantProps } from "class-variance-authority"

const inputFieldVariants = cva(
  "space-y-2",
  {
    variants: {
      variant: {
        default: "",
        profile: "space-y-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface FormInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputFieldVariants> {
  label: string
  icon?: IconType
}

const FormInputField = React.forwardRef<HTMLInputElement, FormInputFieldProps>(
  ({ className, variant, label, icon: Icon, ...props }, ref) => {
    return (
      <FormItem className={cn(inputFieldVariants({ variant }))}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            )}
            <Input
              ref={ref}
              className={cn(
                Icon && "pl-10",
                className
              )}
              {...props}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )
  }
)
FormInputField.displayName = "FormInputField"

export { FormInputField }