"use client";

import * as React from "react";

import { dataToneClasses, dataToneFor, type DataTone } from "../../lib/tone";
import { cn } from "../../lib/utils";
import "./constellation.css";

/**
 * 星图：一堆节点按归属聚成星簇，用固定种子算出布局，画成一片夜空。
 *
 * 为什么不用力导向布局：主页这种地方每次打开都得长得一样，用户才记得住
 * 「那条在右上角」。所以所有坐标都来自 `seed + id` 的稳定哈希，同一个
 * 数据集画多少次都重叠；换数据集才换形状。
 */
export interface ConstellationNode {
  id: string;
  label: string;
  /** 归属（工作区 / 会话 / 标签）：同组同色、聚成一簇。 */
  group?: string;
  /** 0.1–1：决定节点半径与是否显示文字。 */
  weight?: number;
}

/**
 * 两个节点之间的关联（共用标签、同会话等），由调用方算好强度。
 * 星图只负责画：怎么算「有关联」是业务侧的事，不同数据源算法不一样。
 */
export interface ConstellationLink {
  source: string;
  target: string;
  /** 0.1–1：越强线越粗越实。缺省 0.5。 */
  weight?: number;
}

export interface ConstellationProps {
  nodes: ConstellationNode[];
  /** 额外画的关联连线（跨簇）：不传就只有簇内结构线。 */
  links?: ConstellationLink[];
  /** 最多画多少个节点（按 weight 取前 N）。默认 120。 */
  limit?: number;
  /** 固定色；不给就按 `group` 稳定取色。 */
  tone?: DataTone;
  /** 布局种子，默认取节点 id 拼串。 */
  seed?: string;
  activeId?: string | null;
  onSelect?: (node: ConstellationNode) => void;
  showLabels?: boolean;
  height?: number;
  emptyHint?: React.ReactNode;
  className?: string;
}

/** 画布坐标：宽 100、高 60，配合 `viewBox` 自适应任意尺寸。 */
const VIEW_WIDTH = 100;
const VIEW_HEIGHT = 60;
const MAX_EDGES = 300;
const MAX_LINK_EDGES = 160;
const DEFAULT_LIMIT = 120;
/** 背景微星数量：太少像噪点，太多像沙尘。 */
const SKY_STAR_COUNT = 120;
/** 最多给几颗星标文字：全标会糊成一团（星图里标签本来就是次要信息）。 */
const MAX_LABELS = 14;

function hashString(input: string): number {
  let hash = 2_166_136_261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }
  return hash >>> 0;
}

function unit(seed: number): number {
  // xorshift32：同一 seed 永远同一个数，且分布够散。
  let value = seed || 1;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return (value >>> 0) / 4_294_967_296;
}

interface PlacedNode extends ConstellationNode {
  x: number;
  y: number;
  radius: number;
  tone: DataTone;
  groupKey: string;
}

/** 夜空里的背景微星：位置同样只取决于种子，刷新不会「重新下雪」。 */
interface SkyStar {
  /** 百分比坐标（相对容器），与 SVG 的 viewBox 无关，这样夜空能铺满整个面板。 */
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  twinkle: boolean;
}

function buildSkyStars(seed: string): SkyStar[] {
  const stars: SkyStar[] = [];
  for (let index = 0; index < SKY_STAR_COUNT; index += 1) {
    const base = hashString(`${seed}#sky#${index}`);
    stars.push({
      x: unit(base ^ 0x5bf03635) * 100,
      y: unit(base ^ 0x27d4eb2f) * 100,
      size: 1 + unit(base ^ 0x165667b1) * 1.8,
      opacity: 0.16 + unit(base ^ 0x9e3779b1) * 0.52,
      delay: unit(base ^ 0x85ebca6b) * 4.4,
      twinkle: index % 3 === 0,
    });
  }
  return stars;
}

interface PlacedEdge {
  id: string;
  from: PlacedNode;
  to: PlacedNode;
  tone: DataTone;
  /** spine：簇内结构线；link：调用方按业务算法给的关联线。 */
  kind: "spine" | "link";
  weight: number;
}

interface ConstellationLayout {
  nodes: PlacedNode[];
  edges: PlacedEdge[];
  clusters: { key: string; tone: DataTone; cx: number; cy: number; rx: number; ry: number }[];
  hidden: number;
}

function buildLayout(
  nodes: ConstellationNode[],
  limit: number,
  seed: string | undefined,
  tone: DataTone | undefined,
  links: ConstellationLink[] | undefined,
): ConstellationLayout {
  const sorted = [...nodes].sort(
    (left, right) =>
      (right.weight ?? 0.5) - (left.weight ?? 0.5) || left.id.localeCompare(right.id),
  );
  const kept = sorted.slice(0, Math.max(0, limit));
  const hidden = nodes.length - kept.length;
  if (kept.length === 0) {
    return { nodes: [], edges: [], clusters: [], hidden };
  }

  // 按组聚簇：组名排序后固定落在椭圆上，组内再按黄金角铺开。
  const groupKeys = Array.from(
    new Set(kept.map((node) => node.group?.trim() || "未分组")),
  ).sort((left, right) => left.localeCompare(right));
  const groupIndex = new Map(groupKeys.map((key, index) => [key, index]));
  const clusterCount = groupKeys.length;
  const centroids = groupKeys.map((key, index) => {
    if (clusterCount === 1) {
      return { cx: VIEW_WIDTH / 2, cy: VIEW_HEIGHT / 2 };
    }
    const angle = (index / clusterCount) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: VIEW_WIDTH / 2 + Math.cos(angle) * (VIEW_WIDTH * 0.27),
      cy: VIEW_HEIGHT / 2 + Math.sin(angle) * (VIEW_HEIGHT * 0.3),
    };
  });

  const placed: PlacedNode[] = [];
  const perGroup = new Map<string, number>();
  for (const node of kept) {
    const groupKey = node.group?.trim() || "未分组";
    const index = groupIndex.get(groupKey) ?? 0;
    const position = perGroup.get(groupKey) ?? 0;
    perGroup.set(groupKey, position + 1);
    const members = kept.filter((item) => (item.group?.trim() || "未分组") === groupKey).length;
    const base = hashString(`${seed ?? ""}|${node.id}`);
    const spread = members <= 1 ? 0 : Math.min(18, 5 + Math.sqrt(members) * 3.4);
    const angle = position * 2.399_963_2 + unit(base) * 0.6;
    const distance = spread * Math.sqrt((position + 0.7) / Math.max(members, 1));
    const jitter = (unit(base >>> 3) - 0.5) * 2.4;
    placed.push({
      ...node,
      groupKey,
      tone: tone ?? dataToneFor(groupKey),
      x: (centroids[index]?.cx ?? VIEW_WIDTH / 2) + Math.cos(angle) * distance + jitter,
      y: (centroids[index]?.cy ?? VIEW_HEIGHT / 2) + Math.sin(angle) * distance + jitter,
      radius: 1.1 + Math.max(0, Math.min(1, node.weight ?? 0.5)) * 2.5,
    });
  }

  // 连线：每簇内部按权重最高的节点当恒星，其余连到它；小簇再串成星座。
  const edges: PlacedEdge[] = [];
  for (const groupKey of groupKeys) {
    const members = placed
      .filter((node) => node.groupKey === groupKey)
      .sort((left, right) => (right.weight ?? 0.5) - (left.weight ?? 0.5));
    const hub = members[0];
    if (!hub) continue;
    for (const member of members.slice(1)) {
      if (edges.length >= MAX_EDGES) break;
      edges.push({
        id: `${hub.id}->${member.id}`,
        from: hub,
        to: member,
        tone: member.tone,
        kind: "spine",
        weight: 0.5,
      });
    }
    if (members.length <= 6) {
      for (let index = 0; index < members.length; index += 1) {
        const from = members[index];
        const to = members[(index + 1) % members.length];
        if (!from || !to || from === to || edges.length >= MAX_EDGES) continue;
        if (edges.some((edge) => edge.from === from && edge.to === to)) continue;
        edges.push({
          id: `${from.id}~${to.id}`,
          from,
          to,
          tone: from.tone,
          kind: "spine",
          weight: 0.5,
        });
      }
    }
  }

  // 关联线：调用方算好的跨簇关系（知识库那边按「共用标签数」得权重）。它画得比
  // 结构线更实、更粗一档，否则会淹没在簇内的放射线里。
  if (links && links.length > 0) {
    const byId = new Map(placed.map((node) => [node.id, node]));
    const seen = new Set(edges.map((edge) => `${edge.from.id}|${edge.to.id}`));
    let added = 0;
    const ranked = [...links].sort((left, right) => (right.weight ?? 0.5) - (left.weight ?? 0.5));
    for (const link of ranked) {
      if (added >= MAX_LINK_EDGES) break;
      const from = byId.get(link.source);
      const to = byId.get(link.target);
      if (!from || !to || from === to) continue;
      const key = `${from.id}|${to.id}`;
      if (seen.has(key) || seen.has(`${to.id}|${from.id}`)) continue;
      seen.add(key);
      added += 1;
      edges.push({
        id: `link:${key}`,
        from,
        to,
        tone: from.tone,
        kind: "link",
        weight: Math.max(0.15, Math.min(1, link.weight ?? 0.5)),
      });
    }
  }

  const clusters = groupKeys.map((key, index) => {
    const members = placed.filter((node) => node.groupKey === key);
    const center = centroids[index] ?? { cx: VIEW_WIDTH / 2, cy: VIEW_HEIGHT / 2 };
    let rx = 6;
    let ry = 5;
    for (const member of members) {
      rx = Math.max(rx, Math.abs(member.x - center.cx) + 3.2);
      ry = Math.max(ry, Math.abs(member.y - center.cy) + 3.2);
    }
    return {
      key,
      tone: tone ?? dataToneFor(key),
      cx: center.cx,
      cy: center.cy,
      rx: Math.min(rx, VIEW_WIDTH / 2.1),
      ry: Math.min(ry, VIEW_HEIGHT / 2.1),
    };
  });

  return { nodes: placed, edges, clusters, hidden };
}

export function Constellation({
  nodes,
  links,
  limit = DEFAULT_LIMIT,
  tone,
  seed,
  activeId,
  onSelect,
  showLabels = true,
  height = 220,
  emptyHint,
  className,
}: ConstellationProps) {
  const layout = React.useMemo(
    () => buildLayout(nodes, limit, seed, tone, links),
    [nodes, limit, seed, tone, links],
  );
  // 渐变 id 必须唯一：同页两张星图共用 id 时，后一张的星云会串到前一张上。
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const skyStars = React.useMemo(() => buildSkyStars(seed ?? "sky"), [seed]);
  // 文字只给最亮的几颗（加上当前选中项）：全标会糊成一团，星图里标签本来就次要。
  const labelIds = React.useMemo(() => {
    const ids = new Set(
      [...layout.nodes]
        .sort((left, right) => (right.weight ?? 0.5) - (left.weight ?? 0.5))
        .slice(0, MAX_LABELS)
        .map((node) => node.id),
    );
    if (activeId) ids.add(activeId);
    return ids;
  }, [layout.nodes, activeId]);

  const sky = (
    <>
      <div aria-hidden className="constellation-sky absolute inset-0" />
      <div aria-hidden className="absolute inset-0">
        {skyStars.map((star, index) => (
          <span
            key={`sky-${index}`}
            className={
              star.twinkle
                ? "constellation-sky-star constellation-sky-star--twinkle"
                : "constellation-sky-star"
            }
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );

  if (layout.nodes.length === 0) {
    return (
      <div
        data-slot="constellation"
        className={cn(
          "relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 text-[12px] text-white/45",
          className,
        )}
        style={{ height }}
      >
        {sky}
        <span className="relative">{emptyHint ?? "还没有星点"}</span>
      </div>
    );
  }

  return (
    <div
      data-slot="constellation"
      className={cn("relative w-full overflow-hidden rounded-xl border border-white/10", className)}
      style={{ height }}
    >
      {sky}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={`知识点星图，共 ${layout.nodes.length} 个星点${
          layout.hidden > 0 ? `（另有 ${layout.hidden} 个未显示）` : ""
        }`}
        className="relative h-full w-full select-none"
      >
        <defs>
          {layout.clusters.map((cluster, index) => (
            <radialGradient
              key={`nebula-${cluster.key}`}
              id={`${uid}-nebula-${index}`}
              className={dataToneClasses(cluster.tone).glow}
            >
              <stop offset="0%" stopColor="currentColor" stopOpacity={0.26} />
              <stop offset="55%" stopColor="currentColor" stopOpacity={0.08} />
              <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
            </radialGradient>
          ))}
        </defs>
        {/* 星云：代替原来的虚线椭圆。簇的边界不画死，才像星空而不是气泡图。 */}
        {layout.clusters.map((cluster, index) => (
          <ellipse
            key={`cluster-${cluster.key}`}
            cx={cluster.cx}
            cy={cluster.cy}
            rx={cluster.rx * 2}
            ry={cluster.ry * 2}
            fill={`url(#${uid}-nebula-${index})`}
          />
        ))}
        {layout.edges.map((edge) => (
          <line
            key={edge.id}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            strokeWidth={edge.kind === "link" ? 0.16 + edge.weight * 0.3 : 0.1}
            strokeOpacity={edge.kind === "link" ? 0.32 + edge.weight * 0.46 : 0.16}
            className={cn("stroke-current", dataToneClasses(edge.tone).glow)}
          />
        ))}
        {layout.nodes.map((node) => {
          const active = node.id === activeId;
          return (
            <g
              key={node.id}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={node.label}
              onClick={onSelect ? () => onSelect(node) : undefined}
              onKeyDown={
                onSelect
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSelect(node);
                      }
                    }
                  : undefined
              }
              className={cn(
                "transition-[filter] duration-200",
                active ? "brightness-125" : "hover:brightness-150 focus-visible:brightness-150",
                dataToneClasses(node.tone).glow,
                onSelect && "cursor-pointer focus:outline-none",
              )}
            >
              <title>{node.label}</title>
              {/* 光晕 → 星核 → 亮芯：三层就够像一颗星；高斯模糊在几十个节点上会掉帧。 */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * 2.6}
                fill="currentColor"
                fillOpacity={active ? 0.3 : 0.16}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * 1.3}
                fill="currentColor"
                fillOpacity={active ? 0.5 : 0.28}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius * (active ? 1 : 0.86)}
                fill="currentColor"
              />
              <circle
                cx={node.x - node.radius * 0.26}
                cy={node.y - node.radius * 0.26}
                r={Math.max(0.28, node.radius * 0.3)}
                fill="#ffffff"
                fillOpacity={active ? 0.9 : 0.6}
              />
              {active ? (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius * 3}
                  fill="none"
                  strokeWidth={0.14}
                  strokeDasharray="0.7 1.1"
                  className="stroke-current"
                  strokeOpacity={0.6}
                />
              ) : null}
              {showLabels && labelIds.has(node.id) ? (
                <text
                  x={node.x}
                  y={node.y + node.radius * 1.8 + 2.4}
                  textAnchor="middle"
                  fontSize={2.05}
                  className="constellation-label"
                  fill="#e8eeff"
                  fillOpacity={active ? 0.96 : 0.62}
                  stroke="#05070f"
                  strokeWidth={0.4}
                  strokeOpacity={0.9}
                >
                  {node.label.length > 11 ? `${node.label.slice(0, 11)}…` : node.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
