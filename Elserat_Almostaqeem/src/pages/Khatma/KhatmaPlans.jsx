import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Flame } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getKhatmaPlanById, getKhatmaPlans, getPlanProgressKey, getLastActivePlanKey } from '../../data/khatmaPlans';

const KHATMA_DUA_AR = `اللَّهُمَّ ارْحَمْنِي بِالْقُرْآنِ، وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً.
اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ، وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ، وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ، وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ الْعَالَمِينَ.
اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَالْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ.`;

function loadProgress(planId, tasksCount) {
  const raw = localStorage.getItem(getPlanProgressKey(planId));
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const sanitized = {};
    for (let i = 1; i <= tasksCount; i++) {
      sanitized[i] = typeof parsed[i] === 'string' ? parsed[i] : null;
    }
    return sanitized;
  } catch (_) {
    return {};
  }
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getStreakFromProgress(progressMap) {
  const uniqueDates = new Set(
    Object.values(progressMap || {})
      .filter(Boolean)
      .map((iso) => String(iso).slice(0, 10))
  );

  if (!uniqueDates.size) return 0;

  const now = new Date();
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let streak = 0;

  // If today is not done, allow counting from yesterday
  const today = todayKey(cursor);
  if (!uniqueDates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = todayKey(cursor);
    if (!uniqueDates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function KhatmaPlans() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const plans = useMemo(() => getKhatmaPlans(), []);
  const initialPlanId = localStorage.getItem(getLastActivePlanKey()) || plans[0]?.id || '30d';
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);
  const selectedPlan = useMemo(() => getKhatmaPlanById(selectedPlanId), [selectedPlanId]);
  const [progressMap, setProgressMap] = useState(() => loadProgress(selectedPlanId, selectedPlan?.tasks.length || 0));
  const [showDua, setShowDua] = useState(false);

  useEffect(() => {
    localStorage.setItem(getLastActivePlanKey(), selectedPlanId);
  }, [selectedPlanId]);

  const switchPlan = (planId) => {
    setSelectedPlanId(planId);
    localStorage.setItem(getLastActivePlanKey(), planId);
    const plan = getKhatmaPlanById(planId);
    setProgressMap(loadProgress(planId, plan?.tasks.length || 0));
    setShowDua(false);
  };

  const completedCount = selectedPlan?.tasks.filter((t) => !!progressMap[t.day]).length || 0;
  const progressPercent = selectedPlan ? Math.round((completedCount / selectedPlan.tasks.length) * 100) : 0;
  const streakDays = getStreakFromProgress(progressMap);

  const allDone = selectedPlan ? completedCount === selectedPlan.tasks.length : false;

  return (
    <div className="container animate-slide-down" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/khatma')} className="icon-btn" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          {lang === 'ar' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{lang === 'ar' ? 'خطط ختم القرآن' : 'Quran Khatma Plans'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => switchPlan(plan.id)}
            className="card"
            style={{
              padding: '1rem',
              cursor: 'pointer',
              border: selectedPlanId === plan.id ? '2px solid var(--gold-main, #D4AF37)' : '1px solid var(--color-border)',
              background: selectedPlanId === plan.id ? 'rgba(212,175,55,0.08)' : 'var(--color-surface)'
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{lang === 'ar' ? plan.titleAr : plan.titleEn}</div>
            <div style={{ marginTop: '0.35rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              {lang === 'ar' ? `${plan.days} يوم` : `${plan.days} days`}
            </div>
          </button>
        ))}
      </div>

      {selectedPlan && (
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--gold-main, #D4AF37)"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.4s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <strong style={{ fontSize: '1.25rem' }}>{progressPercent}%</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{lang === 'ar' ? 'التقدم' : 'Progress'}</span>
              </div>
            </div>

            <div>
              <h3 style={{ margin: 0 }}>{lang === 'ar' ? selectedPlan.titleAr : selectedPlan.titleEn}</h3>
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{completedCount}/{selectedPlan.tasks.length}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-text)' }}>
                  <Flame size={15} color="#ef4444" />
                  {lang === 'ar' ? `نشاط: ${streakDays} يوم` : `Streak: ${streakDays} days`}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {selectedPlan.tasks.map((task) => (
              <div key={task.day} className="card" style={{ padding: '0.8rem', display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: '0.6rem' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {lang === 'ar'
                      ? `اليوم ${task.day}: الجزء ${task.juzStart}${task.juzStart !== task.juzEnd ? ` - ${task.juzEnd}` : ''}`
                      : `Day ${task.day}: Juz ${task.juzStart}${task.juzStart !== task.juzEnd ? ` - ${task.juzEnd}` : ''}`}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    {lang === 'ar' ? `من صفحة ${task.startPage} إلى ${task.endPage}` : `Pages ${task.startPage} to ${task.endPage}`}
                  </div>
                </div>

                <button
                  className="btn btn-outline"
                  style={{ borderRadius: '999px', padding: '0.45rem 0.8rem' }}
                  onClick={() =>
                    navigate(`/quran?planId=${selectedPlan.id}&task=${task.day}&startPage=${task.startPage}&endPage=${task.endPage}`)
                  }
                >
                  <BookOpen size={16} />
                  {lang === 'ar' ? 'ابدأ' : 'Read'}
                </button>

                <div
                  className="btn"
                  style={{
                    borderRadius: '999px',
                    padding: '0.45rem 0.8rem',
                    background: progressMap[task.day] ? 'var(--color-primary)' : 'var(--color-surface-hover)',
                    color: progressMap[task.day] ? '#fff' : 'var(--color-text-muted)',
                    cursor: 'default'
                  }}
                >
                  <CheckCircle2 size={16} />
                  {progressMap[task.day] ? (lang === 'ar' ? 'تم من القارئ' : 'Completed in reader') : (lang === 'ar' ? 'يتم تلقائيًا' : 'Auto in reader')}
                </div>
              </div>
            ))}
          </div>

          {allDone && (
            <div style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" style={{ width: '100%', borderRadius: '14px' }} onClick={() => setShowDua(true)}>
                {lang === 'ar' ? 'تمت الخطة - عرض دعاء ختم القرآن' : 'Plan Completed - Show Khatm Dua'}
              </button>
            </div>
          )}
        </div>
      )}

      {showDua && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content animate-scale-in" style={{ maxWidth: '680px' }}>
            <h3 className="quran-text" style={{ marginBottom: '0.8rem', fontSize: '1.5rem' }}>
              {lang === 'ar' ? 'دعاء ختم القرآن' : 'Khatm al-Quran Dua'}
            </h3>
            <p className="quran-text" style={{ whiteSpace: 'pre-line', lineHeight: 2 }}>
              {KHATMA_DUA_AR}
            </p>
            <button className="btn btn-primary" onClick={() => setShowDua(false)} style={{ marginTop: '1rem' }}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
