const fs = require('fs');

const files = [
  'e:/Munchz-Ecommerce/Frontend/src/pages/Aboutmain.tsx',
  'e:/Munchz-Ecommerce/Frontend/src/pages/BlogListPage.tsx',
  'e:/Munchz-Ecommerce/Frontend/src/pages/BlogDetail.tsx',
  'e:/Munchz-Ecommerce/Frontend/src/pages/TermsAndConditions.tsx',
  'e:/Munchz-Ecommerce/Frontend/src/pages/PrivacyPolicy.tsx',
  'e:/Munchz-Ecommerce/Frontend/src/pages/ReturnRefundPolicy.tsx',
  'e:/Munchz-Ecommerce/Frontend/src/pages/ReferAndEarn.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 36px to 30px (text-4xl to text-3xl)
    content = content.replace(/text-4xl/g, 'text-3xl');
    
    // 24px to 28px (text-2xl to text-[28px])
    content = content.replace(/text-2xl/g, 'text-[28px]');
    
    // 16px to 12px (text-base to text-xs)
    content = content.replace(/text-base/g, 'text-xs');
    
    // Fix weird responsive leftovers
    content = content.replace(/text-sm md:text-xs/g, 'text-[10px] md:text-xs');
    content = content.replace(/text-3xl md:text-3xl/g, 'text-2xl md:text-3xl'); // 3xl is 30px. Make mobile 24px
    content = content.replace(/md:text-3xl md:text-3xl/g, 'md:text-3xl');

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('Not found: ' + file);
  }
});
