/**
 * على الأندرويد/آيفون: يحفظ صورة (data URL) في الكاش ثم يفتح شير النيتيف.
 * لازم تستدعيها فقط لما window.Capacitor.isNativePlatform() === true
 */
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

export async function shareImageDataUrl(dataUrl, title, dialogTitle) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        throw new Error('Invalid data URL');
    }
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const fileName = `share-${Date.now()}.png`;
    await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
    });
    const { uri } = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
    });
    await Share.share({
        title: title || 'Share',
        url: uri,
        dialogTitle: dialogTitle || title || 'Share',
    });
}

/**
 * على الأندرويد/آيفون: يحفظ الصورة في الملفات ثم يفتح شاشة المشاركة حتى يختار المستخدم "حفظ" أو "حفظ في المعرض".
 * بديل لـ link.download + link.click() اللي مش بتشتغل في الـ WebView.
 */
export async function saveImageDataUrlToDevice(dataUrl, suggestedFileName, shareDialogTitle) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        throw new Error('Invalid data URL');
    }
    const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
    const fileName = suggestedFileName && /\.png$/i.test(suggestedFileName)
        ? suggestedFileName
        : `saved-${Date.now()}.png`;
    await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
    });
    const { uri } = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
    });
    await Share.share({
        title: shareDialogTitle || 'Save',
        url: uri,
        dialogTitle: shareDialogTitle || 'Save image',
    });
}
