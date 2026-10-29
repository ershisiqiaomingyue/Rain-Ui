export type FileDiffRow = { kind: "added" | "removed" | "context" | "meta"; text: string; oldLine?: number; newLine?: number };
export const MAX_DIFF_ROWS = 4000;

const FILE_HEADER = /^(?:diff --git |index |--- |\+\+\+ )/;

// Consume unified hunks only: file headers must never count as added/deleted code.
export function parseFileDiff(diff: string) {
  const rows: FileDiffRow[] = [];
  let oldLine = 0, newLine = 0, oldRemaining = 0, newRemaining = 0;
  let added = 0, removed = 0, truncated = false;

  const lines = diff.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const hunk = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(line);
    let row: FileDiffRow;
    const nextLine = lines[i + 1] ?? "";

    if (hunk) {
      oldLine = Number(hunk[1]); newLine = Number(hunk[3]);
      oldRemaining = Number(hunk[2] ?? 1); newRemaining = Number(hunk[4] ?? 1);
      row = { kind: "meta", text: line };
    } else if (
      // `--- a/x` 只有在紧跟 `+++ b/x`（或显式 diff/index 行）时才是文件头；
      // 单独出现则可能是「内容以 -- 开头的删除行」。hunk 计数耗尽后的头行也走这里，
      // 避免 hunk 截断时把后续文件的头误算成增删。
      /^(?:diff --git |index )/.test(line) ||
      (/^--- /.test(line) && /^(?:\+\+\+ |diff --git |index )/.test(nextLine)) ||
      (oldRemaining === 0 && newRemaining === 0 && FILE_HEADER.test(line))
    ) {
      oldRemaining = newRemaining = 0;
      row = { kind: "meta", text: line };
    } else if (line.startsWith("+") && newRemaining > 0) {
      added += 1; newRemaining -= 1;
      row = { kind: "added", text: line.slice(1), newLine: newLine++ };
    } else if (line.startsWith("-") && oldRemaining > 0) {
      removed += 1; oldRemaining -= 1;
      row = { kind: "removed", text: line.slice(1), oldLine: oldLine++ };
    } else if (line.startsWith(" ") && oldRemaining > 0 && newRemaining > 0) {
      oldRemaining -= 1; newRemaining -= 1;
      row = { kind: "context", text: line.slice(1), oldLine: oldLine++, newLine: newLine++ };
    } else {
      // 空行在计数未耗尽时应作为上下文行处理，否则后续行与 hunk 头错位。
      if (!line) {
        if (oldRemaining > 0 && newRemaining > 0) {
          oldRemaining -= 1; newRemaining -= 1;
          row = { kind: "context", text: "", oldLine: oldLine++, newLine: newLine++ };
        } else continue;
      } else {
        if (!line.startsWith("\\")) oldRemaining = newRemaining = 0;
        row = { kind: "meta", text: line };
      }
    }
    if (rows.length < MAX_DIFF_ROWS) rows.push(row); else truncated = true;
  }
  // `partial` 也覆盖后端用单独的省略行（`...` / `…`，行首无空格）标记截断的情况；
  // 用行首锚定，避免真实上下文行 " ..." 被误判。
  return { rows, added, removed, truncated, partial: truncated || /^(?:\.\.\.|…)\s*$/m.test(diff) };
}
