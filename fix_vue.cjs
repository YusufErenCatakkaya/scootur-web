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
      let changed = false;
      const regex = /(text|bg|border|ring|shadow|hover:text|hover:bg|focus:ring|focus:border)-Scootur/g;
      const newContent = content.replace(regex, '$1-scootur');
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log("Fixed " + fullPath);
      }
    }
  }
}

replaceInDir(process.cwd());
