import { Button } from "./Button";
import { AppIcon } from "../../src/components/icons/AppIcon"

export function ToolBackButton({ onBack }: { onBack?: () => void }) {
  if (!onBack) return null;
  return <Button type="button" className="tool-page-back-button" variant="secondary" size="sm"
    icon={<AppIcon name="arrow-left" size={17} />} aria-label="返回主页" title="返回主页" onClick={onBack} />;
}
