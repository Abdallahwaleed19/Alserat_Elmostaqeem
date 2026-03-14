import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ExternalLink, RefreshCw, Map as MosqueIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../../context/LanguageContext';
import 'leaflet/dist/leaflet.css';
import './NearestMosque.css';

// Fix Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Mosque Icon
const mosqueMarkerIcon = L.divIcon({
    html: `<div class="mosque-marker" style="background-color: #0F5A47; border: 2px solid #D4AF37; border-radius: 50%; width: 30px; height: 30px; display: flex; items-center: center; justify-content: center;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

// Component to handle map center updates
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// مدى البحث عن المساجد (كم)
// لضمان ظهور المساجد الصغيرة والكبيرة في نطاق المدينة/المنطقة المحيطة
const MAX_DISTANCE_KM = 15;

const NearestMosque = () => {
    const { lang } = useLanguage();
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]); // Default to Cairo

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return parseFloat((R * c).toFixed(2));
    };

    const fetchMosques = async () => {
        setLoading(true);
        setError('');
        
        if (!navigator.geolocation) {
            setError(lang === 'ar' ? 'تحديد الموقع غير مدعوم في متصفحك.' : 'Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setMapCenter([latitude, longitude]);

            try {
                // Overpass query موسعة تشمل المساجد بجميع أحجامها
                const query = `[out:json][timeout:30];
                    (
                      nwr["amenity"~"place_of_worship|mosque"](around:12000,${latitude},${longitude});
                      nwr["building"="mosque"](around:12000,${latitude},${longitude});
                      nwr["name"~"مسجد|جامع"](around:12000,${latitude},${longitude});
                    );
                    out center;`;

                // أكثر من خادم لـ Overpass لزيادة الاعتمادية
                const overpassEndpoints = [
                    'https://overpass-api.de/api/interpreter',
                    'https://overpass.kumi.systems/api/interpreter'
                ];

                let data = null;
                let lastError = null;

                for (const baseUrl of overpassEndpoints) {
                    try {
                        const response = await fetch(`${baseUrl}?data=${encodeURIComponent(query)}`);
                        if (!response.ok) {
                            throw new Error(`Overpass error from ${baseUrl}`);
                        }
                        data = await response.json();
                        break;
                    } catch (err) {
                        console.warn('Overpass endpoint failed:', baseUrl, err);
                        lastError = err;
                    }
                }

                if (!data) throw lastError || new Error('All Overpass endpoints failed');
                console.log("Raw Overpass data elements count:", data.elements?.length);

                const nearbyMosques = data.elements
                    .filter(el => {
                        const tags = el.tags || {};
                        const name = (tags.name || '').toLowerCase();
                        const amenity = (tags.amenity || '').toLowerCase();
                        const religion = (tags.religion || '').toLowerCase();
                        const building = (tags.building || '').toLowerCase();
                        const highway = (tags.highway || '').toLowerCase();
                        
                        // Exclude non-mosque entities that might have "mosque" in name (like streets)
                        if (highway || tags.shop || tags.office || tags.tourism === 'hotel') return false;
                        
                        // Fix for the "Menoufia University" issue: 
                        // "جامعة" (University) contains "جامع" (Mosque/Friday Mosque)
                        // We must explicitly exclude "جامعة"
                        if (name.includes('جامعة') || name.includes('university')) return false;

                        const isMuslim = ['muslim', 'islam', 'إسلام', 'مسلم', 'إسلامي', 'اسلامي'].includes(religion);
                        const isMosqueAmenity = amenity === 'mosque' || amenity === 'place_of_worship';
                        const isMosqueBuilding = building === 'mosque' || building === 'place_of_worship';
                        
                        // Improved mosque name check:
                        // Matches "مسجد" or "جامع" but avoids "جامعة"
                        const hasMosqueInName = /مسجد|جامع/i.test(name);
                        
                        // Exclude if explicitly not Muslim
                        const isOtherReligion = religion && !isMuslim && religion !== '';
                        if (isOtherReligion) return false;

                        // Final check: It must be a mosque amenity, a mosque building, 
                        // or have a mosque keyword in the name (and not be a university/other religion)
                        return (isMosqueAmenity && (isMuslim || !religion)) || 
                               (isMosqueBuilding) || 
                               (hasMosqueInName && (isMuslim || !religion));
                    })
                    .map(el => {
                        const lat = el.lat || (el.center && el.center.lat);
                        const lon = el.lon || (el.center && el.center.lon);
                        const distance = calculateDistance(latitude, longitude, lat, lon);
                        return {
                            id: `${el.type}-${el.id}`, // Unique composite ID
                            name: el.tags.name || (lang === 'ar' ? 'مسجد' : 'Mosque'),
                            lat,
                            lon,
                            distance,
                            address: el.tags['addr:street'] || el.tags['addr:full'] || ''
                        };
                    })
                    // لا نُبقي إلا المساجد التي تبعد 5 كم أو أقل
                    .filter(m => m.distance <= MAX_DISTANCE_KM)
                    // Deduplicate by name and approximate location to handle overlapping node/way
                    .filter((mosque, index, self) => 
                        index === self.findIndex((m) => (
                            m.name === mosque.name && Math.abs(m.distance - mosque.distance) < 0.01
                        ))
                    )
                    .sort((a, b) => a.distance - b.distance);

                console.log("Filtered mosques count:", nearbyMosques.length);
                setMosques(nearbyMosques);
            } catch (err) {
                console.error("Mosque fetch error:", err);
                setError(lang === 'ar' ? 'فشل جلب بيانات المساجد. يرجى المحاولة لاحقاً.' : 'Failed to fetch mosques. Please try again later.');
            } finally {
                setLoading(false);
            }
        }, (err) => {
            console.error("Geolocation error:", err);
            setError(lang === 'ar' ? 'يرجى السماح بالوصول لموقعك الجغرافي للبحث عن المساجد.' : 'Please allow location access to find nearby mosques.');
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchMosques();
    }, []);

    const openInGoogleMaps = (lat, lon) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`, '_blank');
    };

    return (
        <div className="container animate-slide-down mosque-container" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
            <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-primary-10 rounded-full flex items-center justify-center mb-4">
                    <MosqueIcon size={32} className="text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">{lang === 'ar' ? 'أقرب مسجد' : 'Nearest Mosque'}</h1>
                <p className="text-muted">
                    {lang === 'ar'
                        ? `ابحث عن المساجد القريبة منك في محيط ${MAX_DISTANCE_KM} كم تقريباً (مساجد كبيرة وصغيرة).`
                        : `Find mosques around you within ~${MAX_DISTANCE_KM} km (large and small mosques).`}
                </p>
            </div>

            {/* Map Section */}
            <div className="card mb-8 overflow-hidden" style={{ height: '300px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                {!loading && userLocation ? (
                    <MapContainer center={mapCenter} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                        <ChangeView center={mapCenter} zoom={14} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        <Marker position={[userLocation.lat, userLocation.lng]}>
                            <Popup>{lang === 'ar' ? 'موقعي' : 'My Location'}</Popup>
                        </Marker>
                        {mosques.map(mosque => (
                            <Marker 
                                key={mosque.id} 
                                position={[mosque.lat, mosque.lon]}
                                icon={mosqueMarkerIcon}
                            >
                                <Popup>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{mosque.name}</div>
                                        <div style={{ fontSize: '0.8rem' }}>{mosque.distance} {lang === 'ar' ? 'كم' : 'km'}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                ) : (
                    <div className="flex items-center justify-center h-100 bg-surface-hover">
                         <RefreshCw size={24} className="animate-spin text-primary" />
                    </div>
                )}
            </div>

            <div className="flex justify-center mb-8">
                <button 
                    onClick={fetchMosques} 
                    className="btn btn-outline flex items-center gap-2"
                    disabled={loading}
                    style={{ borderRadius: '100px' }}
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    {lang === 'ar' ? 'تحديث البحث' : 'Refresh Search'}
                </button>
            </div>

            {loading ? (
                <div className="text-center p-10">
                    <RefreshCw size={48} className="animate-spin text-primary mx-auto mb-4" />
                    <p>{lang === 'ar' ? 'جاري البحث عن المساجد القريبة...' : 'Searching for nearby mosques...'}</p>
                </div>
            ) : error ? (
                <div className="empty-state">
                    <MapPin size={48} className="text-muted mx-auto mb-4" />
                    <p>{error}</p>
                </div>
            ) : (
                <div className="mosque-list">
                    {mosques.length === 0 && (
                         <div className="empty-state">
                            <MosqueIcon size={48} className="text-muted mx-auto mb-4" />
                            <p>{lang === 'ar' ? 'لم يتم العثور على مساجد في محيط منطقتك.' : 'No mosques found in your area.'}</p>
                        </div>
                    )}
                    {mosques.map((mosque) => (
                        <div key={mosque.id} className="mosque-card animate-slide-up" style={{ cursor: 'default' }}>
                            <div className="mosque-info">
                                <div className="mosque-name">{mosque.name}</div>
                                {mosque.address && <div className="text-sm text-muted mb-2">{mosque.address}</div>}
                                <div className="mosque-distance">
                                    <Navigation size={14} />
                                    <span>{mosque.distance} {lang === 'ar' ? 'كم' : 'km'}</span>
                                </div>
                            </div>
                            <div className="mosque-actions">
                                <button 
                                    className="maps-btn"
                                    onClick={() => openInGoogleMaps(mosque.lat, mosque.lon)}
                                >
                                    <ExternalLink size={16} />
                                    <span>{lang === 'ar' ? 'خرائط جوجل' : 'Google Maps'}</span>
                                </button>
                                <button 
                                    className="btn btn-primary p-2 rounded-full"
                                    onClick={() => setMapCenter([mosque.lat, mosque.lon])}
                                    title={lang === 'ar' ? 'عرض على الخريطة' : 'Show on Map'}
                                >
                                    <MapPin size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NearestMosque;
