const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const root = process.cwd();
  const iconSvg = path.join(root, 'assets', 'branding', 'icon-master.svg');
  const splashSvg = path.join(root, 'assets', 'branding', 'splash-master.svg');
  const publicIcons = path.join(root, 'public', 'icons');
  const rootIcons = path.join(root, 'icons');
  const assetsDir = path.join(root, 'assets');

  fs.mkdirSync(publicIcons, { recursive: true });
  fs.mkdirSync(rootIcons, { recursive: true });

  for (const variant of ['light', 'dark', 'ramadan']) {
    fs.copyFileSync(iconSvg, path.join(publicIcons, `icon-${variant}.svg`));
  }

  const sizes = [48, 72, 96, 128, 192, 256, 512];
  for (const size of sizes) {
    await sharp(iconSvg).resize(size, size).webp({ quality: 95 }).toFile(path.join(publicIcons, `icon-${size}.webp`));
    await sharp(iconSvg).resize(size, size).webp({ quality: 95 }).toFile(path.join(rootIcons, `icon-${size}.webp`));
  }

  await sharp(iconSvg).resize(180, 180).png().toFile(path.join(root, 'public', 'apple-touch-icon.png'));
  await sharp(iconSvg).resize(192, 192).png().toFile(path.join(root, 'public', 'icon-192x192.png'));
  await sharp(iconSvg).resize(512, 512).png().toFile(path.join(root, 'public', 'icon-512x512.png'));

  await sharp(iconSvg).resize(1024, 1024).png().toFile(path.join(assetsDir, 'icon.png'));
  // Keep splash composition without aggressive crop for native generators.
  await sharp(splashSvg).resize(2732, 2732, { fit: 'contain', background: '#062620' }).png().toFile(path.join(assetsDir, 'splash.png'));
  await sharp(splashSvg).resize(1440, 3120, { fit: 'contain', background: '#062620' }).webp({ quality: 95 }).toFile(path.join(root, 'public', 'splash-screen.webp'));
  await sharp(splashSvg).resize(1440, 3120, { fit: 'contain', background: '#062620' }).png().toFile(path.join(root, 'public', 'splash-screen.png'));

  console.log('Brand assets generated successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
