import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to apply soft protection measures (disable right click, copy/paste) 
 * selectively based on the current route to prevent easy cloning.
 */
export const useSoftProtection = () => {
    const location = useLocation();

    useEffect(() => {
        // Paths where we might want to restrict certain actions completely
        // For Quran, we want to allow reading and natural interaction, 
        // but maybe discourage bulk copying without breaking accessibility.
        const isQuranPage = location.pathname.includes('/quran');

        const handleContextMenu = (e) => {
            // Disable right click globally in production, but allow text selection
            if (process.env.NODE_ENV === 'production') {
                e.preventDefault();
            }
        };

        const handleCopy = (e) => {
            // On Quran page, we can append a copyright notice if they copy text
            if (isQuranPage) {
                const selection = window.getSelection();
                if (selection && selection.toString().length > 0) {
                    const originalText = selection.toString();
                    const copyrightNotice = '\n\n---\nمأخوذ من مشروع الصراط المستقيم © 2026\nلا يُسمح بالاستخدام التجاري غير المصرح به.';

                    if (e.clipboardData) {
                        e.clipboardData.setData('text/plain', originalText + copyrightNotice);
                        e.preventDefault();
                    }
                }
            } else {
                // For other pages, we can just let normal copy work or disable it for source code protection
                // To not disturb UX too much, we just let it be, or optionally prevent it if needed.
                // We will allow regular copying for now to not harm accessibility.
            }
        };

        const handleKeyDown = (e) => {
            // Prevent Ctrl+U (View Source) and F12 (DevTools) in production as a soft deterrent
            if (process.env.NODE_ENV === 'production') {
                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
                    e.preventDefault();
                }
            }
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            // Cleanup
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [location.pathname]);
};
