import React from "react";
import { Spinner } from "./Spinner";
/**
 * StepSpinner —— TaskStepList（组件 07）运行态的加载图标：主色淡底圆 + 旋转弧线。
 * 弧线本体就是全站的 Spinner（同一个形状、同一份渐变尾巴），这里只补那层淡底圆，
 * 免得「步骤里转的」和「状态行里转的」长得不一样。
 */
export type StepSpinnerProps = {
  /** 外圈直径（默认 20，与任务步骤圆一致）。 */
  size?: number;
  label?: string;
};

export const StepSpinner: React.FC<StepSpinnerProps> = ({ size = 20, label }) => (
  <span
    className="ui-step-spinner"
    style={{ width: size, height: size }}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
  >
    <Spinner size={Math.max(8, Math.round(size * 0.68))} strokeWidth={2.4} />
  </span>
);

export default StepSpinner;
