import OpenAI from "openai";
import { execSync } from "node:child_process";
import fs from "node:fs";

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.GITHUB_PR_NUMBER;
const githubToken = process.env.GITHUB_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;
const baseSha = process.env.GITHUB_BASE_SHA;
const headSha = process.env.GITHUB_HEAD_SHA;

if (!repo || !prNumber || !githubToken || !openaiApiKey || !baseSha || !headSha) {
  console.error(
    "Missing env vars: GITHUB_REPOSITORY, GITHUB_PR_NUMBER, GITHUB_TOKEN, OPENAI_API_KEY, GITHUB_BASE_SHA, GITHUB_HEAD_SHA"
  );
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiApiKey });

function run(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

async function main() {
  console.log(`Running AI review for PR #${prNumber} in ${repo}`);

  let diff = "";
  try {
    diff = run(`git diff ${baseSha}...${headSha}`);
  } catch (err) {
    console.error("Error generating diff:", err.message);
    process.exit(1);
  }

  if (!diff) {
    console.log("No diff found between base and head, skipping review.");
    return;
  }

  const prompt = `
Eres un revisor de código experto en C#, .NET, JavaScript y buenas prácticas de arquitectura.

Revisa el siguiente diff de un Pull Request y devuelve un análisis estructurado en español con:

- Posibles BUGS o comportamientos inesperados
- Riesgos de SEGURIDAD
- Problemas de RENDIMIENTO
- Oportunidades de LIMPIEZA / buenas prácticas
- Comentarios POSITIVOS si encuentras algo bien hecho

Formato de salida (markdown):

## Resumen general

## Posibles bugs

## Seguridad

## Rendimiento

## Buenas prácticas / limpieza

## Sugerencias concretas

Diff:

${diff}`.slice(0, 28000);

  console.log("Calling OpenAI API...");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Eres un revisor de código muy detallista y honesto." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const review = completion.choices[0]?.message?.content ?? "No se pudo generar el análisis.";

  console.log("Review generated:");
  console.log(review);

  const body = {
    body: `🤖 **Revisión automática con IA**\n\n${review}`,
  };

  const response = await fetch(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      "Content-Type": "application/json",
      "User-Agent": "ai-pr-review-bot",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("Failed to post comment:", response.status, await response.text());
    process.exit(1);
  }

  console.log("AI review comment posted successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
