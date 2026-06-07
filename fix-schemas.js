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
      let changed = false;

      // Replace clinic.tenant_schema -> \`tenant_${clinic.slug}\`
      // But only inside getTenantClient calls to be safe
      if (content.includes('getTenantClient(clinic.tenant_schema)')) {
        content = content.replace(/getTenantClient\(clinic\.tenant_schema\)/g, 'getTenantClient(`tenant_${clinic.slug}`)');
        changed = true;
      }
      
      // Also fix places where we might have accidentally replaced to getTenantClient(clinic.slug)
      if (content.includes('getTenantClient(clinic.slug)')) {
        content = content.replace(/getTenantClient\(clinic\.slug\)/g, 'getTenantClient(`tenant_${clinic.slug}`)');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated schema reference in', fullPath);
      }
    }
  }
}

for (const dir of dirs) {
  replaceInDir(dir);
}
console.log('Done fixing schema references.');
