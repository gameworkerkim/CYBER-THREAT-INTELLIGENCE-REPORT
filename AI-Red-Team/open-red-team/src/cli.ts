#!/usr/bin/env node
import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import { OpenRedTeam } from "./index.js";

const program = new Command();

program
  .name("ort")
  .description("Open Red Team — model-agnostic offensive security skills middleware")
  .version("0.1.0");

program
  .command("chat")
  .description("Interactive chat session with trigger-based skill auto-loading")
  .option("-p, --provider <name>", "provider: deepseek | glm | openweight")
  .option("-m, --model <name>", "model name")
  .option("-s, --skills <names>", "comma-separated skills to force-load", collectList)
  .action(async (options: { provider?: string; model?: string; skills?: string[] }) => {
    const ort = new OpenRedTeam({
      provider: options.provider as never,
      model: options.model,
    });
    await ort.init();

    const forced = options.skills ?? [];
    console.log(`[ort] provider=${ort.config.provider} model=${ort.config.model} skills=${ort.listSkills().length} loaded`);
    console.log('[ort] type "/use <skill>" in your message, "/skills" to list, "/reset" to clear, "/exit" to quit\n');

    const rl = createInterface({ input: process.stdin, output: process.stdout });

    for (;;) {
      const raw = (await rl.question("you> ")).trim();
      if (raw === "/exit" || raw === "/quit") break;
      if (raw === "/skills") {
        for (const s of ort.listSkills()) {
          console.log(`  ${s.frontmatter.name} [${s.frontmatter.category}] — ${s.frontmatter.description.slice(0, 80)}`);
        }
        continue;
      }
      if (raw === "/reset") {
        ort.reset();
        console.log("[ort] history cleared");
        continue;
      }
      if (raw === "") continue;

      process.stdout.write("ai> ");
      try {
        const result = await ort.chat(raw, {
          skills: forced,
          onDelta: (d) => process.stdout.write(d),
        });
        process.stdout.write("\n");
        console.log(`\n[ort] skills: ${result.matchedSkills.join(", ") || "none"}\n`);
      } catch (err) {
        process.stdout.write("\n");
        console.error(`[ort] error: ${err instanceof Error ? err.message : String(err)}\n`);
      }
    }
    rl.close();
  });

program
  .command("ask <question...>")
  .description("Single-turn query")
  .option("-p, --provider <name>", "provider: deepseek | glm | openweight")
  .option("-m, --model <name>", "model name")
  .option("-s, --skills <names>", "comma-separated skills to force-load", collectList)
  .action(async (question: string[], options: { provider?: string; model?: string; skills?: string[] }) => {
    const ort = new OpenRedTeam({
      provider: options.provider as never,
      model: options.model,
    });
    await ort.init();
    const result = await ort.chat(question.join(" "), { skills: options.skills });
    console.log(result.content);
  });

const skillsCmd = program
  .command("skills")
  .description("List or show skills");

skillsCmd
  .command("list")
  .description("List all ported skills")
  .action(async () => {
    const ort = new OpenRedTeam();
    await ort.init();
    for (const s of ort.listSkills()) {
      console.log(`${s.frontmatter.name}\t[${s.frontmatter.category}]\t${s.frontmatter.description}`);
    }
  });

skillsCmd
  .command("show <name>")
  .description("Print a skill body")
  .action(async (name: string) => {
    const ort = new OpenRedTeam();
    await ort.init();
    const skill = ort.getSkill(name);
    if (!skill) {
      console.error(`Skill not found: ${name}`);
      process.exit(1);
    }
    console.log(`---\n${Object.entries(skill.frontmatter).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join("\n")}\n---\n`);
    console.log(skill.body);
  });

function collectList(value: string, previous: string[]): string[] {
  return [...previous, ...value.split(",").map((s) => s.trim()).filter(Boolean)];
}

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
