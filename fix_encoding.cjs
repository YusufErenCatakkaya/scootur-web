const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

function fixDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.nuxt' || file === '.git') continue;
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixDir(fullPath);
    } else if (/\.(vue|ts|js|css|json)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let hasBOM = false;
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        hasBOM = true;
      }
      
      if (content.includes('Ä±') || content.includes('ÅŸ') || content.includes('Ã¼') || content.includes('Ã§') || content.includes('Ã¶') || content.includes('ÄŸ') || content.includes('Ã‡') || content.includes('Ã–') || content.includes('Ä°') || content.includes('Åž') || content.includes('Ãœ') || content.includes('Äž') || content.includes('Ã')) {
        try {
          let originalBytes = iconv.encode(content, 'win1254');
          let fixedContent = originalBytes.toString('utf8');
          fs.writeFileSync(fullPath, fixedContent, 'utf8');
          console.log("Restored encoding for " + fullPath);
        } catch (e) {
          console.error("Failed to restore " + fullPath, e);
        }
      }
    }
  }
}

fixDir(process.cwd());
