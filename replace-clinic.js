const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'apps'),
  path.join(__dirname, 'packages')
];

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === 'dist' || file === 'build') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('publicDb.clinic.')) {
        content = content.replace(/publicDb\.clinic\./g, 'publicDb.tenant.');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  replaceInDir(dir);
}
console.log('Done.');
