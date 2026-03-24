export const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 122, 142, 162, 182, 202, 222, 242, 262, 282,
  302, 322, 342, 362, 382, 402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

const PLAN_CONFIG = [
  { id: '30d', days: 30, titleAr: 'خطة 30 يوم', titleEn: '30 Days Plan', distribution: Array(30).fill(1) },
  { id: '15d', days: 15, titleAr: 'خطة 15 يوم', titleEn: '15 Days Plan', distribution: Array(15).fill(2) },
  { id: '10d', days: 10, titleAr: 'خطة 10 أيام', titleEn: '10 Days Plan', distribution: Array(10).fill(3) },
  { id: '7d', days: 7, titleAr: 'خطة 7 أيام', titleEn: '7 Days Plan', distribution: [5, 5, 4, 4, 4, 4, 4] }
];

function buildTasks(distribution) {
  let currentJuz = 1;
  return distribution.map((count, idx) => {
    const juzStart = currentJuz;
    const juzEnd = Math.min(30, currentJuz + count - 1);
    const startPage = JUZ_START_PAGES[juzStart - 1];
    const endPage = juzEnd === 30 ? 604 : JUZ_START_PAGES[juzEnd] - 1;
    currentJuz = juzEnd + 1;
    return {
      day: idx + 1,
      juzStart,
      juzEnd,
      startPage,
      endPage
    };
  });
}

export function getKhatmaPlans() {
  return PLAN_CONFIG.map((p) => ({
    ...p,
    tasks: buildTasks(p.distribution)
  }));
}

export function getKhatmaPlanById(id) {
  return getKhatmaPlans().find((p) => p.id === id) || null;
}

export function getPlanProgressKey(id) {
  return `zad_khatma_plan_progress_${id}`;
}

export function getLastActivePlanKey() {
  return 'zad_khatma_last_active_plan';
}
