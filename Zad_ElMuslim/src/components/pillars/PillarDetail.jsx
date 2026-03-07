import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PillarDetail = ({ pillar, onClose }) => {
    const { lang } = useLanguage();

    return (
        <div className="pillar-detail animate-slide-down">
            <div className="flex items-center gap-4 mb-6 pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button onClick={onClose} className="btn btn-outline flex items-center p-2 rounded-full">
                    {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                </button>
                <div style={{ fontSize: '2rem' }}>{pillar.icon}</div>
                <h2 style={{ margin: 0 }}>{lang === 'ar' ? pillar.title : pillar.titleEn}</h2>
            </div>

            <div className="card p-6" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h3 className="mb-4 text-primary">{lang === 'ar' ? 'المعنى والأهمية' : 'Meaning & Importance'}</h3>
                <p className="leading-loose mb-6 text-justify">
                    {lang === 'ar' ? pillar.details.meaning : pillar.details.meaningEn}
                </p>

                <h3 className="mb-4 text-primary">{lang === 'ar' ? 'من القرآن والسنة' : 'From Quran & Sunnah'}</h3>
                <div className="p-4 bg-surface-hover rounded-lg mb-6 border border-border">
                    <p className="quran-text text-xl leading-loose text-center mb-2" style={{ color: 'var(--color-accent)' }}>
                        "{pillar.details.evidence}"
                    </p>
                    <p className="text-sm text-center text-muted">[{lang === 'ar' ? pillar.details.evidenceSource : pillar.details.evidenceSourceEn}]</p>
                </div>

                <h3 className="mb-4 text-primary">{lang === 'ar' ? 'كيفية التطبيق' : 'How to apply'}</h3>
                <ul className="list-disc mx-6 space-y-2 leading-relaxed">
                    {(lang === 'ar' ? pillar.details.steps : pillar.details.stepsEn).map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PillarDetail;
