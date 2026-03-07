import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';

export default function NotificationPrompt() {
    const { isSupported, permission, isSubscribed, loading, subscribe } = usePushNotifications();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show prompt if supported, not already subscribed, and not permanently denied
        if (isSupported && !isSubscribed && permission !== 'denied') {
            const dismissed = localStorage.getItem('notification_prompt_dismissed');
            if (!dismissed) {
                // Small delay to let the app load first
                const timer = setTimeout(() => setIsVisible(true), 3000);
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [isSupported, isSubscribed, permission]);

    if (!isVisible) return null;

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('notification_prompt_dismissed', 'true');
    };

    const handleSubscribe = async () => {
        await subscribe();
        setIsVisible(false);
    };

    return (
        <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 z-50 border border-emerald-100 dark:border-emerald-900/30 transform transition-all duration-500 animate-slide-up">
            <button
                onClick={handleDismiss}
                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <X size={20} />
            </button>

            <div className="flex items-start gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full flex-shrink-0">
                    <Bell className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-pulse-slow" />
                </div>

                <div className="flex-1 pt-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 font-arabic">
                        إشعارات الصراط المستقيم
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-arabic leading-relaxed">
                        فعل الإشعارات ليصلك تنبيه بمواعيد الأذان، وحديث اليوم، ودعاء كل 15 دقيقة، حتى لو كان التطبيق مغلقاً.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSubscribe}
                            disabled={loading}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors font-arabic disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    جارِ التفعيل...
                                </>
                            ) : (
                                'تفعيل الإشعارات'
                            )}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl text-sm font-medium transition-colors font-arabic"
                        >
                            لاحقاً
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
