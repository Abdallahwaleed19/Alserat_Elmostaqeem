const DEFAULT_DUA = {
  ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  en: 'Our Lord, grant us good in this world and good in the Hereafter, and protect us from the Fire.'
};

const FRIDAY_DUA = {
  ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ، وَارْزُقْنَا فِي الْجُمُعَةِ سَاعَةَ إِجَابَةٍ.',
  en: 'O Allah, send blessings upon Prophet Muhammad and grant us the blessed response hour of Friday.'
};

const DAILY_DUAS = [
  DEFAULT_DUA,
  {
    ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    en: 'O Allah, I ask You for guidance, piety, chastity, and contentment.'
  },
  {
    ar: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    en: 'O Turner of hearts, make my heart firm upon Your religion.'
  },
  {
    ar: 'اللَّهُمَّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    en: 'O Allah, forgive me, my parents, and all believers on the Day of Judgment.'
  }
];

const OCCASION_MESSAGES = {
  '9-27': {
    titleAr: 'ليلة القدر',
    titleEn: 'Laylat al-Qadr',
    dua: {
      ar: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ العَفْوَ فَاعْفُ عَنِّي',
      en: 'O Allah, You are Forgiving and love forgiveness, so forgive me.'
    }
  },
  '10-1': {
    titleAr: 'عيد الفطر',
    titleEn: 'Eid al-Fitr',
    dua: {
      ar: 'تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ صَالِحَ الْأَعْمَالِ',
      en: 'May Allah accept righteous deeds from us and you.'
    }
  },
  '12-9': {
    titleAr: 'يوم عرفة',
    titleEn: 'Day of Arafah',
    dua: {
      ar: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ',
      en: 'None has the right to be worshiped except Allah alone, without partner; to Him belongs all dominion and praise.'
    }
  },
  '12-10': {
    titleAr: 'عيد الأضحى',
    titleEn: 'Eid al-Adha',
    dua: {
      ar: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ',
      en: 'Allah is the Greatest, Allah is the Greatest, Allah is the Greatest, and all praise belongs to Allah.'
    }
  }
};

export function getDailyDua(date = new Date()) {
  const hash = date.getFullYear() + date.getMonth() + date.getDate();
  return DAILY_DUAS[hash % DAILY_DUAS.length] || DEFAULT_DUA;
}

export function getIslamicContext(date = new Date()) {
  const day = date.getDay();
  const isFriday = day === 5;
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric' }).formatToParts(date);
  const month = Number(parts.find((p) => p.type === 'month')?.value || 0);
  const monthDay = Number(parts.find((p) => p.type === 'day')?.value || 0);
  const key = `${month}-${monthDay}`;
  const occasion = OCCASION_MESSAGES[key] || null;

  const remindersAr = isFriday
    ? ['سورة الكهف', 'الإكثار من الصلاة على النبي ﷺ', 'تحري ساعة الإجابة']
    : [];
  const remindersEn = isFriday
    ? ['Read Surah Al-Kahf', 'Increase Salawat upon the Prophet', 'Seek the accepted dua hour']
    : [];

  return {
    isFriday,
    occasion,
    remindersAr,
    remindersEn,
    dua: occasion?.dua || (isFriday ? FRIDAY_DUA : getDailyDua(date))
  };
}
