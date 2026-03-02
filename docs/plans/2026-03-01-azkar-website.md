# Azkar Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a single-page Next.js website with 34 morning/evening Islamic azkar — Arabic text (RTL), Russian translation, repetition counter, and audio playback per azkar.

**Architecture:** Single-page app with tab switching between Morning / Evening azkar. Data is a static TypeScript array. Each azkar card: transliteration + Arabic (RTL) + Russian translation + counter (checkmark/dots/ring) + audio player. Audio files live in `/public/audio/azkar-NN.mp3` — gracefully hidden when missing.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, next/font (Noto Naskh Arabic for Arabic, Inter for UI)

---

## Task 1: Types + Data

**Files:**
- Create: `src/types/azkar.ts`
- Create: `src/data/azkar.ts`

**Step 1: Create types file**

```typescript
// src/types/azkar.ts
export type AzkarTime = 'morning' | 'evening' | 'both';

export interface AzkarItem {
  id: number;
  title: string;
  transliteration: string;
  arabic: string;
  translation: string;
  time: AzkarTime;
  count: number;
  audioFile?: string; // e.g. "azkar-01.mp3"
}
```

**Step 2: Create data file**

```typescript
// src/data/azkar.ts
import { AzkarItem } from '@/types/azkar';

export const azkarList: AzkarItem[] = [
  {
    id: 1,
    title: 'Аят аль-Курси',
    transliteration: 'Аъузу биллахи минаш-шайтанир-раджим. Аллаху ла иляха илля хуваль-хаййуль-каййум...',
    arabic: `أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ`,
    translation: 'Прибегаю к Аллаху от проклятого шайтана. Аллах — нет божества, кроме Него, Живого, Вечносущего. Его не постигают ни дремота, ни сон. Ему принадлежит то, что на небесах, и то, что на земле. Кто заступится перед Ним без Его дозволения? Он знает то, что было до них, и то, что будет после них. Они постигают из Его знания лишь то, что Он пожелает. Его Подножие объемлет небеса и землю, и Ему не в тягость охрана их. Он — Возвышенный, Великий.',
    time: 'both',
    count: 1,
    audioFile: 'azkar-01.mp3',
  },
  {
    id: 2,
    title: 'Аманар-расулу (2:285-286)',
    transliteration: 'Аманар-расулу бима унзиля иляйхи мир-раббихи валь-муъминун...',
    arabic: `آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ
لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ`,
    translation: 'Посланник уверовал в то, что ниспослано ему от его Господа, и верующие тоже. Все они уверовали в Аллаха, Его ангелов, Его Писания и Его посланников. Мы не делаем различий между Его посланниками. Они сказали: "Мы слышали и повинуемся. Прости нас, Господь наш, и к Тебе предстоит прибытие". Аллах не возлагает на человека сверх его возможностей...',
    time: 'evening',
    count: 1,
    audioFile: 'azkar-02.mp3',
  },
  {
    id: 3,
    title: 'Сура Аль-Ихлас (112)',
    transliteration: 'Бисмиллахир-рахманир-рахим. Куль хувалла-ху ахад. Аллахус-самад. Лям йалид валям йуляд. Валям йакулляху куфуван ахад.',
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ هُوَ اللَّهُ أَحَدٌ
اللَّهُ الصَّمَدُ
لَمْ يَلِدْ وَلَمْ يُولَدْ
وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ`,
    translation: 'Во имя Аллаха, Милостивого, Милосердного. Скажи: «Он — Аллах Единый, Аллах Вечный. Он не родил и не был рождён, и нет никого равного Ему».',
    time: 'both',
    count: 3,
    audioFile: 'azkar-03.mp3',
  },
  {
    id: 4,
    title: 'Сура Аль-Фаляк (113)',
    transliteration: 'Бисмиллахир-рахманир-рахим. Куль аъузу бираббиль-фаляк. Мин шарри ма халяк. Ва мин шарри гасикин иза вакаб. Ва мин шаррин-наффасати филь-укад. Ва мин шарри хасидин иза хасад.',
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ
مِن شَرِّ مَا خَلَقَ
وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ
وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ
وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ`,
    translation: 'Во имя Аллаха, Милостивого, Милосердного. Скажи: «Прибегаю к защите Господа рассвета от зла того, что Он сотворил, от зла мрака, когда он наступает, от зла тех, кто дует на узлы, от зла завистника, когда он завидует».',
    time: 'both',
    count: 3,
    audioFile: 'azkar-04.mp3',
  },
  {
    id: 5,
    title: 'Сура Ан-Нас (114)',
    transliteration: 'Бисмиллахир-рахманир-рахим. Куль аъузу бираббин-нас. Маликин-нас. Иляхин-нас. Мин шаррил-васвасиль-хаммас. Аллязи йувасвису фи судурин-нас. Миналь-джиннати ван-нас.',
    arabic: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
قُلْ أَعُوذُ بِرَبِّ النَّاسِ
مَلِكِ النَّاسِ
إِلَٰهِ النَّاسِ
مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ
مِنَ الْجِنَّةِ وَالنَّاسِ`,
    translation: 'Во имя Аллаха, Милостивого, Милосердного. Скажи: «Прибегаю к защите Господа людей, Царя людей, Бога людей, от зла искусителя-шайтана, который нашёптывает в груди людей, из числа джиннов и людей».',
    time: 'both',
    count: 3,
    audioFile: 'azkar-05.mp3',
  },
  {
    id: 6,
    title: 'Защита от тревоги и страха',
    transliteration: 'Аллахумма инни аъузу бика миналь-хамми валь-хазан, валь-аджзи валь-касаль, валь-бухли валь-джубни, ва даляиддайни ва галябатир-риджаль.',
    arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ`,
    translation: 'О Аллах! Прибегаю к Тебе от тревоги и печали, от слабости и лени, от скупости и трусости, от бремени долгов и власти людей надо мной.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-06.mp3',
  },
  {
    id: 7,
    title: 'Саййид аль-Истигфар',
    transliteration: 'Аллахумма Анта Рабби, ля иляха илля Анта, халяктани ва ана абдука, ва ана аля ахдика ва ваъдика мастатаъту. Аъузу бика мин шарри ма санаъту, абуу ляка бинъматика аляйя, ва абуу бизанби, фагфир ли, фаиннаху ля йагфируз-зунуба илля Анта.',
    arabic: `اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ`,
    translation: 'О Аллах! Ты — мой Господь. Нет бога, кроме Тебя. Ты создал меня, и я — Твой раб. Я буду верен своему завету с Тобой, насколько хватит моих сил. Прибегаю к Тебе от зла того, что я совершил. Признаю Твои милости ко мне и признаю свои грехи. Прости меня, ибо никто не прощает грехи, кроме Тебя.',
    time: 'both',
    count: 1,
    audioFile: 'azkar-07.mp3',
  },
  {
    id: 8,
    title: 'Хасбияллах',
    transliteration: 'Хасбияллаху ля иляха илля хува, алейхи таваккальту, ва хува Раббуль-аршиль-азым.',
    arabic: `حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ`,
    translation: 'Достаточно мне Аллаха, нет бога, кроме Него. На Него я уповаю, и Он — Господь Великого Трона.',
    time: 'both',
    count: 7,
    audioFile: 'azkar-08.mp3',
  },
  {
    id: 9,
    title: 'Свидетельство о таухиде',
    transliteration: 'Аллахумма инни асбахту ушхидука (вечером: амсайту), ва ушхиду хамалята аршика ва малаикатака ва джамиа халькика, аннака Анталлаху ля иляха илля Анта вахдака ля шарика ляк, ва анна Мухаммадан абдука ва расулюк.',
    arabic: `اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ`,
    translation: 'О Аллах! Утром (вечером) я призываю Тебя в свидетели, и ангелов-носителей Твоего Трона, и всё Твоё творение в свидетели того, что Ты — Аллах, нет бога, кроме Тебя Единого, нет у Тебя сотоварища, и что Мухаммад — Твой раб и Твой посланник.',
    time: 'both',
    count: 4,
    audioFile: 'azkar-09.mp3',
  },
  {
    id: 10,
    title: 'Утреннее поминание',
    transliteration: 'Аллахумма бика асбахна, ва бика амсайна, ва бика нахйа, ва бика намуту, ва иляйкан-нушур.',
    arabic: `اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ`,
    translation: 'О Аллах! С Твоей помощью мы вступили в утро, с Твоей помощью вступаем в вечер, с Твоей помощью живём, с Твоей помощью умираем, и к Тебе воскрешение.',
    time: 'morning',
    count: 1,
    audioFile: 'azkar-10.mp3',
  },
  {
    id: 11,
    title: 'Признание благ Аллаха',
    transliteration: 'Аллахумма ма асбаха би (вечером: амса би) мин ниъматин ав биахадин мин халькика фаминка вахдака ля шарика ляк, фалякаль-хамду ва лякаш-шукр.',
    arabic: `اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الْشُّكْرُ`,
    translation: 'О Аллах! Любые блага, что у меня есть утром (вечером) или у кого-либо из Твоих творений, — всё от Тебя Единого, нет у Тебя сотоварища. Хвала Тебе и благодарность.',
    time: 'both',
    count: 1,
    audioFile: 'azkar-11.mp3',
  },
  {
    id: 12,
    title: 'На фитре Ислама',
    transliteration: 'Асбахна (вечером: амсайна) аля фитратиль-ислами, ва аля калиматиль-ихляс, ва аля дини набиййина Мухаммадин, ва аля миллати абина Ибрахима ханифан муслиман вама кана миналь-мушрикин.',
    arabic: `أَصْبَحْنَا عَلَىٰ فِطْرَةِ الْإِسْلَامِ، وَعَلَىٰ كَلِمَةِ الْإِخْلَاصِ، وَعَلَىٰ دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَىٰ مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ`,
    translation: 'Мы вступили в утро (вечер) на природной вере Ислама, на слове искренности (шахаде), на религии нашего Пророка Мухаммада ﷺ, на вере нашего отца Ибрахима, который был правоверным мусульманином и не был многобожником.',
    time: 'both',
    count: 1,
    audioFile: 'azkar-12.mp3',
  },
  {
    id: 13,
    title: 'Знающий сокровенное',
    transliteration: 'Аллахумма алималь-гайби вашшахада, фатирас-самавати валь-ард, Рабба кулли шайъин ва маликаху, ашхаду алля иляха илля Анта, аъузу бика мин шарри нафси, ва мин шарришшайтани ва ширкихи, ва ан актарифа аля нафси суан, ав аджуррахуиля муслим.',
    arabic: `اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَىٰ نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَىٰ مُسْلِمٍ`,
    translation: 'О Аллах, Знающий сокровенное и явное, Творец небес и земли, Господь всего и Его Владыка! Свидетельствую, что нет бога, кроме Тебя. Прибегаю к Тебе от зла своей души, от зла шайтана и его многобожия, и от того, чтобы причинить себе зло или навлечь его на мусульманина.',
    time: 'both',
    count: 1,
    audioFile: 'azkar-13.mp3',
  },
  {
    id: 14,
    title: 'Бисмилляхи с защитой',
    transliteration: 'Бисмиллахиллязи ля йадурру маасмихи шайун филь-ард, валя фис-самаи, ва хувас-самиуль-алим.',
    arabic: `بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ`,
    translation: 'Во имя Аллаха, с именем Которого не причинит вреда ничто ни на земле, ни на небе, и Он — Слышащий, Знающий.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-14.mp3',
  },
  {
    id: 15,
    title: 'Довольство Аллахом',
    transliteration: 'Радыту биллахи Раббан, ва биль-ислами динан, ва биМухаммадин саллаллаху алейхи ва саллама набиййан.',
    arabic: `رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا`,
    translation: 'Я доволен Аллахом как Господом, Исламом как религией и Мухаммадом ﷺ как пророком.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-15.mp3',
  },
  {
    id: 16,
    title: 'Мольба к Живому Вечному',
    transliteration: 'Йа Хаййу йа Каййуму, бирахматика астагис, аслих ли шаъни куллаху, ва ля такильни иля нафси тарфата айн.',
    arabic: `يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ`,
    translation: 'О Живой, о Вечносущий! Прошу помощи через Твою милость. Исправь все мои дела и не оставляй меня на самого себя даже на мгновение.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-16.mp3',
  },
  {
    id: 17,
    title: 'СубханАллах по числу творений',
    transliteration: 'СубханАллахи ва бихамдихи, адада халькихи, ва рида нафсихи, ва зината аршихи, ва мидада калиматихи.',
    arabic: `سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ`,
    translation: 'Пречист Аллах и хвала Ему по числу Его творений, по Его довольству Собой, по весу Его Трона и по количеству Его слов.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-17.mp3',
  },
  {
    id: 18,
    title: 'Защита словами Аллаха',
    transliteration: 'Аъузу бикалиматиллахит-таммати мин шарри ма халяк.',
    arabic: `أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ`,
    translation: 'Прибегаю к совершенным словам Аллаха от зла того, что Он сотворил.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-18.mp3',
  },
  {
    id: 19,
    title: 'Прошение полезных знаний',
    transliteration: 'Аллахумма инни асалюка ильман нафиан, ва ризкан тайиббан, ва амалян мутакаббалан.',
    arabic: `اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا`,
    translation: 'О Аллах! Прошу Тебя о полезных знаниях, благом пропитании и принятом деянии.',
    time: 'morning',
    count: 3,
    audioFile: 'azkar-19.mp3',
  },
  {
    id: 20,
    title: 'Мольба о дозволенном',
    transliteration: 'Аллахуммакфини бихалялика ан харамик, ва агнини бифадлика аммэн сивак.',
    arabic: `اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ`,
    translation: 'О Аллах! Сделай так, чтобы дозволенное Тобой избавило меня от запретного, и обогати меня Своей щедростью так, чтобы я не нуждался ни в ком, кроме Тебя.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-20.mp3',
  },
  {
    id: 21,
    title: 'Власть принадлежит Аллаху',
    transliteration: 'Асбахна ва асбахаль-мульку лиллахи Раббиль-алямин. Аллахумма инни асалюка хайра хазаль-явми, фатхаху ва насраху ва нураху, ва баракатаху ва худаху, ва аъузу бика мин шарри ма фихи ва шарри ма бадаху.',
    arabic: `أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَٰذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ`,
    translation: 'Мы вступили в утро, и власть принадлежит Аллаху, Господу миров. О Аллах! Прошу Тебя о благе этого дня — его открытии, победе, свете, благодати и руководстве, и прибегаю к Тебе от зла того, что в нём, и зла того, что после него.',
    time: 'morning',
    count: 1,
    audioFile: 'azkar-21.mp3',
  },
  {
    id: 22,
    title: 'Ля иляха иллаллах (10 раз)',
    transliteration: 'Ля иляха иллаллаху, вахдаху ля шарика лях, ляхуль-мульку ва ляхуль-хамду ва хува аля кулли шайин кадир.',
    arabic: `لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ`,
    translation: 'Нет бога, кроме Аллаха Единого, нет у Него сотоварища. Ему принадлежит власть и хвала, и Он над каждой вещью Всемогущ.',
    time: 'both',
    count: 10,
    audioFile: 'azkar-22.mp3',
  },
  {
    id: 23,
    title: 'Утренняя хвала и защита',
    transliteration: 'Асбахна ва асбахаль-мульку лиллях, вальхамду лиллях... Рабби аъузу бика миналь-касали ва суиль-кибари, рабби аъузу бика мин азабин финнари ва азабин филь-кабри.',
    arabic: `أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَٰذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَٰذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ`,
    translation: 'Мы вступили в утро, власть принадлежит Аллаху, хвала Аллаху... Господь мой! Прошу Тебя о благе этого дня и того, что после него, и прибегаю от зла этого дня и того, что после него. Господь мой! Прибегаю к Тебе от лени и немощи в старости. Господь мой! Прибегаю к Тебе от мучений в огне и в могиле.',
    time: 'morning',
    count: 1,
    audioFile: 'azkar-23.mp3',
  },
  {
    id: 24,
    title: 'Прошение прощения и здравия',
    transliteration: 'Аллахумма инни асалюкаль-афва валь-афията фиддунйа валь-ахира. Аллахумма астурь аурати, ва амин равати. Аллахуммахфазни мин байни йадайя ва мин хальфи ва ан йамини ва ан шимали ва мин фавки, ва аъузу биазаматика ан угталя мин тахти.',
    arabic: `اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي`,
    translation: 'О Аллах! Прошу Тебя о прощении и здравии в этом мире и в будущем. О Аллах! Прошу прощения и здравия в моей религии, мирской жизни, семье и имуществе. О Аллах! Прикрой мои недостатки и успокой мои страхи. О Аллах! Охраняй меня спереди и сзади, справа и слева и сверху, и прибегаю к Твоему величию от неожиданного уничтожения снизу.',
    time: 'both',
    count: 1,
    audioFile: 'azkar-24.mp3',
  },
  {
    id: 25,
    title: 'Мольба о здоровье',
    transliteration: 'Аллахумма афини фи бадани, Аллахумма афини фи самъи, Аллахумма афини фи басари, ля иляха илля Анта. Аллахумма инни аъузу бика миналь-куфри валь-факр, ва аъузу бика мин азабиль-кабри, ля иляха илля Анта.',
    arabic: `اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ
اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ`,
    translation: 'О Аллах! Даруй здоровье моему телу. О Аллах! Даруй здоровье моему слуху. О Аллах! Даруй здоровье моему зрению. Нет бога, кроме Тебя. О Аллах! Прибегаю к Тебе от неверия и бедности, и прибегаю к Тебе от мучений в могиле. Нет бога, кроме Тебя.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-25.mp3',
  },
  {
    id: 26,
    title: 'Салават на Пророка',
    transliteration: 'Аллахумма салли ва саллим ва барик аля набиййина Мухаммад.',
    arabic: `اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ`,
    translation: 'О Аллах! Благослови, даруй мир и благодать нашему Пророку Мухаммаду.',
    time: 'both',
    count: 10,
    audioFile: 'azkar-26.mp3',
  },
  {
    id: 27,
    title: 'Защита от болезней',
    transliteration: 'Аллахумма инни аъузу бика миналь-Бараси, валь-Джунуни, валь-Джузами, ва мин саййиль-аскам.',
    arabic: `اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ`,
    translation: 'О Аллах! Прибегаю к Тебе от проказы, безумия, лепры и тяжёлых болезней.',
    time: 'both',
    count: 3,
    audioFile: 'azkar-27.mp3',
  },
  {
    id: 28,
    title: 'СубханАллах ва бихамдихи (100)',
    transliteration: 'СубханАллахи ва бихамдихи.',
    arabic: `سُبْحَانَ اللَّهِ وَبِحَمْدِهِ`,
    translation: 'Пречист Аллах и хвала Ему.',
    time: 'both',
    count: 100,
    audioFile: 'azkar-28.mp3',
  },
  {
    id: 29,
    title: 'АстагфируЛлах (100)',
    transliteration: 'АстагфируЛлаха ва атубу иляйхи.',
    arabic: `أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ`,
    translation: 'Прошу прощения у Аллаха и каюсь перед Ним.',
    time: 'both',
    count: 100,
    audioFile: 'azkar-29.mp3',
  },
  {
    id: 30,
    title: 'Ля хавля (100)',
    transliteration: 'Ля хавля ва ля куввата илля биллях.',
    arabic: `لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ`,
    translation: 'Нет силы и мощи, кроме как от Аллаха.',
    time: 'both',
    count: 100,
    audioFile: 'azkar-30.mp3',
  },
  {
    id: 31,
    title: 'Защита от огня',
    transliteration: 'Аллахумма аджирни минан-нар.',
    arabic: `اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ`,
    translation: 'О Аллах! Защити меня от огня (ада).',
    time: 'both',
    count: 7,
    audioFile: 'azkar-31.mp3',
  },
  {
    id: 32,
    title: 'Тасбих (100)',
    transliteration: 'СубханАллахи вальхамду лиллахи ва ля иляха иллаллаху вАллаху акбар.',
    arabic: `سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ`,
    translation: 'Пречист Аллах, хвала Аллаху, нет бога кроме Аллаха, Аллах Велик.',
    time: 'both',
    count: 100,
    audioFile: 'azkar-32.mp3',
  },
  {
    id: 33,
    title: 'Ля иляха иллаллах (100)',
    transliteration: 'Ля иляха иллаллах.',
    arabic: `لَا إِلَٰهَ إِلَّا اللَّهُ`,
    translation: 'Нет бога, кроме Аллаха.',
    time: 'both',
    count: 100,
    audioFile: 'azkar-33.mp3',
  },
  {
    id: 34,
    title: 'Ля иляха илля Анта (100)',
    transliteration: 'Ля иляха илля Анта субханака инни кунту миназ-залимин.',
    arabic: `لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ`,
    translation: 'Нет бога, кроме Тебя. Пречист Ты! Воистину, я был из числа несправедливых.',
    time: 'both',
    count: 100,
    audioFile: 'azkar-34.mp3',
  },
];

export const morningAzkar = azkarList.filter(
  (a) => a.time === 'morning' || a.time === 'both'
);

export const eveningAzkar = azkarList.filter(
  (a) => a.time === 'evening' || a.time === 'both'
);
```

**Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 4: Commit**

```bash
git add src/types/azkar.ts src/data/azkar.ts
git commit -m "feat: add azkar data types and all 34 azkar entries"
```

---

## Task 2: Arabic Font + Global Styles

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/globals.css` (replace existing)

**Step 1: Update layout.tsx with fonts**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

// Noto Naskh Arabic — clean, readable Arabic font
const notoNaskhArabic = localFont({
  src: [],  // will use Google Fonts via CSS @import
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: 'Азкары — Утренние и Вечерние',
  description: 'Утренние и вечерние азкары с арабским текстом, переводом и аудио',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

**Step 2: Write global CSS**

```css
/* src/app/globals.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg-primary: #0d1117;
  --bg-card: #161b22;
  --bg-card-hover: #1c2230;
  --border: #30363d;
  --text-primary: #e6edf3;
  --text-secondary: #8b949e;
  --text-arabic: #ffffff;
  --text-transliteration: #d4a843;
  --accent: #58a6ff;
  --accent-done: #3fb950;
  --accent-ring: #d4a843;
  --dot-empty: #30363d;
  --dot-filled: #d4a843;
  --tab-active-bg: #1c2a40;
  --tab-active-border: #58a6ff;
  --font-arabic: 'Noto Naskh Arabic', serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

.arabic {
  font-family: var(--font-arabic);
  direction: rtl;
  text-align: right;
  font-size: 1.5rem;
  line-height: 2.2;
  color: var(--text-arabic);
}
```

**Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: add Arabic font and dark spiritual theme CSS"
```

---

## Task 3: AzkarCounter Component

**Files:**
- Create: `src/components/AzkarCounter/AzkarCounter.tsx`
- Create: `src/components/AzkarCounter/AzkarCounter.module.css`

**Counter logic:**
- `count === 1` → single checkmark button
- `count > 1 && count <= 10` → row of dots (○ fills to ●)
- `count > 10` → circular ring progress (for 100)

**Step 1: Create component**

```tsx
// src/components/AzkarCounter/AzkarCounter.tsx
'use client';
import { useState, useCallback } from 'react';
import styles from './AzkarCounter.module.css';

interface AzkarCounterProps {
  total: number;
  onComplete?: () => void;
}

export default function AzkarCounter({ total, onComplete }: AzkarCounterProps) {
  const [current, setCurrent] = useState(0);
  const done = current >= total;

  const handleTap = useCallback(() => {
    if (done) return;
    const next = current + 1;
    setCurrent(next);
    if (next >= total) onComplete?.();
  }, [current, done, total, onComplete]);

  const handleReset = useCallback(() => {
    setCurrent(0);
  }, []);

  if (total === 1) {
    return (
      <div className={styles.wrapper}>
        <button
          className={`${styles.checkBtn} ${done ? styles.done : ''}`}
          onClick={done ? handleReset : handleTap}
          aria-label={done ? 'Прочитано. Нажмите чтобы сбросить' : 'Отметить как прочитанное'}
        >
          {done ? '✓' : '○'}
        </button>
      </div>
    );
  }

  if (total <= 10) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.dots} onClick={done ? handleReset : handleTap}>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`${styles.dot} ${i < current ? styles.dotFilled : ''}`}
            />
          ))}
        </div>
        <span className={styles.label}>
          {done ? (
            <button className={styles.resetBtn} onClick={handleReset}>↺ Сбросить</button>
          ) : (
            `${current} / ${total}`
          )}
        </span>
      </div>
    );
  }

  // Ring for 100
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (current / total) * circumference;

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.ringBtn} ${done ? styles.done : ''}`}
        onClick={done ? handleReset : handleTap}
        aria-label={`${current} из ${total}`}
      >
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="var(--dot-empty)"
            strokeWidth="4"
          />
          <circle
            cx="36" cy="36" r={radius}
            fill="none"
            stroke="var(--accent-ring)"
            strokeWidth="4"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
            style={{ transition: 'stroke-dasharray 0.2s ease' }}
          />
          <text
            x="36" y="36"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--text-primary)"
            fontSize="14"
            fontFamily="inherit"
          >
            {done ? '✓' : current}
          </text>
        </svg>
      </button>
      {!done && (
        <span className={styles.label}>{current} / {total}</span>
      )}
      {done && (
        <button className={styles.resetBtn} onClick={handleReset}>↺ Сбросить</button>
      )}
    </div>
  );
}
```

**Step 2: Create CSS module**

```css
/* src/components/AzkarCounter/AzkarCounter.module.css */
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
}

.checkBtn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--dot-empty);
  background: transparent;
  color: var(--text-secondary);
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkBtn:hover:not(.done) {
  border-color: var(--dot-filled);
  color: var(--dot-filled);
}

.checkBtn.done {
  border-color: var(--accent-done);
  background: var(--accent-done);
  color: white;
}

.dots {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  cursor: pointer;
  padding: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--dot-empty);
  transition: background 0.15s ease, transform 0.15s ease;
  display: inline-block;
}

.dotFilled {
  background: var(--dot-filled);
  transform: scale(1.15);
}

.label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.ringBtn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
}

.ringBtn.done circle:last-of-type {
  stroke: var(--accent-done);
}

.resetBtn {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s;
}

.resetBtn:hover {
  color: var(--text-primary);
}
```

**Step 3: Commit**

```bash
git add src/components/AzkarCounter/
git commit -m "feat: add AzkarCounter component (dots/checkmark/ring)"
```

---

## Task 4: AzkarAudio Component

**Files:**
- Create: `src/components/AzkarAudio/AzkarAudio.tsx`
- Create: `src/components/AzkarAudio/AzkarAudio.module.css`
- Create: `public/audio/.gitkeep`

**Audio files:** expected at `/public/audio/azkar-NN.mp3`. Component hides gracefully if file is absent (uses `onError`).

**Step 1: Create audio component**

```tsx
// src/components/AzkarAudio/AzkarAudio.tsx
'use client';
import { useRef, useState } from 'react';
import styles from './AzkarAudio.module.css';

interface AzkarAudioProps {
  src: string; // e.g. "/audio/azkar-01.mp3"
}

export default function AzkarAudio({ src }: AzkarAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const [progress, setProgress] = useState(0);

  if (!available) return null;

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setAvailable(false));
      setPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleEnded = () => {
    setPlaying(false);
    setProgress(0);
  };

  const handleError = () => {
    setAvailable(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleError}
        preload="none"
      />
      <button
        className={`${styles.playBtn} ${playing ? styles.playing : ''}`}
        onClick={togglePlay}
        aria-label={playing ? 'Пауза' : 'Слушать'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <div className={styles.progressBar} onClick={handleSeek}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
```

**Step 2: Create CSS**

```css
/* src/components/AzkarAudio/AzkarAudio.module.css */
.player {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.playBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}

.playBtn.playing,
.playBtn:hover {
  background: var(--accent);
  color: var(--bg-primary);
}

.progressBar {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.1s linear;
}
```

**Step 3: Create audio placeholder**

```bash
mkdir -p public/audio && touch public/audio/.gitkeep
```

**Step 4: Commit**

```bash
git add src/components/AzkarAudio/ public/audio/
git commit -m "feat: add AzkarAudio player component"
```

---

## Task 5: AzkarCard Component

**Files:**
- Create: `src/components/AzkarCard/AzkarCard.tsx`
- Create: `src/components/AzkarCard/AzkarCard.module.css`

**Step 1: Create card component**

```tsx
// src/components/AzkarCard/AzkarCard.tsx
import { AzkarItem } from '@/types/azkar';
import AzkarCounter from '@/components/AzkarCounter/AzkarCounter';
import AzkarAudio from '@/components/AzkarAudio/AzkarAudio';
import styles from './AzkarCard.module.css';

interface AzkarCardProps {
  azkar: AzkarItem;
  index: number;
}

export default function AzkarCard({ azkar, index }: AzkarCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.title}>{azkar.title}</span>
        <span className={styles.countBadge}>×{azkar.count}</span>
      </header>

      <div className={styles.transliteration}>
        {azkar.transliteration}
      </div>

      <div className={styles.divider} />

      <div className={`${styles.arabic} arabic`}>
        {azkar.arabic}
      </div>

      <div className={styles.divider} />

      <div className={styles.translation}>
        {azkar.translation}
      </div>

      <footer className={styles.footer}>
        {azkar.audioFile && (
          <AzkarAudio src={`/audio/${azkar.audioFile}`} />
        )}
        <AzkarCounter total={azkar.count} />
      </footer>
    </article>
  );
}
```

**Step 2: Create CSS**

```css
/* src/components/AzkarCard/AzkarCard.module.css */
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: border-color 0.2s;
}

.card:hover {
  border-color: #40484f;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.number {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  min-width: 24px;
}

.title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  flex: 1;
}

.countBadge {
  font-size: 0.75rem;
  color: var(--text-transliteration);
  background: rgba(212, 168, 67, 0.12);
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.transliteration {
  font-size: 0.875rem;
  color: var(--text-transliteration);
  line-height: 1.7;
  font-style: italic;
}

.arabic {
  /* .arabic class from globals.css provides RTL + font */
}

.translation {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.divider {
  height: 1px;
  background: var(--border);
  opacity: 0.5;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding-top: 4px;
  border-top: 1px solid var(--border);
}
```

**Step 3: Commit**

```bash
git add src/components/AzkarCard/
git commit -m "feat: add AzkarCard component"
```

---

## Task 6: Home Page Assembly

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/page.module.css`

**Step 1: Write page**

```tsx
// src/app/page.tsx
'use client';
import { useState } from 'react';
import { morningAzkar, eveningAzkar } from '@/data/azkar';
import AzkarCard from '@/components/AzkarCard/AzkarCard';
import styles from './page.module.css';

type Tab = 'morning' | 'evening';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  const list = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>أَذْكَار</h1>
        <p className={styles.subtitle}>Утренние и вечерние азкары</p>
      </header>

      <nav className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'morning' ? styles.active : ''}`}
          onClick={() => setActiveTab('morning')}
        >
          🌅 Утренние
          <span className={styles.tabCount}>{morningAzkar.length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'evening' ? styles.active : ''}`}
          onClick={() => setActiveTab('evening')}
        >
          🌙 Вечерние
          <span className={styles.tabCount}>{eveningAzkar.length}</span>
        </button>
      </nav>

      <section className={styles.list}>
        {list.map((azkar, i) => (
          <AzkarCard key={azkar.id} azkar={azkar} index={i} />
        ))}
      </section>
    </main>
  );
}
```

**Step 2: Write page CSS**

```css
/* src/app/page.module.css */
.main {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 16px 80px;
}

.header {
  text-align: center;
  padding: 40px 0 32px;
}

.title {
  font-family: 'Noto Naskh Arabic', serif;
  font-size: 3rem;
  color: var(--text-arabic);
  letter-spacing: 0.02em;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0;
}

.tab {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.tabCount {
  font-size: 0.75rem;
  background: var(--border);
  padding: 2px 6px;
  border-radius: 10px;
  color: var(--text-secondary);
}

.tab.active .tabCount {
  background: rgba(88, 166, 255, 0.15);
  color: var(--accent);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

**Step 3: Run dev server to verify**

```bash
npm run dev
```

Open `http://localhost:3000` — should see dark page with Arabic header, two tabs, and azkar cards.

**Step 4: Commit**

```bash
git add src/app/page.tsx src/app/page.module.css
git commit -m "feat: assemble home page with tabs and azkar list"
```

---

## Task 7: Build Verification

**Step 1: Run lint**

```bash
npm run lint
```

Fix any ESLint errors.

**Step 2: Run production build**

```bash
npm run build
```

Expected: Build completes without errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete azkar website - Arabic text, Russian translation, counter, audio player"
```

---

## File Structure Summary

```
src/
  types/
    azkar.ts              ← AzkarItem interface
  data/
    azkar.ts              ← All 34 azkar entries
  components/
    AzkarCounter/
      AzkarCounter.tsx    ← dots / checkmark / ring counter
      AzkarCounter.module.css
    AzkarAudio/
      AzkarAudio.tsx      ← audio player (hides if no file)
      AzkarAudio.module.css
    AzkarCard/
      AzkarCard.tsx       ← full azkar display card
      AzkarCard.module.css
  app/
    layout.tsx            ← Arabic font + metadata
    globals.css           ← dark theme CSS variables
    page.tsx              ← home page with tabs
    page.module.css
public/
  audio/
    azkar-01.mp3          ← (add audio files here)
    ...
    azkar-34.mp3
```
