const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.nuxt' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (/\.(vue|ts|js|css|json)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (/scooturk/i.test(content)) {
        content = content.replace(/Scooturk/g, 'Scootur');
        content = content.replace(/scooturk/g, 'scootur');
        content = content.replace(/SCOOTURK/g, 'SCOOTUR');
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}
replaceInDir(process.cwd());
