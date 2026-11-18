import * as runtime from "monaco-editor/editor/editor.api"
import EditorWorker from "monaco-editor/editor/editor.worker?worker"
import "monaco-editor/features/register.all"
import "monaco-editor/languages/definitions/typescript/register"

// 仅演示站负责 Worker；组件库本身不绑定任何构建工具。
self.MonacoEnvironment = { getWorker: () => new EditorWorker() }
export { runtime }
