/**
 * LEBANON UNIVERSITIES & PROGRAM BRANCHES — data file.
 *
 * Structure:
 *   window.lebanonUniversityData = {
 *     universities: [ { id, name, short, city, type, engineering, programs, sources } ]
 *   }
 *
 * Each university lists:
 *   engineering : array of engineering branch KEYS it actually offers
 *   programs    : array of non-engineering program KEYS it offers
 *   sources     : where the data came from (for verification)
 *
 * Branch keys map to the device profiles in catalog-expansion.js / theme.js
 * (e.g. 'electrical', 'civil', 'mechanical', 'computer-science', ...).
 *
 * ── CONFIDENCE ────────────────────────────────
 * Data below is researched from public university sources (see `sources`).
 * Engineering branches for the major universities are high-confidence.
 * Some smaller institutions are marked "approximate" — their exact branch
 * split should be confirmed with the university before relying on it.
 * This file is the single place to correct or extend the data; the UI
 * reads it dynamically and needs no changes when you edit here.
 * ─────────────────────────────
 */
(function () {
  // Full engineering branch catalogue. Selecting a university filters this
  // list down to the branches that university actually offers.
  const ENGINEERING_BRANCHES = {
    electrical: 'Electrical Engineering',
    mechanical: 'Mechanical Engineering',
    civil: 'Civil Engineering',
    chemical: 'Chemical Engineering',
    biomedical: 'Biomedical Engineering',
    'computer-engineering': 'Computer Engineering',
    software: 'Software Engineering',
    telecommunications: 'Telecommunications Engineering',
    mechatronics: 'Mechatronics Engineering',
    industrial: 'Industrial Engineering',
    petroleum: 'Petroleum Engineering',
    'renewable-energy': 'Renewable Energy Engineering',
    surveying: 'Surveying / Geomatics Engineering',
    electronics: 'Electronics Engineering',
    architecture: 'Architecture',
  };

  const universities = [
    {
      id: 'aub',
      name: 'American University of Beirut (AUB)',
      short: 'AUB',
      city: 'Beirut',
      type: 'Private (American)',
      engineering: ['electrical', 'computer-engineering', 'civil', 'mechanical', 'chemical'],
      programs: ['computer-science', 'medicine', 'business', 'architecture', 'biology', 'mathematics', 'psychology', 'economics', 'nursing'],
      confidence: 'high',
      sources: ['https://www.aub.edu.lb/msfea/ece/Pages/overview.aspx'],
    },
    {
      id: 'lau',
      name: 'Lebanese American University (LAU)',
      short: 'LAU',
      city: 'Beirut / Byblos',
      type: 'Private (American)',
      engineering: ['civil', 'computer-engineering', 'electrical', 'industrial', 'mechanical'],
      programs: ['computer-science', 'medicine', 'nursing', 'business', 'accounting', 'architecture', 'media', 'psychology'],
      confidence: 'high',
      sources: ['https://en.wikipedia.org/wiki/Lebanese_American_University'],
    },
    {
      id: 'lu',
      name: 'Lebanese University (LU)',
      short: 'LU',
      city: 'Beirut / Tripoli / Roumieh / Hadat',
      type: 'Public (state)',
      engineering: ['civil', 'mechanical', 'chemical', 'electrical'],
      programs: ['computer-science', 'medicine', 'law', 'business', 'education', 'biology', 'mathematics', 'nutrition', 'nursing', 'psychology', 'architecture'],
      confidence: 'high',
      sources: ['https://www.aulfg2.org.lb/ulgf2', 'https://ul.edu.lb/en/colleges-faculties-homepage'],
    },
    {
      id: 'usj',
      name: 'Saint Joseph University of Beirut (USJ)',
      short: 'USJ',
      city: 'Beirut / Zahle / North / South',
      type: 'Private (Jesuit)',
      engineering: ['mechanical', 'mechatronics', 'electrical', 'civil', 'computer-engineering'],
      programs: ['medicine', 'nursing', 'law', 'business', 'architecture', 'biology', 'nutrition', 'education', 'psychology'],
      confidence: 'high',
      sources: ['https://usj.edu.lb/esib/accreditationME.php'],
    },
    {
      id: 'bau',
      name: 'Beirut Arab University (BAU)',
      short: 'BAU',
      city: 'Beirut / Tripoli / Bekaa',
      type: 'Private',
      engineering: ['biomedical', 'chemical', 'civil', 'electronics', 'computer-engineering', 'electrical', 'industrial', 'mechanical', 'petroleum', 'renewable-energy'],
      programs: ['computer-science', 'medicine', 'business', 'law', 'architecture', 'psychology'],
      confidence: 'high',
      sources: ['https://www.bau.edu.lb/Engineering/Programs/Undergraduate'],
    },
    {
      id: 'uob',
      name: 'University of Balamand (UOB)',
      short: 'UOB',
      city: 'Koura (North) / Beirut',
      type: 'Private',
      engineering: ['chemical', 'civil', 'computer-engineering', 'electrical', 'mechanical'],
      programs: ['medicine', 'nursing', 'business', 'computer-science', 'architecture', 'psychology', 'biology'],
      confidence: 'high',
      sources: ['https://balamand.edu.lb/'],
    },
    {
      id: 'ndu',
      name: 'Notre Dame University – Louaize (NDU)',
      short: 'NDU',
      city: 'Zouk Mosbeh / Barsa / Deir el Qamar',
      type: 'Private',
      engineering: ['civil', 'electrical', 'computer-engineering', 'mechanical'],
      programs: ['computer-science', 'business', 'law', 'architecture', 'psychology', 'media', 'mathematics'],
      confidence: 'high',
      sources: ['https://en.wikipedia.org/wiki/Notre_Dame_University–Louaize'],
    },
    {
      id: 'liu',
      name: 'Lebanese International University (LIU)',
      short: 'LIU',
      city: 'Beirut + 9 campuses',
      type: 'Private',
      engineering: ['biomedical', 'computer-engineering', 'electrical', 'electronics', 'mechanical', 'surveying', 'telecommunications', 'industrial'],
      programs: ['computer-science', 'business', 'accounting', 'law', 'education', 'media', 'hospitality'],
      confidence: 'high',
      sources: ['https://en.wikipedia.org/wiki/Lebanese_International_University'],
    },
    {
      id: 'usek',
      name: 'Université Saint-Esprit de Kaslik (USEK)',
      short: 'USEK',
      city: 'Jounieh',
      type: 'Private (Maronite)',
      engineering: ['civil', 'computer-engineering', 'biomedical', 'architecture'],
      programs: ['medicine', 'nursing', 'business', 'law', 'media', 'music', 'psychology'],
      confidence: 'medium',
      sources: ['https://usek.academia.edu/'],
    },
    {
      id: 'rhu',
      name: 'Rafik Hariri University (RHU)',
      short: 'RHU',
      city: 'Mechref, Damour',
      type: 'Private',
      engineering: ['civil', 'computer-engineering', 'electrical', 'biomedical', 'mechanical', 'mechatronics'],
      programs: ['business', 'computer-science', 'architecture'],
      confidence: 'high',
      sources: ['https://www.rhu.edu.lb/about-rhu/rhu-at-a-glance'],
    },
    {
      id: 'aust',
      name: 'American University of Science and Technology (AUST)',
      short: 'AUST',
      city: 'Beirut / Mount Lebanon',
      type: 'Private',
      engineering: ['electrical', 'computer-engineering', 'software'],
      programs: ['computer-science', 'business', 'accounting', 'media'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'ua',
      name: 'Antonine University (UA)',
      short: 'UA',
      city: 'Hadat-Baabda / Zahle / Zgharta',
      type: 'Private (Catholic)',
      engineering: ['electrical', 'mechanical', 'computer-engineering', 'software'],
      programs: ['business', 'education', 'music', 'media'],
      confidence: 'medium',
      sources: ['https://ua.edu.lb/en/home', 'https://en.wikipedia.org/wiki/Antonine_University'],
    },
    {
      id: 'ul', // legacy id kept for compatibility
      name: 'Université Libanaise (UL)',
      short: 'UL',
      city: 'Beirut',
      type: 'Public',
      engineering: ['civil', 'electrical', 'mechanical'],
      programs: ['business', 'law', 'education'],
      confidence: 'approximate',
      sources: [],
      hidden: true,
    },
    {
      id: 'lgu',
      name: 'Lebanese German University (LGU)',
      short: 'LGU',
      city: 'Jounieh',
      type: 'Private',
      engineering: ['civil', 'mechanical', 'computer-engineering'],
      programs: ['business', 'computer-science', 'hospitality', 'nursing'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'mubs',
      name: 'Modern University for Business and Science (MUBS)',
      short: 'MUBS',
      city: 'Beirut / Aley / Sidon / Tripoli / Bekaa',
      type: 'Private',
      engineering: [],
      programs: ['computer-science', 'business', 'accounting', 'psychology', 'education', 'hospitality'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'meu',
      name: 'Middle East University (MEU)',
      short: 'MEU',
      city: 'Ansar / Beirut',
      type: 'Private',
      engineering: [],
      programs: ['computer-science', 'business', 'accounting', 'education', 'media'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'aul',
      name: 'Arts, Sciences and Technology University in Lebanon (AUL)',
      short: 'AUL',
      city: 'Beirut / Jdeideh',
      type: 'Private',
      engineering: ['civil', 'computer-engineering'],
      programs: ['computer-science', 'business', 'accounting', 'media'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'haigazian',
      name: 'Haigazian University',
      short: 'HU',
      city: 'Beirut',
      type: 'Private',
      engineering: [],
      programs: ['computer-science', 'business', 'psychology', 'education', 'biology', 'mathematics'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'la Sagesse',
      name: 'Université La Sagesse (ULS)',
      short: 'ULS',
      city: 'Beirut',
      type: 'Private (Catholic)',
      engineering: [],
      programs: ['business', 'law', 'education', 'nursing'],
      confidence: 'approximate',
      sources: [],
    },
    {
      id: 'global',
      name: 'Global University',
      short: 'GU',
      city: 'Beirut',
      type: 'Private',
      engineering: [],
      programs: ['computer-science', 'business', 'education', 'psychology'],
      confidence: 'approximate',
      sources: [],
    },
    {
      id: 'jinan',
      name: 'Jinan University of Lebanon',
      short: 'JU',
      city: 'Tripoli',
      type: 'Private',
      engineering: [],
      programs: ['business', 'computer-science', 'education', 'law', 'psychology'],
      confidence: 'approximate',
      sources: [],
    },
    {
      id: 'iul',
      name: 'Islamic University of Lebanon (IUL)',
      short: 'IUL',
      city: 'Khalde / Bekaa',
      type: 'Private',
      engineering: ['civil', 'computer-engineering'],
      programs: ['business', 'law', 'education', 'computer-science'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'phoenicia',
      name: 'Phoenicia University',
      short: 'PU',
      city: 'Mazraa, Mount Lebanon',
      type: 'Private',
      engineering: ['civil', 'computer-engineering'],
      programs: ['business', 'education', 'computer-science'],
      confidence: 'medium',
      sources: [],
    },
    {
      id: 'biu',
      name: 'Beirut Islamic University (BIU)',
      short: 'BIU',
      city: 'Beirut',
      type: 'Private',
      engineering: [],
      programs: ['business', 'computer-science', 'education', 'law'],
      confidence: 'approximate',
      sources: [],
    },
  ];

  /*
   * Some specialised engineering branches have no device profile of their own.
   * Rather than duplicate near-identical profiles, map them onto the closest
   * existing one in expandedPrograms / studyPrograms. The label shown to the
   * user still comes from ENGINEERING_BRANCHES, so it stays accurate.
   */
  const BRANCH_PROFILE_ALIASES = {
    'computer-engineering': 'software',
    electronics: 'telecommunications',
    petroleum: 'chemical',
    'renewable-energy': 'electrical',
    surveying: 'civil',
    industrial: 'mechanical',
  };

  window.lebanonUniversityData = {
    engineeringBranches: ENGINEERING_BRANCHES,
    branchProfileAliases: BRANCH_PROFILE_ALIASES,
    universities: universities.filter((u) => !u.hidden),
  };
})();
