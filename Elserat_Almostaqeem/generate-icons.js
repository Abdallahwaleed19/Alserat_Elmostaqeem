const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'public', 'icons');
const outputDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const variants = ['light', 'dark', 'ramadan'];
const sizes = [32, 64, 192, 512, 1024];

async function generateIcons() {
    console.log('Generating icons...');
    for (const variant of variants) {
        const inputSvg = path.join(iconsDir, `icon-${variant}.svg`);

        for (const size of sizes) {
            const outputPng = path.join(outputDir, `icon-${variant}-${size}x${size}.png`);
            try {
                await sharp(inputSvg)
                    .resize(size, size)
                    .png()
                    .toFile(outputPng);
                console.log(`Generated: icon-${variant}-${size}x${size}.png`);
            } catch (err) {
                console.error(`Failed to generate ${outputPng}:`, err);
            }
        }
    }

    // Create generic apple-touch-icon, favicon
    try {
        await sharp(path.join(iconsDir, `icon-light.svg`))
            .resize(180, 180)
            .png()
            .toFile(path.join(__dirname, 'public', 'apple-touch-icon.png'));

        await sharp(path.join(iconsDir, `icon-light.svg`))
            .resize(512, 512)
            .png()
            .toFile(path.join(__dirname, 'public', 'icon-512x512.png'));

        await sharp(path.join(iconsDir, `icon-light.svg`))
            .resize(192, 192)
            .png()
            .toFile(path.join(__dirname, 'public', 'icon-192x192.png'));

        console.log('Generated generic icons for PWA');
    } catch (err) {
        console.error('Failed to generate generic icons:', err);
    }
}

generateIcons();
