"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "../../lib/utils"

type SwitchProps = Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>, "onChange"> & {
  /** Optional visible label. The legacy API renders it next to the control. */
  label?: React.ReactNode
  /** Legacy alias for Radix's onCheckedChange. */
  onChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, label, onChange, onCheckedChange, ...props }, ref) => {
    const control = (
      <SwitchPrimitives.Root
        className={cn(
          // 轨道/滑块的颜色必须是「勾选态」那一族 token：以前绑的是 data-[state=checked]:bg-primary
          // 和 bg-background —— --primary 是淡色按钮底、--background 是页面底色，两者都接近表面色，
          // 于是开着也和禁用一样灰。--switch-active-bg / --switch-thumb-bg / --control-unchecked-bg
          // 是库里为开关准备的（旧的 Kit 版开关 CSS 一直用的就是它们）。
          // 用任意值写法接 token，因为 tailwind preset 没有对应的颜色键名（同 badge / button 的做法）。
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          className
        )}
        onCheckedChange={onChange ?? onCheckedChange}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )}
        />
      </SwitchPrimitives.Root>
    )

    if (label === undefined) return control

    return (
      <label className="inline-flex items-center gap-2 text-xs">
        {control}
        <span>{label}</span>
      </label>
    )
  }
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
