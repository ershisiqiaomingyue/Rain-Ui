import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-4 w-4" />,
        info: <Info className="h-4 w-4" />,
        warning: <TriangleAlert className="h-4 w-4" />,
        error: <OctagonX className="h-4 w-4" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border group-[.toaster]:border-border/80 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl text-xs",
          description: "group-[.toast]:text-muted-foreground text-[11px]",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:h-6 group-[.toast]:px-2",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:rounded-md group-[.toast]:h-6 group-[.toast]:px-2",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
