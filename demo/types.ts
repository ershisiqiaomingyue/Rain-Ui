export type DemoSection = {
  id: string;
  title: string;
  note?: string;
  group: "foundation" | "form" | "layout" | "feedback" | "chat" | "app";
  render: () => React.ReactNode;
};
