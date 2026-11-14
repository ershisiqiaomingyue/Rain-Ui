"use client"

import type { HTMLAttributes } from "react"
import { cn } from "../../lib/utils"
import { IMAGE_MARKS, type ProviderMarkId } from "./provider-marks"

/* -- Provider Logo ------------------------------------------------------------
 * 模型服务商品牌标：20px 上下，回答「这是谁的模型」——一个词标在这件事上很差
 * （Anthropic 和 OpenAI 是一排里最长的字符串），一枚 20px 的彩标先于名字被认出。
 *
 * 十五枚标全部来自 Android-Toolkit（rust-module）Settings → Agent 实际在用的资产
 * （九家服务商 + WorkBuddy 本尊与五个模型变体），base64 内联（provider-marks.ts）：
 * 运行时零请求、零依赖，那边换资产重新生成即可。
 *
 * 单色品牌（OpenAI / DeepSeek / WorkBuddy 的五个模型变体）按 Android-Toolkit 的画法
 * 走「蒙版 + 墨色底」：图形本身当 mask，底色取 --foreground —— 深色主题浅墨、
 * 浅色主题深墨，自动跟随主题。彩色标忽略 className 的颜色（品牌自己的颜色就是它的
 * 信息），只跟随尺寸。
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
  provider: ProviderId
}

/**
 * A provider's mark at 20px. Decorative — the model name sits next to it — and
 * overridable by whatever is spread in last (size via className, e.g. `size-4`).
 */
export const ProviderLogo = ({
  className,
  provider,
  style,
  ...props
}: ProviderLogoProps) => {
  const mark = IMAGE_MARKS[provider]

  if (mark.monochrome) {
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
          ...style,
        }}
        {...props}
      />
    )
  }

  return (
    <img
      src={mark.src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn("inline-block size-5 shrink-0 object-contain", className)}
      style={style}
      {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
    />
  )
}
