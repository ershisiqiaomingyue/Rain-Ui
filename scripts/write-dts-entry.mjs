import { writeFileSync } from "node:fs";
writeFileSync(new URL("../dist/index.d.ts", import.meta.url), 'export * from "./types/src/index";\n');
console.log("dist/index.d.ts written");
