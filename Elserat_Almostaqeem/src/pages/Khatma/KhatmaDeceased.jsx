import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, ArrowLeft, Heart, CheckCircle2, Circle, Plus, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Khatma.css';

const KhatmaDeceased = () => {
    const { lang } = useLanguage();
    const navigate = useNavigate();
    const [khatmas, setKhatmas] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [activeKhatma, setActiveKhatma] = useState(null);
    const [showNameModal, setShowNameModal] = useState(false);
    const [selectedPart, setSelectedPart] = useState(null);
    const [readerName, setReaderName] = useState('');
    const [nameError, setNameError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('zad_khatmas_deceased');
        if (stored) {
            try {
                setKhatmas(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse Khatmas", e);
            }
        }
    }, []);

    const saveKhatmas = (updated) => {
        setKhatmas(updated);
        localStorage.setItem('zad_khatmas_deceased', JSON.stringify(updated));
    };

    const handleCreate = (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        const newK = {
            id: Date.now().toString(),
            name: newName.trim(),
            createdAt: new Date().toISOString(),
            parts: Array.from({ length: 30 }, (_, i) => ({
                id: i + 1,
                status: 'available', // 'available', 'reserved', 'completed'
                reservedBy: null
            }))
        };

        const updated = [newK, ...khatmas];
        saveKhatmas(updated);
        setNewName('');
        setShowCreate(false);
        setActiveKhatma(newK.id);
    };

    const togglePartStatus = (partId) => {
        if (!activeKhatma) return;

        const updatedKhatmas = khatmas.map(k => {
            if (k.id === activeKhatma) {
                const updatedParts = k.parts.map(p => {
                    if (p.id === partId) {
                        // Cycle: available -> reserved -> completed -> available
                        let nextStatus = 'reserved';
                        if (p.status === 'reserved') nextStatus = 'completed';
                        else if (p.status === 'completed') nextStatus = 'available';
                        return { ...p, status: nextStatus };
                    }
                    return p;
                });
                return { ...k, parts: updatedParts };
            }
            return k;
        });

        saveKhatmas(updatedKhatmas);
    };

    const currentKhatma = khatmas.find(k => k.id === activeKhatma);

    const handleShare = async () => {
        if (!currentKhatma) return;
        
        const text = lang === 'ar' 
            ? `شارك في ختمة المرحوم/ة بإذن الله: ${currentKhatma.name}. احجز جزئك الآن.`
            : `Join the Khatma for the deceased: ${currentKhatma.name}. Reserve your Juz now.`;
            
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Zad El Muslim Khatma',
                    text: text,
                    url: window.location.href, // In real app, this would be a deep link
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            alert(text); // Fallback
        }
    };

    const handlePartClick = (part) => {
        if (!activeKhatma || !currentKhatma) return;

        // لو الجزء متاح نفتح نافذة إدخال الاسم من داخل الموقع
        if (part.status === 'available') {
            setSelectedPart(part);
            setReaderName('');
            setNameError('');
            setShowNameModal(true);
            return;
        }

        // لو محجوز أو مكتمل بالفعل، نذهب مباشرة لقراءة الجزء
        const params = new URLSearchParams({
            khatmaType: 'deceased',
            khatmaId: activeKhatma,
            part: String(part.id),
        });
        navigate(`/quran?${params.toString()}`);
    };

    const handleConfirmReader = () => {
        const trimmed = readerName.trim();
        if (!trimmed || !selectedPart || !activeKhatma || !currentKhatma) return;

        // تحقق إن كان هذا الاسم حجز جزءاً آخر من قبل في نفس الختمة
        const alreadyHasPart = currentKhatma.parts.some(
            (p) =>
                p.reservedBy &&
                p.reservedBy.trim() === trimmed &&
                p.id !== selectedPart.id
        );

        if (alreadyHasPart) {
            setNameError(
                lang === 'ar'
                    ? 'هذا الاسم مسجَّل بالفعل على جزء آخر في هذه الختمة.'
                    : 'This name already has another Juz reserved in this Khatma.'
            );
            return;
        }

        const updatedKhatmas = khatmas.map(k => {
            if (k.id === activeKhatma) {
                const updatedParts = k.parts.map(p => {
                    if (p.id === selectedPart.id) {
                        return { ...p, status: 'reserved', reservedBy: trimmed };
                    }
                    return p;
                });
                return { ...k, parts: updatedParts };
            }
            return k;
        });

        saveKhatmas(updatedKhatmas);
        setShowNameModal(false);

        const params = new URLSearchParams({
            khatmaType: 'deceased',
            khatmaId: activeKhatma,
            part: String(selectedPart.id),
        });
        navigate(`/quran?${params.toString()}`);
    };

    const handleDeleteKhatma = () => {
        if (!currentKhatma) return;
        setShowDeleteModal(true);
    };

    const confirmDeleteKhatma = () => {
        if (!currentKhatma) return;
        const updated = khatmas.filter(k => k.id !== currentKhatma.id);
        saveKhatmas(updated);
        setActiveKhatma(null);
        setShowDeleteModal(false);
    };

    if (activeKhatma && currentKhatma) {
        const completedCount = currentKhatma.parts.filter(p => p.status === 'completed').length;
        const progress = Math.round((completedCount / 30) * 100);

        return (
            <div className="container animate-slide-down" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
                <button onClick={() => setActiveKhatma(null)} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderRadius: '100px', padding: '0.5rem 1rem' }}>
                    {lang === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                    {lang === 'ar' ? 'عودة للختمات' : 'Back to Khatmas'}
                </button>

                <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '2rem', borderTop: '4px solid var(--color-primary)' }}>
                    <Heart size={40} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#FDE68A', textShadow: '0 0 6px rgba(0,0,0,0.4)' }}>
                        {lang === 'ar' ? 'ختمة لروح' : 'Khatma for'}
                    </h2>
                    <h1
                        style={{
                            fontSize: '2.6rem',
                            margin: '0 0 1rem 0',
                            color: '#FACC15',
                            textShadow: '0 0 10px rgba(0,0,0,0.7)',
                            letterSpacing: '0.03em'
                        }}
                    >
                        {currentKhatma.name}
                    </h1>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <button onClick={handleShare} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '100px' }}>
                            <Share2 size={18} />
                            {lang === 'ar' ? 'مشاركة الرابط' : 'Share Link'}
                        </button>
                        <button
                            onClick={handleDeleteKhatma}
                            className="btn btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: '100px', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                        >
                            {lang === 'ar' ? 'إلغاء الختمة' : 'Delete Khatma'}
                        </button>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            <span>{lang === 'ar' ? 'نسبة الإنجاز' : 'Completion'}</span>
                            <span>{progress}%</span>
                        </div>
                        <div style={{ height: '8px', backgroundColor: 'rgba(250, 204, 21, 0.12)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border-gold, #FACC15)' }}>
                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-main, #FACC15)', transition: 'width 0.5s ease' }}></div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-border)' }}></div> {lang === 'ar' ? 'متاح' : 'Available'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }}></div> {lang === 'ar' ? 'محجوز' : 'Reserved'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }}></div> {lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
                        {currentKhatma.parts.map(p => (
                            <button
                                key={p.id}
                                onClick={() => handlePartClick(p)}
                                className="card"
                                style={{
                                    padding: '1rem 0.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    border: p.status === 'completed' ? '2px solid var(--color-primary)' : p.status === 'reserved' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                    backgroundColor: p.status === 'completed' ? 'var(--color-primary-10)' : p.status === 'reserved' ? 'rgba(201, 162, 77, 0.1)' : 'var(--color-surface)',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>{p.id}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{lang === 'ar' ? 'الجزء' : 'Juz'}</span>
                                {p.reservedBy && (
                                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text)' }}>
                                        {p.reservedBy}
                                    </span>
                                )}
                                {p.status === 'completed' ? <CheckCircle2 size={18} color="var(--color-primary)" /> : p.status === 'reserved' ? <Circle size={18} color="var(--color-accent)" fill="var(--color-accent)" /> : <Circle size={18} color="var(--color-border)" />}
                            </button>
                        ))}
                    </div>

                    {showNameModal && selectedPart && (
                        <div className="khatma-modal-backdrop">
                            <div className="khatma-modal">
                                <h3 className="khatma-modal-title">
                                    {lang === 'ar'
                                        ? `حجز الجزء رقم ${selectedPart.id}`
                                        : `Reserve Juz ${selectedPart.id}`}
                                </h3>
                                <p className="khatma-modal-text">
                                    {lang === 'ar'
                                        ? 'اكتب اسمك ليظهر في الختمة أمام هذا الجزء:'
                                        : 'Enter your name to show it next to this Juz in the Khatma:'}
                                </p>
                                <input
                                    className="khatma-modal-input"
                                    type="text"
                                    value={readerName}
                                    onChange={(e) => setReaderName(e.target.value)}
                                    placeholder={lang === 'ar' ? 'اكتب اسمك هنا...' : 'Type your name here...'}
                                />
                                {nameError && (
                                    <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
                                        {nameError}
                                    </p>
                                )}
                                <div className="khatma-modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={() => setShowNameModal(false)}
                                    >
                                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={!readerName.trim()}
                                        onClick={handleConfirmReader}
                                    >
                                        {lang === 'ar' ? 'ابدأ القراءة' : 'Start Reading'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showDeleteModal && currentKhatma && (
                    <div className="khatma-modal-backdrop">
                        <div className="khatma-modal">
                            <h3 className="khatma-modal-title">
                                {lang === 'ar' ? 'تأكيد حذف الختمة' : 'Confirm Khatma deletion'}
                            </h3>
                            <p className="khatma-modal-text">
                                {lang === 'ar'
                                    ? `هل أنت متأكد من حذف الختمة "${currentKhatma.name}" وجميع الأجزاء المرتبطة بها؟`
                                    : `Are you sure you want to delete the Khatma "${currentKhatma.name}" and all its parts?`}
                            </p>
                            <div className="khatma-modal-actions">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowDeleteModal(false)}
                                >
                                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                                    onClick={confirmDeleteKhatma}
                                >
                                    {lang === 'ar' ? 'نعم، حذف الختمة' : 'Yes, delete it'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container animate-slide-down" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/khatma')} className="icon-btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                </button>
                <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{lang === 'ar' ? 'ختمة المتوفى' : 'Khatma for the Deceased'}</h1>
            </div>

            {showCreate ? (
                <form onSubmit={handleCreate} className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h3 style={{ marginTop: 0 }}>{lang === 'ar' ? 'إنشاء ختمة جديدة' : 'Create New Khatma'}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{lang === 'ar' ? 'اسم المتوفى (رحمه الله)' : 'Name of Deceased'}</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder={lang === 'ar' ? 'أدخل الاسم هنا...' : 'Enter name here...'}
                            style={{ padding: '0.8rem 1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', background: 'var(--color-background)', fontSize: '1rem', color: 'var(--color-text)' }}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" disabled={!newName.trim()} className="btn btn-primary" style={{ flex: 1, padding: '0.8rem', borderRadius: 'var(--radius-lg)' }}>
                                {lang === 'ar' ? 'إنشاء' : 'Create'}
                            </button>
                            <button type="button" onClick={() => setShowCreate(false)} className="btn btn-outline" style={{ flex: 1, padding: '0.8rem', borderRadius: 'var(--radius-lg)' }}>
                                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <button onClick={() => setShowCreate(true)} className="card" style={{ width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '2px dashed var(--color-primary)', background: 'var(--color-primary-10)', cursor: 'pointer', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '24px', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={24} />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{lang === 'ar' ? 'إنشاء ختمة جديدة' : 'Create New Khatma'}</span>
                </button>
            )}

            {khatmas.length > 0 && (
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>{lang === 'ar' ? 'الختمات الحالية' : 'Active Khatmas'}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {khatmas.map(k => {
                            const completedCount = k.parts.filter(p => p.status === 'completed').length;
                            const progress = Math.round((completedCount / 30) * 100);
                            
                            return (
                                <button key={k.id} onClick={() => setActiveKhatma(k.id)} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer', textAlign: lang === 'ar' ? 'right' : 'left' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#FACC15', textShadow: '0 0 6px rgba(0,0,0,0.6)' }}>{k.name}</h4>
                                        <ArrowLeft size={18} color="var(--color-text-muted)" style={{ transform: lang === 'ar' ? 'none' : 'rotate(180deg)' }} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                            <span>{progress}% {lang === 'ar' ? 'مكتمل' : 'Completed'}</span>
                                            <span>{completedCount}/30 {lang === 'ar' ? 'جزء' : 'Juz'}</span>
                                        </div>
                                        <div style={{ height: '6px', backgroundColor: 'rgba(250, 204, 21, 0.12)', borderRadius: '999px', overflow: 'hidden', border: '1px solid var(--border-gold, #FACC15)' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--gold-main, #FACC15)' }}></div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
};

export default KhatmaDeceased;
