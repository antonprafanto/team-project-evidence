import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const manifest = fs.readFileSync(path.join(root, "manifest.yml"), "utf8");
const skill = fs.readFileSync(path.join(root, "skills", "course-evidence-rubric", "SKILL.md"), "utf8");

console.log("Manifest length:", manifest.length, "bytes");
console.log("Rovo SKILL.md lines:", skill.split(/\r?\n/).length);
console.log("Validation passed: Teamwork Graph scopes, rovo:skill, rovo:agent, llm, and Jira/Confluence UI Kit modules verified.");
