const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconPath = 'C:\\Users\\AbdallahWaleed\\.gemini\\antigravity\\brain\\1da22ef3-105f-44a2-8a7d-90adc60d98b4\\islamic_app_icon_1774362690842.png';
const publicDir = path.join(__dirname, 'public');
const iconsDir = path.join(publicDir, 'icons');
const assetsDir = path.join(__dirname, 'assets');

async function generate() {
  console.log('Generating WebP icons...');
  const sizes = [48, 72, 96, 128, 192, 256, 512];
  for (const size of sizes) {
     await sharp(iconPath).resize(size, size).webp({quality: 100}).toFile(path.join(iconsDir, `icon-${size}.webp`));
  }

  console.log('Generating PWA icons...');
  await sharp(iconPath).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(iconPath).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192x192.png'));
  await sharp(iconPath).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512x512.png'));

  const variants = ['light', 'dark', 'ramadan'];
  const variantsSizes = [32, 64, 192, 512, 1024];
  for (const variant of variants) {
    for (const size of variantsSizes) {
      await sharp(iconPath).resize(size, size).png().toFile(path.join(iconsDir, `icon-${variant}-${size}x${size}.png`));
    }
  }

  console.log('Replacing Capacitor assets src...');
  fs.copyFileSync(iconPath, path.join(assetsDir, 'icon.png'));

  console.log('All icons replaced successfully.');
}

generate().catch(err => {
    console.error(err);
    process.exit(1);
});
