const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconPath = 'C:\\Users\\AbdallahWaleed\\.gemini\\antigravity\\brain\\1da22ef3-105f-44a2-8a7d-90adc60d98b4\\islamic_app_icon_1774362690842.png';
const splashPath = 'C:\\Users\\AbdallahWaleed\\.gemini\\antigravity\\brain\\1da22ef3-105f-44a2-8a7d-90adc60d98b4\\islamic_splash_screen_1774363465832.png';
const assetsDir = path.join(__dirname, 'assets');
const croppedPath = path.join(assetsDir, 'icon.png');
const outSplashPath = path.join(assetsDir, 'splash.png');

const publicDir = path.join(__dirname, 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

async function processIcons() {
  console.log('Cropping icon...');
  const metadata = await sharp(iconPath).metadata();
  const cropSize = Math.floor(metadata.width * 0.70); // Crop 15% from each edge
  const offset = Math.floor((metadata.width - cropSize) / 2);
  
  await sharp(iconPath)
    .extract({ left: offset, top: offset, width: cropSize, height: cropSize })
    .resize(1024, 1024)
    .toFile(croppedPath);

  console.log('Copying splash screen...');
  await sharp(splashPath).resize(2732, 2732, { fit: 'cover' }).toFile(outSplashPath);

  console.log('Generating WebP / PWA icons...');
  const sizes = [48, 72, 96, 128, 192, 256, 512];
  for (const size of sizes) {
     await sharp(croppedPath).resize(size, size).webp({quality: 100}).toFile(path.join(iconsDir, `icon-${size}.webp`));
  }
  
  await sharp(croppedPath).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(croppedPath).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192x192.png'));
  await sharp(croppedPath).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512x512.png'));
  await sharp(croppedPath).resize(512, 512).png().toFile(path.join(publicDir, 'icon.png'));

  const variants = ['light', 'dark', 'ramadan'];
  const variantsSizes = [32, 64, 192, 512, 1024];
  for (const variant of variants) {
    for (const size of variantsSizes) {
      await sharp(croppedPath).resize(size, size).png().toFile(path.join(iconsDir, `icon-${variant}-${size}x${size}.png`));
    }
  }
  console.log('Done preparing base assets.');
}

processIcons().catch(err => { console.error(err); process.exit(1); });
