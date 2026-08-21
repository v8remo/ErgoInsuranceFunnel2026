import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill border-2 border-transparent text-base font-bold tracking-[0.5px] ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-ergo-red bg-ergo-red text-white hover:border-ergo-red-hover hover:bg-ergo-red-hover",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-ergo-red bg-transparent text-ergo-red hover:bg-ergo-red hover:text-white",
        secondary:
          "border-ergo-stone bg-transparent text-ergo-stone hover:bg-ergo-stone hover:text-white",
        ghost:
          "rounded-lg border-transparent font-semibold tracking-normal hover:bg-ergo-red-light hover:text-ergo-red",
        link: "text-ergo-red underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-12 px-6 py-1",
        sm: "min-h-10 px-5 py-px text-sm [&_svg]:size-4",
        lg: "min-h-12 px-8 py-1",
        icon: "h-10 w-10 rounded-lg [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
