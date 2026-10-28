import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localesDirectory = path.join(projectRoot, "src", "locales");
const languages = ["en", "tr", "ar"];

async function loadLocales() {
  return Object.fromEntries(
    await Promise.all(
      languages.map(async (language) => [
        language,
        JSON.parse(
          await readFile(
            path.join(localesDirectory, `${language}.json`),
            "utf8",
          ),
        ),
      ]),
    ),
  );
}

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return /\.(jsx?|tsx?)$/.test(entry.name) ? [target] : [];
    }),
  );
  return nestedFiles.flat();
}

test("all locale files contain the same non-empty keys", async () => {
  const locales = await loadLocales();
  const expectedKeys = Object.keys(locales.en).sort();

  for (const language of languages) {
    assert.deepEqual(Object.keys(locales[language]).sort(), expectedKeys);
    for (const [key, value] of Object.entries(locales[language])) {
      assert.equal(typeof value, "string", `${language}.${key} should be text`);
      assert.notEqual(value.trim(), "", `${language}.${key} should not be empty`);
    }
  }
});

test("locale strings preserve the same interpolation variables", async () => {
  const locales = await loadLocales();
  const placeholders = (value) =>
    [...value.matchAll(/{{-?\s*([^}\s]+)\s*}}/g)]
      .map((match) => match[1])
      .sort();

  for (const key of Object.keys(locales.en)) {
    for (const language of ["tr", "ar"]) {
      assert.deepEqual(
        placeholders(locales[language][key]),
        placeholders(locales.en[key]),
        `${language}.${key} interpolation variables`,
      );
    }
  }
});

test("static translation calls refer to keys available in every language", async () => {
  const locales = await loadLocales();
  const files = await sourceFiles(path.join(projectRoot, "src"));
  const keys = new Set(Object.keys(locales.en));
  const references = new Set();
  const translationCall = /\bt\(\s*["'`]([^"'`]+)["'`]/g;

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(translationCall)) {
      references.add(match[1]);
    }
  }

  const missing = [...references].filter(
    (key) => !key.includes("${") && !keys.has(key),
  );
  assert.deepEqual(missing, []);
});
