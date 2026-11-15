"use client"

import type { HTMLAttributes } from "react"
import { AppIcon } from "./AppIcon"
import { cn } from "../../lib/utils"
import { IMAGE_MARKS, type ProviderMarkId } from "./provider-marks"

/* -- Provider Logo ------------------------------------------------------------
 * 模型服务商品牌标：20px 上下，回答「这是谁的模型」——一个词标在这件事上很差
 * （Anthropic 和 OpenAI 是一排里最长的字符串），一枚 20px 的彩标先于名字被认出。
 *
 * 十枚标全部来自 Android-Toolkit（rust-module）Settings → Agent 实际在用的资产，
 * base64 内联（provider-marks.ts）：运行时零请求、零依赖，那边换资产重新生成即可。
 *
 * 单色品牌（OpenAI）按 Android-Toolkit 的画法走「蒙版 + 墨色底」：图形本身当
 * mask，底色取 currentColor —— 深色主题浅墨、浅色主题深墨，自动跟随主题。
 * 彩色标忽略 className 的颜色（品牌自己的颜色就是它的信息），只跟随尺寸。
 *
 * provider 也接受任意字符串（选择器里的自定义服务商）：「custom」画一枚
 * AI 星芒块（sparkles，primary 色），其它未知值画「首字母块」（muted 底 +
 * primary 字）—— 原来这套兜底在宿主的 ProviderIcon 里，组件上收进库后由这里负责。
 *
 * 全部 aria-hidden：标永远和模型名字并排出现，读屏读一遍名字就够。
 * --------------------------------------------------------------------------- */

export type ProviderId = ProviderMarkId

/** What each provider is called in a sentence, for a line a mark cannot carry. */
export const PROVIDER_NAMES: Record<ProviderId, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  deepseek: "DeepSeek",
  kimi: "Kimi",
  glm: "GLM",
  qwen: "Qwen",
  mimo: "MiMo",
  gemini: "Gemini",
  grok: "Grok",
  workbuddy: "WorkBuddy",
}

export interface ProviderLogoProps extends HTMLAttributes<HTMLElement> {
  /** 已知品牌走内联标；"custom" 画齿轮块；其它未知值画首字母块。 */
  provider: ProviderId | (string & {})
  /** 数字尺寸（px）。不给时走 className 里的尺寸档（默认 size-5）。 */
  size?: number
}

/**
 * A provider's mark at 20px. Decorative — the model name sits next to it — and
 * overridable by whatever is spread in last (size via className or `size` prop).
 */
export const ProviderLogo = ({
  className,
  provider,
  size,
  style,
  ...props
}: ProviderLogoProps) => {
  const mark = IMAGE_MARKS[provider as ProviderMarkId]
  const dim = size ? { width: size, height: size, flex: `0 0 ${size}px` } : undefined

  // 单色品牌：图形当蒙版，底色跟文字（currentColor），主题换它跟着换。
  if (mark?.monochrome) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block size-5 shrink-0 bg-current", className)}
        style={{
          maskImage: `url("${mark.src}")`,
          WebkitMaskImage: `url("${mark.src}")`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          ...dim,
          ...style,
        }}
        {...props}
      />
    )
  }

  // 彩色品牌：位图/矢量原样画。
  if (mark) {
    return (
      <img
        src={mark.src}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={cn("inline-block size-5 shrink-0 object-contain", className)}
        style={{ ...dim, ...style }}
        {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    )
  }

  // 兜底块：自定义服务商画 AI 星芒（sparkles，primary 色），未知品牌画首字母。
  // 底色和圆角只落在兜底块自己身上；星芒随块缩放（约 65%，太小糊、太大顶格）。
  const isCustom = !provider || provider === "custom"
  const tile = size ?? 20
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-muted",
        className
      )}
      style={{
        color: "hsl(var(--primary))",
        fontSize: "var(--fs-micro)",
        fontWeight: "var(--fw-title)",
        overflow: "hidden",
        ...dim,
        ...style,
      }}
      {...props}
    >
      {isCustom ? (
        <AppIcon name="sparkles" size={Math.max(10, Math.round(tile * 0.65))} />
      ) : (
        provider.slice(0, 1).toUpperCase()
      )}
    </span>
  )
}
