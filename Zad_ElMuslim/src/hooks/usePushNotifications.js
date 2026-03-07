import { useState, useEffect } from 'react';
import { PUSH_SERVER_URL } from '../config';

const SUBSCRIBE_URL = `/.netlify/functions/subscribe`;

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function usePushNotifications() {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            setPermission(Notification.permission);
            checkSubscription().then(isSub => {
                if (!isSub && Notification.permission !== 'denied') {
                    // Use capture phase so React onClick handlers don't stop the event propagation
                    const requestOnInteraction = (e) => {
                        // try to subscribe silently so it doesn't alert the user on initial interaction
                        try {
                            subscribe(true);
                        } catch (err) {
                            console.error('Interaction subscribe failed:', err);
                        }
                        document.removeEventListener('click', requestOnInteraction, { capture: true });
                        document.removeEventListener('touchstart', requestOnInteraction, { capture: true });
                    };
                    // addEventListener with { capture: true } ensures we get the event first
                    document.addEventListener('click', requestOnInteraction, { capture: true, once: true });
                    document.addEventListener('touchstart', requestOnInteraction, { capture: true, once: true });
                }
            });
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
            return !!subscription;
        } catch (error) {
            console.error('Error checking push subscription:', error);
            return false;
        }
    };

    const getPosition = () => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve({ latitude: 30.0444, longitude: 31.2357 }); // Default Cairo
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
                () => resolve({ latitude: 30.0444, longitude: 31.2357 })
            );
        });
    };

    const subscribe = async (silent = false) => {
        setLoading(true);
        try {
            // 1. Get VAPID public key from env instead of fetching from backend
            const publicKey = import.meta.env.VITE_PUSH_VAPID_PUBLIC;
            if (!publicKey) throw new Error('VAPID public key not found in environment');
            const applicationServerKey = urlBase64ToUint8Array(publicKey);

            // 2. Request notification permission if not granted
            let perm = Notification.permission;
            if (perm !== 'granted') {
                perm = await Notification.requestPermission();
                setPermission(perm);
            }
            if (perm !== 'granted') {
                throw new Error('Notification permission denied');
            }

            // 3. Register service worker if needed (usually done in main.jsx/App.jsx, but we make sure it's ready)
            const registration = await navigator.serviceWorker.ready;

            // 4. Subscribe to push max
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });

            // 5. Get location and timezone for proper Adhan times
            const { latitude, longitude } = await getPosition();
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            // 6. Send subscription to backend
            const response = await fetch(SUBSCRIBE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subscription,
                    latitude,
                    longitude,
                    timeZone,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Backend returned ${response.status}: ${text}`);
            }

            setIsSubscribed(true);
            console.log('Push subscription successful!');
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            if (!silent) {
                alert('حدث خطأ أثناء تفعيل الإشعارات. تأكد من تشغيل خادم الإشعارات الخاص بك.');
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        isSupported,
        permission,
        isSubscribed,
        loading,
        subscribe,
    };
}
