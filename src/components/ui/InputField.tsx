import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputFieldVariants> {
  label: string
  icon?: IconType
  error?: string
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, variant, label, icon: Icon, error, ...props }, ref) => {
    return (
      <div className={cn(inputFieldVariants({ variant }))}>
        <Label htmlFor={props.id}>{label}</Label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          )}
          <Input
            ref={ref}
            className={cn(
              Icon && "pl-10",
              error && "border-destructive",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
InputField.displayName = "InputField"

export { InputField }