const fs = require('fs');
const iconv = require('iconv-lite');

function testFix() {
  let content = fs.readFileSync('pages/index.vue', 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  let originalBytes = iconv.encode(content, 'win1254');
  let fixedContent = originalBytes.toString('utf8');
  
  console.log("Fixed content preview:");
  console.log(fixedContent.substring(fixedContent.indexOf('Scooter'), fixedContent.indexOf('Scooter') + 200));
}

testFix();
