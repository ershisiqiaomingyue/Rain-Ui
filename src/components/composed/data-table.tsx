"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

export interface DataTableColumn<T> {
  /** 列的唯一标识（不是取值字段名，取值交给 render） */
  key: string
  /** 表头文字 */
  label: React.ReactNode
  /** 列内容 */
  render: (row: T, index: number) => React.ReactNode
  /** 数字列：右对齐 + 等宽数字（表格里数字不对齐最难读） */
  numeric?: boolean
  /** 单元格附加 class */
  className?: string
  /** 表头附加 class */
  headClassName?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  /** 行 key，用业务主键，不要用下标 */
  rowKey: (row: T, index: number) => string
  /** 紧凑模式：行高再压一档 */
  dense?: boolean
  /** 无数据时的占位（会横跨整行居中） */
  empty?: React.ReactNode
  /** 表格上方的说明行 */
  caption?: React.ReactNode
  className?: string
  /** 滚动容器；列多时横向滚动而不是把文字挤断 */
  containerClassName?: string
}

/**
 * 数据表：columns 驱动的只读表格。
 *
 * 为什么不直接用 `<table>`：消费方（设置页、统计页、工具列表）反复要
 * 「表头 11px 灰、正文 12.5px、数字右对齐等宽、行间一条 hairline」这几件事，
 * 每处手写一遍必然走形。数字列统一 `numeric` 即可，不需要再记 class。
 *
 * 这里刻意只做展示层：排序/分页/选择都留在调用方，
 * 免得设计系统替业务做决定。
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  dense = false,
  empty,
  caption,
  className,
  containerClassName,
}: DataTableProps<T>) {
  const cellPadding = dense ? "py-1" : "py-1.5"

  return (
    <div data-slot="data-table" className={cn("w-full", containerClassName)}>
      {caption ? (
        <div className="mb-1.5 text-[11px] leading-[1.4] text-muted-foreground">{caption}</div>
      ) : null}
      <div className="w-full overflow-x-auto">
        <table
          className={cn(
            "w-full border-collapse text-[12.5px] leading-[1.45]",
            "[&>tbody>tr>td:last-child]:pr-0 [&>thead>tr>th:last-child]:pr-0",
            className,
          )}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "whitespace-nowrap px-0 pb-1.5 pr-3 text-left text-[11px] font-medium text-muted-foreground",
                    column.numeric && "text-right",
                    column.headClassName,
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && empty ? (
              <tr>
                <td colSpan={columns.length} className="px-0 py-6 text-center text-[12px] text-muted-foreground">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={rowKey(row, index)} className="border-t border-border/60">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-0 pr-3 align-middle text-foreground",
                        cellPadding,
                        column.numeric && "text-right tabular-nums",
                        column.className,
                      )}
                    >
                      {column.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
