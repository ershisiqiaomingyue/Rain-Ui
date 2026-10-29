import React, { useEffect } from "react";
import brandIcon from "../../assets/brand-icon.svg";

export type BootScreenProps = {
  /**
   * 是否把 `boot-mode` 挂到 <html> 上（隐藏滚动条、锁定视口）。
   * 用在应用根节点时保持默认 true；放进文档、画廊或任何可滚动页面里时要关掉，
   * 否则整页会被锁成 overflow:hidden —— 组件不该顺手改全局文档状态。
   */
  applyToDocument?: boolean;
};

export const BootScreen: React.FC<BootScreenProps> = ({ applyToDocument = true }) => {
  useEffect(() => {
    if (!applyToDocument) return;
    document.documentElement.classList.add("boot-mode");
    // Main-window Startup owns completion after its preload work settles.
    return () => document.documentElement.classList.remove("boot-mode");
  }, [applyToDocument]);

  return (
    <main className="boot-screen" role="status" aria-live="polite" aria-label="Android Toolkit 启动中">
      <span className="boot-orb" aria-hidden="true" />
      <section className="boot-content">
        <img className="boot-logo" src={brandIcon} width={84} height={84} alt="" aria-hidden="true" draggable={false} />
      </section>
    </main>
  );
};

export default BootScreen;