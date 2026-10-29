import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Moon, Search, Sun } from "lucide-react";
import { readAppTheme, setAppTheme, type AppTheme } from "rain-ui";
import { SECTIONS } from "./sections";

const GROUP_LABEL: Record<string, string> = {
  foundation: "基础",
  form: "表单",
  layout: "布局",
  feedback: "反馈",
  chat: "对话",
  app: "应用级",
};

export function App() {
  const [theme, setTheme] = useState<AppTheme>(() => readAppTheme());
  const [active, setActive] = useState(SECTIONS[0].id);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setAppTheme(theme);
  }, [theme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(q) || (s.note ?? "").toLowerCase().includes(q) || s.id.includes(q)
    );
  }, [query]);

  // 搜索结果是唯一会改变目录长度的东西：目录和正文都只用 filtered，
  // 以前那个「分组 chip」筛选会让目录少一半、正文少一半，两处状态容易不同步。
  const visible = filtered;

  const groups = useMemo(() => {
    const map = new Map<string, typeof SECTIONS>();
    for (const s of visible) {
      const list = map.get(s.group) ?? [];
      list.push(s);
      map.set(s.group, list);
    }
    return [...map.entries()];
  }, [visible]);


  // 搜索后当前项可能不在结果里：自动落到第一条可见项，避免右侧空白。
  const activeInView = visible.some((section) => section.id === active);
  const currentId = activeInView ? active : visible[0]?.id;
  const currentIndex = visible.findIndex((section) => section.id === currentId);
  const current = visible[currentIndex];

  // 切页后主内容区回到顶部：从长页切到短页时，否则会停在上一个页面的滚动位置。
  useEffect(() => {
    const main = document.querySelector(".demo-main");
    if (main instanceof HTMLElement) main.scrollTo({ top: 0, behavior: "auto" });
  }, [currentId]);

  const jump = (id: string) => setActive(id);
  const step = (delta: number) => {
    const next = visible[currentIndex + delta];
    if (next) setActive(next.id);
  };

  return (
    <div className="demo-shell">
      <aside className="demo-nav">
        <div className="demo-brand">
          <span className="demo-brand-mark" />
          <div>
            <strong>rain-ui</strong>
            <small>组件库 · {SECTIONS.length} 件</small>
          </div>
        </div>

        <label className="demo-search">
          <Search size={13} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索组件" />
        </label>

        {/* 目录只保留一层分组：分组标题 + 条目。以前这里还有一排「全部/基础/表单…」
            的分组 chip，和下面竖排目录的分组标题是同一份信息，同一列里出现两次，
            而且 chip 的选中态（深底）和条目的选中态（中性底）互相抢高亮。 */}
        <nav className="demo-nav-list" aria-label="组件索引">

          {/* 组件目录：按组全列，点击直达锚点 */}
          {groups.map(([groupKey, list]) => (
            <div className="demo-nav-group" key={groupKey}>
              <span className="demo-nav-group-label">{GROUP_LABEL[groupKey]}</span>
              {list.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={section.id === currentId ? "demo-nav-item is-active" : "demo-nav-item"}
                  onClick={() => jump(section.id)}
                >
                  {section.title}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="demo-nav-foot">
          <button
            type="button"
            className="demo-theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            {theme === "dark" ? "切到亮色" : "切到暗色"}
          </button>
        </div>
      </aside>

      <main className="demo-main">
        {current ? (
          <div className="demo-page" key={current.id}>
            <header className="demo-page-head">
              <div className="demo-page-crumb">
                <span className="demo-page-group">{GROUP_LABEL[current.group]}</span>
                <span className="demo-page-sep">/</span>
                <span className="demo-page-index">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
                </span>
              </div>
              <h1>{current.title}</h1>
              {current.note ? <p>{current.note}</p> : null}
            </header>

            <div className="demo-block-body">{current.render()}</div>

            <nav className="demo-pager" aria-label="组件翻页">
              <button
                type="button"
                className="demo-pager-btn"
                onClick={() => step(-1)}
                disabled={currentIndex <= 0}
              >
                <ChevronLeft size={15} />
                <span>{visible[currentIndex - 1]?.title ?? "已是第一个"}</span>
              </button>
              <button
                type="button"
                className="demo-pager-btn is-next"
                onClick={() => step(1)}
                disabled={currentIndex >= visible.length - 1}
              >
                <span>{visible[currentIndex + 1]?.title ?? "已是最后一个"}</span>
                <ChevronRight size={15} />
              </button>
            </nav>
          </div>
        ) : (
          <div className="demo-empty">
            <p>没有匹配「{query}」的组件。</p>
            <button type="button" className="demo-pager-btn" onClick={() => setQuery("")}>
              清除搜索
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
