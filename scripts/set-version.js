import fs from 'fs';
import readline from 'readline';

const versionFilePath = './src/version.js';
const pkgFilePath = './package.json';

const currentContent = fs.readFileSync(versionFilePath, 'utf8');
const match = currentContent.match(/APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
const currentVersion = match ? match[1] : 'v0.1.8-A';

const targetVersion = process.argv[2];

function applyVersion(newVer) {
  const cleanVer = (newVer || '').trim();
  if (!cleanVer) {
    console.log('No version entered. Update cancelled.');
    process.exit(0);
  }

  // Update src/version.js
  const updatedContent = currentContent.replace(
    /APP_VERSION\s*=\s*['"][^'"]+['"]/,
    `APP_VERSION = '${cleanVer}'`
  );
  fs.writeFileSync(versionFilePath, updatedContent, 'utf8');

  // Update package.json
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgFilePath, 'utf8'));
    pkg.version = cleanVer.replace(/^v/, '');
    fs.writeFileSync(pkgFilePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  } catch (e) {
    console.warn('Could not update package.json version:', e.message);
  }

  console.log(`\n✓ Version successfully updated: ${currentVersion} -> ${cleanVer}\n`);
}

if (targetVersion) {
  applyVersion(targetVersion);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(`\nCurrent version is: ${currentVersion}\nEnter new version (e.g. v0.1.9-A): `, (answer) => {
    rl.close();
    applyVersion(answer);
  });
}
