"use client"

import * as React from "react"

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export interface SegmentedOption<T extends string> {
  value: T
  label: React.ReactNode
  disabled?: boolean
}

export interface SegmentedControlProps<T extends string> {
  value: T
  onChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  label: string
  className?: string
  /** 附加到每个分段项（TabsTrigger）上的类名。 */
  buttonClassName?: string
}

/**
 * 分段切换 = 基础组件 Tabs 的受控封装（不再自建一套按钮）。
 * 高 32px、圆角 10px、内容和 Button default 对齐。
 */
export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
  buttonClassName,
}: SegmentedControlProps<T>) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as T)}>
      <TabsList aria-label={label} className={className}>
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={buttonClassName}
          >
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
