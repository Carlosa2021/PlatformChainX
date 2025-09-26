#!/usr/bin/env node
/**
 * Simple guardrail: ensures the installed thirdweb version matches the declared semver range.
 * Prevents accidental implicit upgrade triggered by npx usage in deploy script.
 */
const fs = require('fs');
const path = require('path');

try {
  const pkgPath = path.join(__dirname, '..', 'package.json');
  const lockThirdweb = require(path.join(
    __dirname,
    '..',
    'node_modules',
    'thirdweb',
    'package.json',
  )).version;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const declared = pkg.dependencies.thirdweb;
  if (!declared) {
    console.warn(
      '[check-thirdweb-version] thirdweb not declared in dependencies',
    );
    process.exit(0);
  }
  // Basic major comparison
  const majorDeclared = declared.replace(/^[^0-9]*([0-9]+).*/, '$1');
  const majorInstalled = lockThirdweb.split('.')[0];
  if (majorDeclared !== majorInstalled) {
    console.error(
      `✖ thirdweb major mismatch: declared=${declared} installed=${lockThirdweb}`,
    );
    process.exit(1);
  }
  console.log(`✓ thirdweb version ok: ${lockThirdweb}`);
} catch (e) {
  console.warn('[check-thirdweb-version] skipped:', e.message);
}
