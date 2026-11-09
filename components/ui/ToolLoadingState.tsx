import React from "react";
import { Spinner } from "./Spinner";

/**
 * ToolLoadingState
 * ---------------------------------------------------------------------------
 * 整块等待态：一颗居中的 Spinner + 一句「在等什么」，占住它马上要被填满的那块区域。
 * 它和 ToolEmptyState 是一对——空态说「这里现在没东西」，等待态说「这里马上有东西」，
 * 所以两者共用同一套内边距、字号和居中方式，数据到位时画面不跳。
 *
 * 为什么要收成一个组件：以前「正在读取…」常被直接写成一行为文本节点，于是它按文档流
 * 落在容器的左上角，右边大半块空白，看着像漏渲染、也像卡住了。骨架屏负责形状已知的
 * 首屏（见 HomePanel 那种对着真实卡片的骨架），形状未知或只需要一句话时用这个。
 */
export const ToolLoadingState: React.FC<{
  /** 一句话说明在等什么，例如「正在读取插件…」。 */
  title: string;
  /** 可选第二句：等的是哪一份数据、要不要先做别的。 */
  description?: string;
  /** 贴在工具栏/列表头下方的一行：左对齐、不占高度。 */
  compact?: boolean;
  /** 占满所在区域并垂直居中：用于整页 / 整面板的首次渲染（父级要有确定高度）。 */
  fill?: boolean;
}> = ({ title, description, compact, fill }) => (
  <div
    className={`tool-loading-state${compact ? " compact" : ""}${fill ? " fill" : ""}`}
    role="status"
    aria-live="polite"
  >
    {/* 旁边就有可见文案，这颗旋转图形对读屏是装饰，不传 label */}
    <Spinner size={compact ? 13 : 16} />
    <div className="tool-loading-copy">
      <span className="tool-loading-title">{title}</span>
      {description && <p>{description}</p>}
    </div>
  </div>
);

export default ToolLoadingState;
