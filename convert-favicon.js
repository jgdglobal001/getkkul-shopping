const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertLogoToFavicon() {
  try {
    const inputPath = path.join(__dirname, 'public', 'logo.png');
    const outputPath = path.join(__dirname, 'public', 'favicon.ico');

    console.log('Converting logo.png to favicon.ico...');

    // logo.png를 32x32 크기의 ICO 파일로 변환
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(outputPath.replace('.ico', '-temp.png'));

    // 임시 PNG 파일을 ICO로 변환 (Sharp는 직접 ICO를 지원하지 않으므로)
    // 여기서는 일단 PNG로 저장하고 추후 ICO로 변환
    await sharp(inputPath)
      .resize(16, 16)
      .png()
      .toFile(outputPath.replace('.ico', '-16.png'));

    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(outputPath.replace('.ico', '-32.png'));

    console.log('✅ Favicon conversion completed!');
    console.log('📁 Files created:');
    console.log('  - favicon-16.png');
    console.log('  - favicon-32.png');

    // 기존 favicon.ico 백업
    if (fs.existsSync(outputPath)) {
      const backupPath = outputPath.replace('.ico', '-old.ico');
      fs.renameSync(outputPath, backupPath);
      console.log(`📦 Original favicon.ico backed up as favicon-old.ico`);
    }

  } catch (error) {
    console.error('❌ Error converting logo to favicon:', error);
  }
}

convertLogoToFavicon();
