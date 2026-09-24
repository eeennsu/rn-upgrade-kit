#!/usr/bin/env node
// 정본을 배포 위치로 복사하고 스킬 폴더를 검사한다.
//   shared/*.md                → skills/<스킬>/references/   (BUNDLE)
//   LICENSE                    → skills/<스킬>/LICENSE        (폴더만 설치돼도 고지가 따라가게)
//   .claude-plugin/plugin.json → plugin.json                 (Agent Plugins 1.0 매니페스트)
// --check: 쓰지 않고 어긋남만 보고한다. 문제가 하나라도 있으면 두 모드 모두 종료코드 1.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');

// 스킬별 번들 대상 — shared/constants.md «값» 표의 소비자 열과 맞춘다.
// 본문이 references/<파일>을 참조하는데 여기 없거나, 여기 있는데 참조가 없으면 §3이 잡는다.
const BUNDLE = {
  'platform-watch': ['constants.md', 'expo.md'],
  currency: ['constants.md', 'lockstep-sets.md', 'expo.md'],
  rehearsal: ['constants.md', 'lockstep-sets.md', 'expo.md'],
};

// Agent Plugins 1.0 스키마는 루트 additionalProperties: false라 허용 필드만 옮긴다.
const AGENT_PLUGINS_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const PORTABLE_FIELDS = ['name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords'];

const problems = [];
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
// autocrlf 체크아웃(CRLF)과 CI(LF)가 같은 판정을 내도록 줄바꿈을 맞춰 비교한다.
const lf = (s) => s.replace(/\r\n/g, '\n');

function emit(rel, content) {
  const current = existsSync(join(ROOT, rel)) ? read(rel) : null;
  if (current !== null && lf(current) === lf(content)) return;
  if (CHECK) {
    problems.push(`${rel}: ${current === null ? '없음' : '정본과 다름'} — node scripts/sync.mjs로 다시 만든다`);
    return;
  }
  writeFileSync(join(ROOT, rel), content);
  console.log(`갱신: ${rel}`);
}

const skills = readdirSync(join(ROOT, 'skills'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

// §1 사본
const shared = readdirSync(join(ROOT, 'shared')).filter((f) => f.endsWith('.md'));
for (const [skill, files] of Object.entries(BUNDLE)) {
  for (const f of files) emit(`skills/${skill}/references/${f}`, read(`shared/${f}`));
}
const license = read('LICENSE');
for (const skill of skills) emit(`skills/${skill}/LICENSE`, license);

// §2 매니페스트
const claude = JSON.parse(read('.claude-plugin/plugin.json'));
const manifest = { $schema: AGENT_PLUGINS_SCHEMA };
for (const k of PORTABLE_FIELDS) if (k in claude) manifest[k] = claude[k];
emit('plugin.json', `${JSON.stringify(manifest, null, 2)}\n`);

// §3 스킬 검사 — Agent Skills 스펙(agentskills.io/specification)의 name·description 제약 +
// 스킬 폴더 하나만 복사해 가도 동작하는지(자기 폴더 밖 경로 금지).
const NAME = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// YAML plain scalar는 이 문자로 시작할 수 없다. `argument-hint: [--x]`가 엄격한 파서에서 frontmatter 전체를 죽인다.
const YAML_INDICATOR = /^[[\]{},#&*!|>%@`]/;

for (const skill of Object.keys(BUNDLE)) {
  if (!skills.includes(skill)) problems.push(`BUNDLE의 ${skill}: skills/에 없는 스킬`);
}

for (const skill of skills) {
  const base = `skills/${skill}`;
  if (!existsSync(join(ROOT, base, 'SKILL.md'))) {
    problems.push(`${base}: SKILL.md 없음`);
    continue;
  }

  const fm = lf(read(`${base}/SKILL.md`)).match(/^---\n([\s\S]*?)\n---\n/)?.[1];
  if (fm === undefined) {
    problems.push(`${base}/SKILL.md: frontmatter 없음`);
    continue;
  }
  const fields = {};
  for (const line of fm.split('\n')) {
    const m = line.match(/^([A-Za-z][\w-]*):[ \t]*(.*)$/);
    if (!m) continue;
    const [, key, value] = m;
    fields[key] = value;
    const quote = value[0];
    if (quote === '"' || quote === "'") {
      if (value.length < 2 || !value.endsWith(quote)) problems.push(`${base}/SKILL.md: ${key} 따옴표가 닫히지 않음`);
    } else if (YAML_INDICATOR.test(value) || value.includes(': ') || value.includes(' #')) {
      problems.push(`${base}/SKILL.md: ${key} 값을 따옴표로 감싸야 한다 — 엄격한 YAML 파서에서 frontmatter가 깨진다`);
    }
  }

  const name = fields.name?.replace(/^["']|["']$/g, '');
  if (name !== skill) problems.push(`${base}/SKILL.md: name(${name})이 폴더 이름과 다름`);
  else if (!NAME.test(name) || name.length > 64) problems.push(`${base}/SKILL.md: name이 스펙 형식이 아님`);
  const description = fields.description?.replace(/^["']|["']$/g, '') ?? '';
  const length = [...description].length;
  if (length === 0 || length > 1024) problems.push(`${base}/SKILL.md: description 길이 ${length} (1~1024)`);
  if (fields.license !== claude.license) {
    problems.push(`${base}/SKILL.md: license(${fields.license})가 .claude-plugin/plugin.json(${claude.license})과 다름`);
  }

  const bundled = BUNDLE[skill] ?? [];
  const texts = readdirSync(join(ROOT, base), { recursive: true })
    .map((p) => p.replaceAll('\\', '/'))
    .filter((p) => p.endsWith('.md') && !bundled.some((f) => p === `references/${f}`))
    .map((p) => [p, read(`${base}/${p}`)]);

  for (const [p, text] of texts) {
    if (text.includes('../../')) problems.push(`${base}/${p}: 스킬 폴더 밖 경로(../../) — 스킬 폴더만 설치되면 끊긴다`);
  }
  for (const f of shared) {
    const referenced = texts.some(([, text]) => text.includes(`references/${f}`));
    if (referenced && !bundled.includes(f)) problems.push(`${base}: references/${f}를 참조하지만 BUNDLE에 없음`);
    if (!referenced && bundled.includes(f)) problems.push(`${base}: BUNDLE에 ${f}가 있지만 참조가 없음`);
  }
}

if (problems.length > 0) {
  console.error(problems.map((p) => `✖ ${p}`).join('\n'));
  process.exit(1);
}
if (CHECK) console.log('사본·매니페스트·스킬 검사 통과');
