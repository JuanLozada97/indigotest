import OpenAI from "openai";
import { execSync } from "node:child_process";
import fs from "node:fs";

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.GITHUB_PR_NUMBER;
const githubToken = process.env.GITHUB_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!repo || !prNumber || !githubToken || !openaiApiKey) {
  console.error(
    "Missing env vars: GITHUB_REPOSITORY, GITHUB_PR_NUMBER, GITHUB_TOKEN, OPENAI_API_KEY"
  );
  process.exit(1);
}

const openai = new OpenAI({ apiKey: openaiApiKey });

async function main() {
  console.log(`Running AI review for PR #${prNumber} in ${repo}`);

  // 1) Obtener el diff del PR desde la API de GitHub
  console.log("Fetching diff from GitHub API...");

  const diffResponse = await fetch(
    `https://api.github.com/repos/${repo}/pulls/${prNumber}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "ai-pr-review-bot",
        Accept: "application/vnd.github.v3.diff",
      },
    }
  );

  if (!diffResponse.ok) {
    console.error(
      "Failed to fetch diff:",
      diffResponse.status,
      await diffResponse.text()
    );
    process.exit(1);
  }

  let diff = await diffResponse.text();

  if (!diff || !diff.trim()) {
    console.log("No diff found, skipping review.");
    return;
  }

  diff = diff.slice(0, 40000);

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

${diff}
`;

  console.log("Calling OpenAI API...");

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: "Eres un revisor de código muy detallista y honesto." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const review =
    completion.choices[0]?.message?.content ?? "No se pudo generar el análisis.";

  console.log("Review generated:");
  console.log(review);

  const body = {
    body: `🤖 **Revisión automática con IA**\n\n${review}`,
  };

  const commentResponse = await fetch(
    `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "Content-Type": "application/json",
        "User-Agent": "ai-pr-review-bot",
      },
      body: JSON.stringify(body),
    }
  );

  if (!commentResponse.ok) {
    console.error(
      "Failed to post comment:",
      commentResponse.status,
      await commentResponse.text()
    );
    process.exit(1);
  }

  console.log("AI review comment posted successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
