import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-2xl",
  {
    variants: {
      variant: {
        default: "text-white shadow-xl border-2 border-transparent hover:shadow-3xl",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xl",
        outline:
          "border-2 border-primary/20 bg-white text-primary hover:bg-primary/5 hover:text-primary shadow-lg",
        secondary:
          "text-foreground shadow-xl hover:shadow-2xl",
        ghost: "hover:bg-primary/10 hover:text-primary rounded-2xl",
        link: "text-primary underline-offset-4 hover:underline font-semibold",
        floating: "bg-white/95 backdrop-blur-md text-primary border-2 border-primary/10 shadow-2xl hover:bg-primary hover:text-white",
        gradient: "text-white shadow-2xl border-2 border-transparent hover:shadow-3xl",
      },
      size: {
        default: "h-12 px-6 py-3 text-base",
        sm: "h-10 rounded-xl px-4 text-sm",
        lg: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-12 w-12 rounded-2xl",
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
