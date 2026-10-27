// Simple local scan for things that look like secrets. No external service needed.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const patterns = {
  'private key': /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  'AWS access key': /AKIA[0-9A-Z]{16}/,
  'GitHub token': /gh[pousr]_[A-Za-z0-9]{30,}/,
  'API key / token assignment': /(api[_-]?key|secret|token|password)\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i,
  'Slack token': /xox[baprs]-[A-Za-z0-9-]{10,}/,
};

const files = execSync('git ls-files --cached --others --exclude-standard', { encoding: 'utf8' })
  .split('\n')
  .filter((f) => f && !f.endsWith('package-lock.json') && !f.startsWith('scripts/check-secrets'));

const hits = [];
for (const file of files) {
  let text;
  try { text = readFileSync(file, 'utf8'); } catch { continue; }
  for (const [name, re] of Object.entries(patterns)) if (re.test(text)) hits.push(`${file}: possible ${name}`);
}

if (hits.length) {
  console.error(hits.join('\n'));
  process.exit(1);
}
console.log(`No secrets found in ${files.length} files.`);
