import { CulturalItem } from '../types';

export const CULTURAL_ITEMS_DATA: CulturalItem[] = [
  // 1. UNESCO: HAMPI
  {
    id: 'unesco-hampi',
    titleEnglish: 'Group of Monuments at Hampi',
    titleKannada: 'ಹಂಪಿಯ ಸ್ಮಾರಕಗಳ ಸಮೂಹ',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    region: 'Vijayanagara District, Central Karnataka',
    isUNESCO: true,
    unescoYear: 1986,
    periodOrDates: '14th–16th Century CE (Vijayanagara Empire)',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Unsplash / Archaeological Survey of India documentation',
    shortDescription: 'The magnificent capital of the Vijayanagara Empire situated on the banks of the Tungabhadra River, featuring over 1,600 surviving monuments.',
    historicalSignificance: 'Hampi was the center of the Vijayanagara Empire, described by medieval Persian traveler Abdur Razzaq and Portuguese chronicler Domingo Paes as one of the grandest and wealthiest cities of the medieval world, where rubies, pearls, and diamonds were weighed in open bazaars.',
    deepDive: 'Spanning more than 4,100 hectares, Hampi encompasses royal enclosures, sacred temple complexes, stepped tanks (Kalyani), and military fortifications. Highlights include the Virupaksha Temple—which has remained continuously active since the 7th century—the Vijaya Vittala temple with its 56 musical stone pillars and the monolithic stone chariot (represented on India\'s 50-rupee currency note), the Lotus Mahal, and the Elephant Stables.',
    interestingFacts: [
      'The stone chariot at Vittala Temple is one of only three famous stone chariots in India (others being Konark and Mahabalipuram).',
      'The musical pillars produce distinct rhythmic frequencies when struck gently with fingers, engineered through varying granite densities.',
      'Hampi was the world\'s second-largest medieval-era city after Beijing in 1500 CE.',
    ],
    sourcesAndReferences: [
      'UNESCO World Heritage Centre — Inscription 241',
      'Archaeological Survey of India (ASI) Hampi Circle',
      'Fritz, J. M., & Michell, G. (2001). New Light on Hampi: Recent Research at Vijayanagara.',
    ],
    relatedVocabulary: [
      { kannada: 'ಶಿಲ್ಪಕಲೆ', transliteration: 'shilpakale', english: 'stone sculpture / architecture' },
      { kannada: 'ಸಾಮ್ರಾಜ್ಯ', transliteration: 'saamraajya', english: 'empire' },
      { kannada: 'ರಥ', transliteration: 'ratha', english: 'chariot' },
    ],
    keyPhrase: {
      kannada: 'ಹಂಪಿಯ ಶಿಲ್ಪಕಲೆ ಅತ್ಯಂತ ವಿಸ್ಮಯಕಾರಿಯಾಗಿದೆ.',
      transliteration: 'Hampiya shilpakale atyanta vismayakaariyaagide.',
      english: 'The stone architecture of Hampi is utterly magnificent.',
      context: 'Admiring historical sites and granite carvings',
    },
  },

  // 2. UNESCO: PATTADAKAL
  {
    id: 'unesco-pattadakal',
    titleEnglish: 'Group of Monuments at Pattadakal',
    titleKannada: 'ಪಟ್ಟದಕಲ್ಲು ಸ್ಮಾರಕಗಳ ಸಮೂಹ',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    region: 'Bagalkot District, Malaprabha River valley',
    isUNESCO: true,
    unescoYear: 1987,
    periodOrDates: '7th–8th Century CE (Badami Chalukya Dynasty)',
    image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'ASI Heritage Archive',
    shortDescription: 'The holy coronation site of the Badami Chalukyas showcasing a harmonious fusion of northern Nagara and southern Dravida architectural styles.',
    historicalSignificance: 'Pattadakal (literally "Place of Coronation") represents the high point of an eclectic art that in the 7th and 8th centuries achieved a harmonious blend of architectural forms from northern and southern India.',
    deepDive: 'Pattadakal features nine Hindu temples as well as a Jain sanctuary. The Virupaksha Temple, built c. 740 CE by Queen Lokamahadevi to commemorate King Vikramaditya II\'s victory over the Pallavas of Kanchi, served as the direct architectural inspiration for the Kailasa Temple at Ellora.',
    interestingFacts: [
      'Pattadakal was the ceremonial coronation venue (Pattada-Kisuvolal) for Chalukyan monarchs.',
      'It sits directly alongside the Malaprabha River which turns northwards here (Uttara-vahini), an orientation considered sacred in Hindu temple geometry.',
    ],
    sourcesAndReferences: [
      'UNESCO World Heritage List Ref. 393',
      'Archaeological Survey of India — Dharwad Circle',
      'Michell, G. (2014). Temple Architecture and Art of the Early Chalukyas.',
    ],
    relatedVocabulary: [
      { kannada: 'ಪಟ್ಟಾಭಿಷೇಕ', transliteration: 'pattaabhisheka', english: 'coronation ceremony' },
      { kannada: 'ಗುಡಿ / ದೇವಾಲಯ', transliteration: 'gudi / devaalaya', english: 'temple / shrine' },
    ],
    keyPhrase: {
      kannada: 'ಇಲ್ಲಿ ಉತ್ತರ ಮತ್ತು ದಕ್ಷಿಣ ಭಾರತದ ಶಿಲ್ಪಕಲೆಯ ಸಂಗಮವಿದೆ.',
      transliteration: 'Illi uttara mattu dakshina bhaarutada shilpakaleya sangamavide.',
      english: 'Here lies the confluence of North and South Indian temple architecture.',
      context: 'Art historical appreciation',
    },
  },

  // 3. UNESCO: HOYSALA ENSEMBLES (BELUR, HALEBIDU & SOMANATHAPURA)
  {
    id: 'unesco-hoysala',
    titleEnglish: 'Sacred Ensembles of the Hoysalas',
    titleKannada: 'ಹೊಯ್ಸಳರ ಪವಿತ್ರ ಸಮೂಹ (ಬೇಲೂರು, ಹಳೇಬೀಡು, ಸೋಮನಾಥಪುರ)',
    category: 'unesco',
    categoryLabel: 'UNESCO World Heritage',
    region: 'Hassan and Mysuru Districts',
    isUNESCO: true,
    unescoYear: 2023,
    periodOrDates: '12th–13th Century CE (Hoysala Dynasty)',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Karnataka Tourism Heritage Archives',
    shortDescription: 'Inscribed in 2023, these masterworks in soft chloritic schist (soapstone) feature star-shaped stellate platforms and micro-detailed friezes.',
    historicalSignificance: 'The Chennakeshava Temple at Belur, Hoysaleshwara Temple at Halebidu, and Keshava Temple at Somanathapura represent the peak of Hoysala artistic expression, famous for sculptural precision where individual jewelry beads and lace fabrics are carved out of stone.',
    deepDive: 'The artists signed their works—notable master sculptors like Jakanachari, Ruvari Mallitamma, and Dasoja inscribed their names on individual relief panels. The temples rest on high star-shaped plinths (Jagati), providing circumambulatory pathways flanked by friezes of war elephants, lions, horses, and floral bands.',
    interestingFacts: [
      'The soapstone material was soft when quarried, allowing jewel-like carving, before hardening upon exposure to air.',
      'No two relief panels in the thousands of friezes at Halebidu are identical.',
    ],
    sourcesAndReferences: [
      'UNESCO World Heritage List Ref. 1670 (Inscribed September 2023)',
      'Foekema, G. (1996). A Complete Guide to Hoysala Temples.',
    ],
    relatedVocabulary: [
      { kannada: 'ಹೊಯ್ಸಳ', transliteration: 'Hoysala', english: 'Hoysala royal dynasty' },
      { kannada: 'ಕೆತ್ತನೆ', transliteration: 'kettane', english: 'intricate carving / engraving' },
    ],
    keyPhrase: {
      kannada: 'ಬೇಲೂರಿನ ಶಿಲಾಬಾಲಿಕೆಯರ ಕೆತ್ತನೆ ಜೀವಂತವಾಗಿ ಕಾಣುತ್ತದೆ.',
      transliteration: 'Beloorina shilaabaalikeya kettane jeevantavaagi kaanuttade.',
      english: 'The carvings of the bracket-damsels (Shilabhanjika) of Belur appear lifelike.',
      context: 'Discussing Hoysala art',
    },
  },

  // 4. UNESCO: WESTERN GHATS
  {
    id: 'unesco-western-ghats',
    titleEnglish: 'Western Ghats Biodiversity Hotspot',
    titleKannada: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಜೀವವೈವಿಧ್ಯ ತಾಣ',
    category: 'unesco',
    categoryLabel: 'UNESCO Natural Heritage',
    region: 'Uttara Kannada, Udupi, Dakshina Kannada, Shivamogga, Chikkamagaluru, Kodagu',
    isUNESCO: true,
    unescoYear: 2012,
    periodOrDates: 'Pre-Cambrian to Present',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Forestry Department of Karnataka',
    shortDescription: 'One of the world\'s eight "hottest hotspots" of biological diversity, older than the Himalayas and source of south India\'s major rivers.',
    historicalSignificance: 'The Western Ghats (Sahyadri range) in Karnataka mediate the southwest Indian monsoon and feed vital perennial rivers including the Kaveri, Tungabhadra, Sharavathi, and Netravathi.',
    deepDive: 'Encompassing Kudremukh National Park, Pushpagiri, Brahmagiri, Talakaveri, and Someshwara Wildlife Sanctuaries, Karnataka\'s Ghats shelter endangered species like the Lion-tailed Macaque, Malabar Giant Squirrel, King Cobra, and hundreds of medicinal flora found nowhere else on earth.',
    interestingFacts: [
      'Agumbe in the Western Ghats is known as the "Cherrapunji of the South" for receiving excessive annual rainfall.',
      'The montane shola grasslands and evergreen rainforests act as natural sponge catchments for billions of liters of fresh water.',
    ],
    sourcesAndReferences: [
      'UNESCO World Heritage List Ref. 1342',
      'Gadgil, M. et al. (2011). Western Ghats Ecology Expert Panel Report.',
    ],
    relatedVocabulary: [
      { kannada: 'ಕಾಡು / ಅರಣ್ಯ', transliteration: 'kaadu / aranya', english: 'forest / jungle' },
      { kannada: 'ಮಳೆಕಾಡು', transliteration: 'malekaadu', english: 'rainforest' },
      { kannada: 'ಗಿರಿಶಿಖರ', transliteration: 'girishikhara', english: 'mountain peak' },
    ],
    keyPhrase: {
      kannada: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು ಕರ್ನಾಟಕದ ಜೀವನಾಡಿ.',
      transliteration: 'Pashchima ghattagalu Karnatakada jeevanaadi.',
      english: 'The Western Ghats are the lifeline of Karnataka.',
      context: 'Environmental and geographic conversations',
    },
  },

  // 5. PALACE: MYSURU PALACE
  {
    id: 'palace-mysuru',
    titleEnglish: 'Mysuru Palace (Amba Vilas)',
    titleKannada: 'ಮೈಸೂರು ಅಂಬಾ ವಿಲಾಸ ಅರಮನೆ',
    category: 'palace',
    categoryLabel: 'Palaces & Forts',
    region: 'Mysuru District, Southern Karnataka',
    isUNESCO: false,
    periodOrDates: 'Completed in 1912 CE (Designed by Henry Irwin)',
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Department of Archaeology, Museums and Heritage, Karnataka',
    shortDescription: 'The royal seat of the Wodeyar dynasty, renowned worldwide for its Indo-Saracenic grandeur and 100,000 illumination bulbs during Dasara.',
    historicalSignificance: 'Rebuilt after the old wooden palace burned during a royal wedding in 1897, the Amba Vilas Palace stands as the supreme symbol of Karnataka\'s royal cultural patronages under Maharaja Krishnaraja Wadiyar IV.',
    deepDive: 'The palace features a three-story stone structure with marble domes and a 145-foot five-story tower. Inside, the Public Durbar Hall (Diwan-i-Aam) and the Kalyana Mantapa (Marriage Pavilion) showcase stained glass ceilings imported from Glasgow, teak wood carvings, and a golden throne containing 200 kg of pure gold.',
    interestingFacts: [
      'Over 97,000 incandescent light bulbs illuminate the palace facade on Sunday evenings and during the Dasara festival.',
      'Second only to the Taj Mahal in annual footfall among historic monuments in India.',
    ],
    sourcesAndReferences: [
      'Mysore Palace Board Official Records',
      'Rao, C. Hayavadana (1936). History of Mysore.',
    ],
    relatedVocabulary: [
      { kannada: 'ಅರಮನೆ', transliteration: 'aramane', english: 'palace' },
      { kannada: 'ರಾಜವಂಶ', transliteration: 'raajavamsha', english: 'royal dynasty' },
      { kannada: 'ಸಿಂಹಾಸನ', transliteration: 'simhaasana', english: 'throne' },
    ],
    keyPhrase: {
      kannada: 'ದಸರಾ ಸಮಯದಲ್ಲಿ ಅರಮನೆ ಬೆಳಕಿನಿಂದ ಕಂಗೊಳಿಸುತ್ತದೆ.',
      transliteration: 'Dasara samayadalli aramane belakininda kangolisuttade.',
      english: 'During Dasara, the palace dazzles with brilliant illuminations.',
      context: 'Talking about royal heritage and festivals',
    },
  },

  // 6. ARCHITECTURE: BADAMI CAVE TEMPLES
  {
    id: 'arch-badami',
    titleEnglish: 'Badami Rock-Cut Cave Temples',
    titleKannada: 'ಬಾದಾಮಿ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು',
    category: 'architecture',
    categoryLabel: 'Architectural Landmarks',
    region: 'Bagalkot District, North Karnataka',
    isUNESCO: false,
    periodOrDates: '6th–8th Century CE (Early Chalukya Dynasty)',
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'ASI Dharwad Circle',
    shortDescription: 'Four monumental rock-cut shrines carved into sheer red sandstone cliffs overlooking the ancient Agastya Lake.',
    historicalSignificance: 'Badami (ancient Vatapi) served as the capital of the Chalukya dynasty founded by Pulakeshin I in 540 CE. The rock-cut architecture here represents some of the earliest verified examples of Hindu temple art in the Deccan.',
    deepDive: 'Cave 1 is dedicated to Shiva (featuring an 18-armed dancing Nataraja executing 81 Bharatanatyam poses). Cave 2 and Cave 3 are dedicated to Vishnu (Cave 3 being the largest and most intricately sculpted, dated by inscription to 578 CE under Mangalesha). Cave 4 is an exquisite Jain temple dedicated to Mahavira and Tirthankaras.',
    interestingFacts: [
      'Cave 3 contains an ancient Kannada inscription giving the exact Saka year equivalent to 578 CE.',
      'The red sandstone cliffs are now an international destination for rock-climbing enthusiasts.',
    ],
    sourcesAndReferences: [
      'Burgess, J. (1877). Rock-Temples of Elura and Badami.',
      'Tarr, G. (1970). Chronology and Development of the Chalukya Cave Temples.',
    ],
    relatedVocabulary: [
      { kannada: 'ಗುಹೆ', transliteration: 'guhe', english: 'cave' },
      { kannada: 'ಕೆಂಪು ಕಲ್ಲು', transliteration: 'kempu kallu', english: 'red sandstone' },
    ],
    keyPhrase: {
      kannada: 'ಬಾದಾಮಿಯ ಬಂಡೆಗಳಲ್ಲಿ ಕೆತ್ತಿದ ನಟರಾಜನ ವಿಗ್ರಹ ಅದ್ಭುತ.',
      transliteration: 'Baadaamiya bandegalalli kettida Nataraajana vigraha adbhuta.',
      english: 'The idol of Nataraja carved into Badami\'s boulders is astonishing.',
      context: 'Exploring rock-cut heritage',
    },
  },

  // 7. ARCHITECTURE: GOL GUMBAZ (VIJAYAPURA)
  {
    id: 'arch-gol-gumbaz',
    titleEnglish: 'Gol Gumbaz of Vijayapura',
    titleKannada: 'ವಿಜಯಪುರದ ಗೋಲ್ ಗುಮ್ಮಟ',
    category: 'architecture',
    categoryLabel: 'Architectural Landmarks',
    region: 'Vijayapura (Bijapur), Northern Karnataka',
    isUNESCO: false,
    periodOrDates: '1656 CE (Adil Shahi Dynasty)',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'ASI Vijayapura Circle',
    shortDescription: 'The mausoleum of King Mohammed Adil Shah, holding one of the largest free-standing acoustic domes in the world without pillar support.',
    historicalSignificance: 'Engineered by Yaqut of Dabul, Gol Gumbaz (literally "Circular Dome") is an engineering triumph of Deccan Indo-Islamic architecture, famous for its Whispering Gallery.',
    deepDive: 'The circular dome has an outer diameter of 44 meters and rests on interlocking pendentives covering a single hall of 18,000 square feet without any central columns. In the whispering gallery around the dome, even the softest whisper echoes eleven times across a 38-meter chasm.',
    interestingFacts: [
      'The dome was built using hydraulic lime mortar and remains structurally intact after over 370 years.',
      'A loud clap under the central dome reverberates distinctly 7 to 11 times.',
    ],
    sourcesAndReferences: [
      'Cousens, H. (1916). Bijapur and its Architectural Remains.',
      'Archaeological Survey of India Monograph Series.',
    ],
    relatedVocabulary: [
      { kannada: 'ಗುಮ್ಮಟ', transliteration: 'gummata', english: 'dome' },
      { kannada: 'ಪ್ರತಿಧ್ವನಿ', transliteration: 'pratidhvani', english: 'echo / reverberation' },
    ],
    keyPhrase: {
      kannada: 'ಗೋಲ್ ಗುಮ್ಮಟದ ಪ್ರತಿಧ್ವನಿ ಗ್ಯಾಲರಿಯಲ್ಲಿ ಶಬ್ದ ಹನ್ನೊಂದು ಬಾರಿ ಪ್ರತಿಧ್ವನಿಸುತ್ತದೆ.',
      transliteration: 'Gol Gummatada pratidhvani gyaalariyalli shabda hannondu baari pratidhvanisuttade.',
      english: 'In Gol Gumbaz\'s echo gallery, sounds reverberate eleven times.',
      context: 'Discussing acoustic marvels',
    },
  },

  // 8. PALACE: CHITRADURGA FORT
  {
    id: 'palace-chitradurga',
    titleEnglish: 'Chitradurga Fort (Kallina Kote)',
    titleKannada: 'ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆ (ಏಳು ಸುತ್ತಿನ ಕೋಟೆ)',
    category: 'palace',
    categoryLabel: 'Palaces & Forts',
    region: 'Chitradurga District, Central Karnataka',
    isUNESCO: false,
    periodOrDates: '10th–18th Century CE (Nayakas of Chitradurga)',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'ASI Chitradurga Sub-Circle',
    shortDescription: 'The impregnable "Seven-Circled Stone Fort" featuring 38 secret rear gates, rain-harvesting interconnected tanks, and legendary folklore.',
    historicalSignificance: 'Built across massive granite hills, Chitradurga Fort is immortalized in Karnataka history through the courage of Onake Obavva, who defended the fort against Hyder Ali\'s invading troops with a pestle (Onake).',
    deepDive: 'The fort consists of seven concentric fortification ramparts (Yelu Suttina Kote) with deceptive winding passages designed to prevent battering rams. The engineering incorporates sophisticated rainwater harvesting ponds that supplied drinking water throughout months of prolonged siege.',
    interestingFacts: [
      'The secret crevice where heroine Onake Obavva guarded the fort is preserved as "Obavvana Kindi".',
      'The fort features 19 gateways, 38 postern doors, and 35 secret passages.',
    ],
    sourcesAndReferences: [
      'Rice, B. L. (1897). Epigraphia Carnatica Vol. XI.',
      'Sathyan, B. N. (1967). Mysore State Gazetteer: Chitradurga District.',
    ],
    relatedVocabulary: [
      { kannada: 'ಕೋಟೆ', transliteration: 'kote', english: 'fort / fortress' },
      { kannada: 'ವೀರವನಿತೆ', transliteration: 'veeravanite', english: 'heroic woman warrior' },
    ],
    keyPhrase: {
      kannada: 'ಓಬವ್ವನ ಕಿಂಡಿ ಚಿತ್ರದುರ್ಗದ ಸಾಹಸದ ಸಂಕೇತವಾಗಿದೆ.',
      transliteration: 'Obavvana kindi Chitradurgada saahasada sanketavaagide.',
      english: 'Obavva\'s crevice is the symbol of Chitradurga\'s bravery.',
      context: 'Historical folklore and courage',
    },
  },

  // 9. MONUMENT: SHRAVANABELAGOLA GOMMATESHWARA
  {
    id: 'monument-shravanabelagola',
    titleEnglish: 'Shravanabelagola & Monolithic Gommateshwara',
    titleKannada: 'ಶ್ರವಣಬೆಳಗೊಳ ಮತ್ತು ಗೊಮ್ಮಟೇಶ್ವರ ಬಾಹುಬಲಿ',
    category: 'monument',
    categoryLabel: 'Historical Monuments',
    region: 'Hassan District, Southern Karnataka',
    isUNESCO: false,
    periodOrDates: '981 CE (Commissioned by Chavundaraya, Western Ganga Dynasty)',
    image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Karnataka State Heritage Centre',
    shortDescription: 'The world\'s tallest free-standing monolithic granite statue standing 57 feet tall atop Vindhyagiri Hill.',
    historicalSignificance: 'Carved out of a single block of granite under Western Ganga Prime Minister Chavundaraya in 981 CE, Gommateshwara Bahubali has been a global pilgrimage destination for Jain philosophy and non-violence (Ahimsa) for over a thousand years.',
    deepDive: 'The statue portrays Lord Bahubali standing in the meditative Kayotsarga posture with curly hair and serene smile, while climbing creepers intertwine around his legs. Once every 12 years, the grand Mahamastakabhisheka festival bathes the statue in milk, saffron, turmeric, sugarcane juice, and vermilion.',
    interestingFacts: [
      'The base has an ancient Marathi and Kannada inscription from 981 CE, among the earliest attested written sentences in medieval Marathi alongside Kannada.',
      'Visitors climb over 600 stone steps carved directly into the bedrock of Vindhyagiri to reach the sanctum.',
    ],
    sourcesAndReferences: [
      'Settar, S. (1989). Inviting Death: Historical Experiments on Sepulchral Hill (Shravanabelagola).',
      'Archaeological Survey of India Records.',
    ],
    relatedVocabulary: [
      { kannada: 'ಏಕಶಿಲಾ ವಿಗ್ರಹ', transliteration: 'ekashilaa vigraha', english: 'monolithic statue' },
      { kannada: 'ಅಹಿಂಸೆ', transliteration: 'ahimse', english: 'non-violence' },
    ],
    keyPhrase: {
      kannada: 'ಗೊಮ್ಮಟೇಶ್ವರನ ಶಾಂತ ಮುಖ ಮುದ ನೀಡುತ್ತದೆ.',
      transliteration: 'Gommateshwarana shaanta mukha muda needuttade.',
      english: 'The serene countenance of Gommateshwara brings inner peace.',
      context: 'Spiritual and philosophical visits',
    },
  },

  // 10. GEOGRAPHY: JOG FALLS (GERSOPPA)
  {
    id: 'geo-jog-falls',
    titleEnglish: 'Jog Falls (Gersoppa Falls)',
    titleKannada: 'ಜೋಗ ಜಲಪಾತ (ಗೇರುಸೊಪ್ಪೆ)',
    category: 'geography',
    categoryLabel: 'Geography & Nature',
    region: 'Shivamogga District, Sharavathi River Valley',
    isUNESCO: false,
    periodOrDates: 'Natural formation',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Tourism Department of Karnataka',
    shortDescription: 'India\'s second-highest plunge waterfall, where the Sharavathi River drops 253 meters in four distinct cascades: Raja, Roarer, Rocket, and Rani.',
    historicalSignificance: 'Jog Falls powers the Mahatma Gandhi Hydroelectric Project, which was one of Karnataka\'s earliest renewable electric power stations commissioned in 1948.',
    deepDive: 'During peak monsoon, the four streams merge into a single thunderous wall of mist plunging straight into the rocky chasm without hitting the cliff face. Raja falls as a continuous unbroken column, Roarer meets it at a 45-degree angle in a foaming vortex, Rocket shoots downward with high jet velocity, and Rani descends as a graceful veil.',
    interestingFacts: [
      'The total drop is 253 meters (830 feet), making it one of the most sheer plunge waterfalls in Asia.',
      'Visitors can descend 1,400 steps built into the gorge to reach the bottom pool.',
    ],
    sourcesAndReferences: [
      'Karnataka State Tourism Development Corporation (KSTDC)',
      'Survey of India Hydrological Survey.',
    ],
    relatedVocabulary: [
      { kannada: 'ಜಲಪಾತ', transliteration: 'jalapaata', english: 'waterfall' },
      { kannada: 'ಹೊಳೆ / ನದಿ', transliteration: 'hole / nadi', english: 'stream / river' },
    ],
    keyPhrase: {
      kannada: 'ಮಳೆಗಾಲದಲ್ಲಿ ಜೋಗ ಜಲಪಾತದ ನೋಟ ಮನಮೋಹಕ.',
      transliteration: 'Malegaaladalli Joga jalapaatada nota manamohaka.',
      english: 'In monsoon, the view of Jog Falls is captivating.',
      context: 'Nature and sightseeing',
    },
  },

  // 11. GEOGRAPHY: TALAKAVERI & COORG (KODAGU)
  {
    id: 'geo-talakaveri',
    titleEnglish: 'Talakaveri and the Kodagu Hills',
    titleKannada: 'ತಲಕಾವೇರಿ ಮತ್ತು ಕೊಡಗು ಬೆಟ್ಟಗಳು',
    category: 'geography',
    categoryLabel: 'Geography & Nature',
    region: 'Kodagu (Coorg) District, Brahmagiri Range',
    isUNESCO: false,
    periodOrDates: 'Ancient origin',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Kodagu Heritage Tourism',
    shortDescription: 'The sacred birthplace of the River Kaveri atop the Brahmagiri hill, nestled amidst misty coffee, cardamom, and pepper estates.',
    historicalSignificance: 'The Kaveri River (Kaveri Amma) is revered as mother to millions of farmers in Karnataka and Tamil Nadu. The Tula Sankramana festival in October marks the miraculous annual resurgence of water in the sacred spring (Kundike).',
    deepDive: 'Talakaveri stands at an altitude of 1,276 meters. The surrounding district of Kodagu has a unique martial culture, indigenous Kodava traditions, distinct traditional dress (Kupya Chele), and world-acclaimed Shade-Grown Arabica and Robusta coffees.',
    interestingFacts: [
      'Kodagu produces over 35% of India\'s entire coffee output.',
      'The Kodava community has a centuries-old tradition of worshipping ancestors (Karana) and river Kaveri.',
    ],
    sourcesAndReferences: [
      'Murphy, J. (1876). The Coorg and its Inhabitants.',
      'Kaveri Basin Authority Reports.',
    ],
    relatedVocabulary: [
      { kannada: 'ತಲಕಾವೇರಿ', transliteration: 'Talakaveri', english: 'head/origin of Kaveri' },
      { kannada: 'ಕಾಫಿ ತೋಟ', transliteration: 'kaaphi tota', english: 'coffee estate' },
    ],
    keyPhrase: {
      kannada: 'ಕಾವೇರಿ ನದಿ ಕರ್ನಾಟಕದ ತಾಯಿ.',
      transliteration: 'Kaveri nadi Karnatakada taayi.',
      english: 'River Kaveri is the mother of Karnataka.',
      context: 'Cultural reverence and nature',
    },
  },

  // 12. FOLK ART: YAKSHAGANA
  {
    id: 'art-yakshagana',
    titleEnglish: 'Yakshagana Folk Dance-Drama',
    titleKannada: 'ಯಕ್ಷಗಾನ — ಕರಾವಳಿಯ ಜಾನಪದ ರಂಗಕಲೆ',
    category: 'art',
    categoryLabel: 'Folk Arts & Literature',
    region: 'Coastal and Malenadu Karnataka (Udupi, Dakshina Kannada, Uttara Kannada)',
    isUNESCO: false,
    periodOrDates: 'Over 500 years of recorded living tradition',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Yakshagana Academy of Karnataka',
    shortDescription: 'A dynamic nocturnal theatrical art combining operatic classical poetry, thunderous Chande and Maddale drumming, dramatic spins, and rich makeup.',
    historicalSignificance: 'Yakshagana (literally "Celestial Music") evolved as a people\'s theatre to bring epic literature from the Mahabharata and Ramayana directly to rural agrarian audiences through passionate, improvised Kannada discourse.',
    deepDive: 'Performances run from sunset to sunrise. It features two prominent traditions: Tenkutittu (Southern school, renowned for energetic footwork and Carnatic rhythm influence) and Badagutittu (Northern school, famed for striking costumes, tall headgear or Mudi, and classical dialogues). The Bhagavata acts as narrator and lead singer.',
    interestingFacts: [
      'All dialogue between actors on stage is spontaneous and unscripted, improvised to match the Bhagavata\'s poetic song verses.',
      'Elaborate face makeup (Banna) can take up to 4 hours per artist to apply.',
    ],
    sourcesAndReferences: [
      'Karanth, K. Shivarama (1997). Yakshagana.',
      'Karnataka Janapada Academy Publications.',
    ],
    relatedVocabulary: [
      { kannada: 'ಭಾಗವತ', transliteration: 'Bhaagavata', english: 'lead singer/narrator' },
      { kannada: 'ಚಂಡೆ', transliteration: 'chande', english: 'cylindrical high-pitched drum' },
      { kannada: 'ವೇಷಭೂಷಣ', transliteration: 'veshabhooshana', english: 'elaborate costume & makeup' },
    ],
    keyPhrase: {
      kannada: 'ಯಕ್ಷಗಾನ ಪ್ರದರ್ಶನ ಇಡೀ ರಾತ್ರಿ ಉತ್ಸಾಹದಿಂದ ನಡೆಯುತ್ತದೆ.',
      transliteration: 'Yakshagaana pradarshana idee raatri utsaahadinda nadeyuttade.',
      english: 'The Yakshagana performance takes place all night with electric energy.',
      context: 'Appreciating performing arts',
    },
  },

  // 13. FOLK ART: DOLLU KUNITHA
  {
    id: 'art-dollu-kunitha',
    titleEnglish: 'Dollu Kunitha Folk Drum Dance',
    titleKannada: 'ಡೊಳ್ಳು ಕುಣಿತ',
    category: 'art',
    categoryLabel: 'Folk Arts & Literature',
    region: 'North and Central Karnataka (Kuruba community tradition)',
    isUNESCO: false,
    periodOrDates: 'Ancient pastoral folk tradition',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Department of Kannada and Culture',
    shortDescription: 'High-energy ritual drum dance performed by synchronized troupes with heavy drums tied to their waists.',
    historicalSignificance: 'Associated with the worship of deity Beereshwara (an aspect of Shiva) by the pastoral Kuruba Gowda community, Dollu Kunitha combines athletic acrobatic movements, chanting, and resonant thunderous drumming.',
    deepDive: 'A troupe typically consists of 10 to 12 performers wearing colorful sashes. The leader plays the cymbals (Tala) directing complex tempo changes (Laya) while dancers jump, weave concentric circles, and strike their drums simultaneously.',
    interestingFacts: [
      'The drum (Dollu) is hollowed from mango or jackfruit tree trunks and covered with sheepskin.',
      'It is a staple headliner at state events, including Republic Day parades and Kannada Rajyotsava.',
    ],
    sourcesAndReferences: [
      'Karnataka Folklore University (Haveri) Archive',
      'Janapada Loka Foundation Publications.',
    ],
    relatedVocabulary: [
      { kannada: 'ಡೊಳ್ಳು', transliteration: 'dollu', english: 'large wooden folk drum' },
      { kannada: 'ಕುಣಿತ', transliteration: 'kunita', english: 'dance / rhythmic movement' },
    ],
    keyPhrase: {
      kannada: 'ಡೊಳ್ಳು ಕುಣಿತದ ಬಡಿತ ಮೈ ನವಿರೇಳಿಸುತ್ತದೆ.',
      transliteration: 'Dollu kunitada badita mai navirelisuttade.',
      english: 'The beats of Dollu Kunitha give goosebumps.',
      context: 'Expressing excitement at cultural dance',
    },
  },

  // 14. LITERATURE: VACHANA SAHITYA & BASAVESHWARA
  {
    id: 'lit-vachana',
    titleEnglish: 'Vachana Sahitya & Basaveshwara\'s Anubhava Mantapa',
    titleKannada: 'ವಚನ ಸಾಹಿತ್ಯ ಮತ್ತು ಅನುಭವ ಮಂಟಪ',
    category: 'art',
    categoryLabel: 'Folk Arts & Literature',
    region: 'Kalyana (Basavakalyan), Northern Karnataka',
    isUNESCO: false,
    periodOrDates: '12th Century CE',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Basava Samithi Archives',
    shortDescription: 'Revolutionary 12th-century socio-religious literature composed in simple vernacular Kannada, championing equality, labor dignity (Kayakave Kailasa), and democracy.',
    historicalSignificance: 'Basaveshwara, Akka Mahadevi, Allama Prabhu, and hundreds of Sharanas from all castes established the Anubhava Mantapa—often hailed by historians as one of the world\'s first open socio-spiritual parliaments.',
    deepDive: 'The Vachanas (literally "what is spoken") bypassed Sanskrit scholastic exclusivity, expressing profound metaphysical and social philosophies in rhythmic, direct Kannada prose. Core tenets include "Kayakave Kailasa" (Work is worship) and "Arive Guru" (Knowledge itself is the teacher).',
    interestingFacts: [
      'Akka Mahadevi was one of the earliest prominent female poets in Indian history who renounced worldly clothing and societal constraints in pursuit of spiritual liberation.',
      'The Vachanas used common metaphors like the weaver\'s shuttle, the potter\'s wheel, and the kitchen hearth.',
    ],
    sourcesAndReferences: [
      'Ramanujan, A. K. (1973). Speaking of Siva. Penguin Classics.',
      'Basavaraju, L. (1960). Allamana Vachana Chandrike.',
    ],
    relatedVocabulary: [
      { kannada: 'ಕಾಯಕವೇ ಕೈಲಾಸ', transliteration: 'Kaayakave Kailaasa', english: 'Work is divine worship' },
      { kannada: 'ವಚನ', transliteration: 'vachana', english: 'saying / poetic aphorism' },
    ],
    keyPhrase: {
      kannada: 'ಕಾಯಕವೇ ಕೈಲಾಸ ಎಂಬುದು ಬಸವಣ್ಣನವರ ಮುಖ್ಯ ಸಂದೇಶ.',
      transliteration: 'Kaayakave Kailaasa embudu Basavannanavara mukhya sandesha.',
      english: '"Work is worship" is the core message of Basavanna.',
      context: 'Ethical and literary discussions',
    },
  },

  // 15. CUISINE: BENGALURU DARSHINIS & MASALA DOSA
  {
    id: 'cuisine-dosa',
    titleEnglish: 'Bengaluru Darshinis & Crisp Masala Dosa',
    titleKannada: 'ಬೆಂಗಳೂರು ದರ್ಶಿನಿ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಮಸಾಲಾ ದೋಸೆ',
    category: 'cuisine',
    categoryLabel: 'Culinary Traditions',
    region: 'Bengaluru & Statewide',
    isUNESCO: false,
    periodOrDates: 'Mid-20th Century to Present',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Karnataka Gastronomy Archives',
    shortDescription: 'Crisp golden rice-lentil crepes roasted in pure butter, filled with spiced potato palya, served with coconut chutney and piping-hot sambar.',
    historicalSignificance: 'Darshinis—quick-service, standing, hygienic vegetarian eateries pioneered in Bengaluru by Cafe Darshini in 1983—revolutionized urban dining across South India.',
    deepDive: 'The Karnataka style Masala Dosa (exemplified by legendary joints like Vidyarthi Bhavan, CTR Shri Sagar, and MTR) is distinct from other regions: it features a thicker yet audibly crisp fermented rice-urad batter roasted on heavy cast-iron tawas, brushed with red garlic-chilli chutney, and dolloped with fresh unsalted butter (Benne).',
    interestingFacts: [
      'Vidyarthi Bhavan in Gandhi Bazaar has been serving signature crisp dosas since 1943.',
      'Bengaluru serves an estimated 2 million dosas every single morning.',
    ],
    sourcesAndReferences: [
      'Achaya, K. T. (1998). A Historical Dictionary of Indian Food.',
      'Bangalore Culinary Heritage Society.',
    ],
    relatedVocabulary: [
      { kannada: 'ತಿಂಡಿ', transliteration: 'tindi', english: 'breakfast / light snacks' },
      { kannada: 'ಬೆಣ್ಣೆ', transliteration: 'benne', english: 'butter' },
      { kannada: 'ಚಟ್ನಿ', transliteration: 'chatni', english: 'coconut chutney condiment' },
    ],
    keyPhrase: {
      kannada: 'ಒಂದು ಮಸಾಲಾ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ.',
      transliteration: 'Ondu masala dose mattu bisi philtar kaaphi kodi.',
      english: 'Please give one masala dosa and hot filter coffee.',
      context: 'Ordering food at a Darshini or restaurant',
    },
  },

  // 16. CUISINE: BISI BELE BATH
  {
    id: 'cuisine-bbb',
    titleEnglish: 'Bisi Bele Bath (Hot Lentil Rice)',
    titleKannada: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್',
    category: 'cuisine',
    categoryLabel: 'Culinary Traditions',
    region: 'Mysuru Palace origin, statewide staple',
    isUNESCO: false,
    periodOrDates: 'Originated in Mysuru Palace kitchens, c. 19th Century',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Culinary Guild of Karnataka',
    shortDescription: 'Wholesome one-pot meal combining rice, toor dal, seasonal vegetables, tamarind, and a rich spice blend freshly ground with kapok buds (Marathi Moggu).',
    historicalSignificance: 'Invented by the royal culinary masters in the Mysore Palace to provide royal guests with a nourishing, fragrant, balanced meal, it has become one of Karnataka\'s greatest culinary exports.',
    deepDive: 'Literally translating to "Hot Lentil Rice" in Kannada, the authentic preparation relies on roasting whole spices—cinnamon, cloves, coriander seeds, chana dal, urad dal, fenugreek, and the indispensable Marathi Moggu—before simmering with ghee-roasted cashews and crisp boondi topping.',
    interestingFacts: [
      'Real Bisi Bele Bath powder always contains Marathi Moggu (Kapok buds), which imparts its distinctive royal aroma.',
      'It is traditionally accompanied by fresh potato crisps or cucumber pachadi.',
    ],
    sourcesAndReferences: [
      'Mysore Royal Kitchen Chronicles',
      'Iyengar, M. (1974). Traditional Recipes of the Mysore Court.',
    ],
    relatedVocabulary: [
      { kannada: 'ಬೇಳೆ', transliteration: 'bele', english: 'lentil / dal' },
      { kannada: 'ತುಪ್ಪ', transliteration: 'tuppa', english: 'clarified butter / ghee' },
    ],
    keyPhrase: {
      kannada: 'ಬಿಸಿ ಬೇಳೆ ಬಾತ್ ತುಪ್ಪದ ಜೊತೆ ತುಂಬಾ ರುಚಿಯಾಗಿರುತ್ತದೆ.',
      transliteration: 'Bisi bele baat tuppada jote tumba ruchiyaagiruttade.',
      english: 'Bisi Bele Bath is delicious when eaten with ghee.',
      context: 'Discussing comfort food',
    },
  },

  // 17. CUISINE: MYSORE PAK
  {
    id: 'cuisine-mysore-pak',
    titleEnglish: 'Mysore Pak Royal Sweet',
    titleKannada: 'ಮೈಸೂರು ಪಾಕ್',
    category: 'cuisine',
    categoryLabel: 'Culinary Traditions',
    region: 'Mysuru',
    isUNESCO: false,
    periodOrDates: 'Created in 1935 CE by Kakasura Madappa',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Mysuru Heritage Confectionery Records',
    shortDescription: 'Melt-in-the-mouth royal fudge made from roasted gram flour (besan), sugar syrup (paaka), and generous measures of pure ghee.',
    historicalSignificance: 'Invented in the palace kitchen of Maharaja Krishnaraja Wadiyar IV by royal chef Kakasura Madappa, who experimented with combining sugar syrup (Paka) and ghee. The Maharaja was so delighted he named it "Mysore Pak" and decreed it be shared with citizens outside the palace.',
    deepDive: 'The delicacy comes in two cherished textures: the original porous, crumbly, slightly caramelized royal version and the modern soft, velvety, ghee-rich variant popular across bakeries.',
    interestingFacts: [
      'Guru Sweets on Sayyaji Rao Road in Mysuru is still run by Kakasura Madappa\'s great-grandsons following the original royal recipe.',
      'Ranked by international culinary guides among the top ten street sweet delicacies in the world.',
    ],
    sourcesAndReferences: [
      'Madappa Family Heritage Records, Mysuru',
      'TasteAtlas World Sweets Index (2023).',
    ],
    relatedVocabulary: [
      { kannada: 'ಸಿಹಿ', transliteration: 'sihi', english: 'sweet delicacy' },
      { kannada: 'ಪಾಕ', transliteration: 'paaka', english: 'sugar syrup texture' },
    ],
    keyPhrase: {
      kannada: 'ಮೈಸೂರು ಪಾಕ್ ಬಾಯಲ್ಲಿಟ್ಟರೆ ಕರಗುತ್ತದೆ.',
      transliteration: 'Mysore paak baayillittare karaguttade.',
      english: 'Mysore Pak melts the moment you put it in your mouth.',
      context: 'Describing sweet treats',
    },
  },

  // 18. CUISINE: KARAVALI & MANGALOREAN CUISINE
  {
    id: 'cuisine-karavali',
    titleEnglish: 'Karavali Coastal Cuisine & Neer Dosa',
    titleKannada: 'ಕರಾವಳಿ ಊಟ ಮತ್ತು ನೀರ್ ದೋಸೆ',
    category: 'cuisine',
    categoryLabel: 'Culinary Traditions',
    region: 'Udupi, Mangaluru, Karwar',
    isUNESCO: false,
    periodOrDates: 'Centuries-old coastal tradition',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Karavali Food Heritage Guild',
    shortDescription: 'Delicate water-thin lace crepes (Neer Dosa), Mangalorean Ghee Roast, Kori Rotti, fresh coconut curries, and Solkadhi.',
    historicalSignificance: 'The coastal belt (Karavali) blends indigenous Tuluva, Konkani, and Navayathi culinary practices, celebrated for utilizing fresh coconut, Byadgi chillies, kokum (Punar Puli), and seafood.',
    deepDive: 'Neer Dosa ("Water Dosa") requires no fermentation: fine ground rice batter is swirled paper-thin on heated iron pans, resulting in cloud-soft white crepes served alongside coconut jaggery or fiery Kundapur chicken and fish curries.',
    interestingFacts: [
      'Byadgi chillies from Haveri/Dharwad give Mangalorean curries deep crimson color without overpowering heat.',
      'Kori Rotti pairs sun-dried crisp rice sheets with hot chicken gravy, softening the sheets in seconds.',
    ],
    sourcesAndReferences: [
      'Shenoy, P. (2008). Flavors of the Coast: Udupi and Mangalore Cooking.',
    ],
    relatedVocabulary: [
      { kannada: 'ನೀರ್ ದೋಸೆ', transliteration: 'neer dose', english: 'water-thin soft rice crepe' },
      { kannada: 'ತೆಂಗಿನಕಾಯಿ', transliteration: 'tenginakaayi', english: 'coconut' },
    ],
    keyPhrase: {
      kannada: 'ಕರಾವಳಿಯ ನೀರ್ ದೋಸೆ ಮತ್ತು ಚಟ್ನಿ ಹಗುರವಾಗಿರುತ್ತದೆ.',
      transliteration: 'Karavaliya neer dose mattu chatni haguravaagiruttade.',
      english: 'Coastal Neer Dosa and coconut chutney are delightfully light.',
      context: 'Breakfast and coastal culinary conversations',
    },
  },

  // 19. FESTIVAL: MYSURU DASARA (NADA HABBA)
  {
    id: 'fest-dasara',
    titleEnglish: 'Mysuru Dasara — The State Festival (Nada Habba)',
    titleKannada: 'ಮೈಸೂರು ದಸರಾ — ನಾಡಹಬ್ಬ',
    category: 'festival',
    categoryLabel: 'Festivals & Celebrations',
    region: 'Mysuru & Statewide',
    isUNESCO: false,
    periodOrDates: 'Ashvina month (September/October), celebrated over 400 years',
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Department of Information & Public Relations, Karnataka',
    shortDescription: 'The 10-day state festival celebrating Goddess Chamundeshwari\'s victory over demon Mahishasura, culminating in the Jumboo Savari procession.',
    historicalSignificance: 'Started by Raja Wodeyar I in 1610 CE at Srirangapatna carrying forward the Vijayanagara festive tradition, Dasara is designated as Karnataka\'s official "Nada Habba" (State Festival).',
    deepDive: 'The final day (Vijayadashami) features the iconic Jumboo Savari, where the lead tusker carries the 750-kilogram golden howdah (Chinnada Ambari) containing the idol of Goddess Chamundeshwari through 5 kilometers of decorated streets, accompanied by folk artists, cavalry, and cultural tableaux from all 31 districts of Karnataka.',
    interestingFacts: [
      'The lead elephant undergoes months of rigorous training with sandbags to comfortably carry the 750 kg golden howdah.',
      'Over 1 million tourists gather in Mysuru during the 10 days of Dasara.',
    ],
    sourcesAndReferences: [
      'Mysore State Gazetteer',
      'Wadiyar, S. (2005). The Grand Dasara Tradition of Mysore.',
    ],
    relatedVocabulary: [
      { kannada: 'ನಾಡಹಬ್ಬ', transliteration: 'naadahabba', english: 'state festival' },
      { kannada: 'ಚಿನ್ನದ ಅಂಬಾರಿ', transliteration: 'chinnada ambaari', english: 'golden elephant howdah' },
      { kannada: 'ಮೆರವಣಿಗೆ', transliteration: 'meravanige', english: 'grand procession' },
    ],
    keyPhrase: {
      kannada: 'ದಸರಾ ಮೆರವಣಿಗೆ ನೋಡಲು ದೇಶ-ವಿದೇಶಗಳಿಂದ ಜನರು ಬರುತ್ತಾರೆ.',
      transliteration: 'Dasara meravanige nodalu desha-videshagalinda janaru baruttaare.',
      english: 'People from across India and the world arrive to watch the Dasara procession.',
      context: 'Discussing major state celebrations',
    },
  },

  // 20. FESTIVAL: KANNADA RAJYOTSAVA
  {
    id: 'fest-rajyotsava',
    titleEnglish: 'Kannada Rajyotsava (Karnataka Formation Day)',
    titleKannada: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ',
    category: 'festival',
    categoryLabel: 'Festivals & Celebrations',
    region: 'Statewide and Global Kannada Diaspora',
    isUNESCO: false,
    periodOrDates: '1st of November annually (Since 1956)',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Government of Karnataka Official Portal',
    shortDescription: 'Celebrates the unification of all Kannada-speaking regions into a single state on November 1, 1956, marked by hoisting the red-and-yellow flag.',
    historicalSignificance: 'The Ekikarana (unification) movement led by leaders like Aluru Venkata Rao united Kannada-speaking areas scattered across the Bombay Presidency, Madras Presidency, Hyderabad State, and princely Mysore into Mysore State, officially renamed "Karnataka" on November 1, 1973 under Chief Minister D. Devaraj Urs.',
    deepDive: 'The red-and-yellow Kannada flag (designed by Ma. Ramamurthy in the 1960s) flutters across city squares, autorickshaws, IT campuses, and schools. The State Rajyotsava Awards honor distinguished achievers in literature, science, social service, agriculture, and arts.',
    interestingFacts: [
      'The word "Karnataka" derives from "Karu-Nadu", anciently meaning "Elevated Land" or "Black Soil Land".',
      'The red and yellow colors symbolize turmeric (Arishina) and kumkum (Kumkuma), representing auspiciousness and peace.',
    ],
    sourcesAndReferences: [
      'Kamat, S. U. (1980). A Concise History of Karnataka.',
      'Aluru Venkata Rao (1907). Karnataka Gatha Vaibhava.',
    ],
    relatedVocabulary: [
      { kannada: 'ರಾಜ್ಯೋತ್ಸವ', transliteration: 'Raajyotsava', english: 'state foundation festival' },
      { kannada: 'ಏಕೀಕರಣ', transliteration: 'ekeekarana', english: 'unification movement' },
      { kannada: 'ಧ್ವಜ', transliteration: 'dhwaja', english: 'flag / banner' },
    ],
    keyPhrase: {
      kannada: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!',
      transliteration: 'Kannada Raajyotsavada haardika shubhaashayagalu!',
      english: 'Warmest greetings for Kannada Rajyotsava!',
      context: 'Wishing friends and colleagues on November 1st',
    },
  },

  // 21. FESTIVAL: KAMBALA (COASTAL BUFFALO RACE)
  {
    id: 'fest-kambala',
    titleEnglish: 'Kambala — Traditional Slush Buffalo Race',
    titleKannada: 'ಕಂಬಳ — ಕರಾವಳಿಯ ಜಾನಪದ ಕ್ರೀಡೆ',
    category: 'festival',
    categoryLabel: 'Festivals & Celebrations',
    region: 'Dakshina Kannada and Udupi Districts',
    isUNESCO: false,
    periodOrDates: 'Winter season (November to March)',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Kambala Samithi Karnataka',
    shortDescription: 'Ancient annual rural sport where jockeys sprint through waterlogged paddy slush tracks holding reins of a pair of speeding buffaloes.',
    historicalSignificance: 'Rooted in 1,000-year-old agricultural thanksgiving rituals to deities for healthy crops, Kambala is organized by royal and agricultural households across the Tulu Nadu coast.',
    deepDive: 'Modern Kambala events use laser sensors for split-second timing on double-track slush paddies. Jockeys train for exceptional physical fitness and balance, running barefoot through knee-deep mud alongside two tethered buffaloes.',
    interestingFacts: [
      'Kambala jockey Srinivasa Gowda drew international acclaim in 2020 by sprinting 100 meters in 9.55 seconds in slush tracks.',
      'The buffalo pairs are cared for like family members and trained on specialized diets of grass, boiled grains, and oil massages.',
    ],
    sourcesAndReferences: [
      'Bhat, N. S. (1998). Tulunadu: History and Culture.',
      'District Administration Dakshina Kannada Cultural Series.',
    ],
    relatedVocabulary: [
      { kannada: 'ಕೋಣ', transliteration: 'kona', english: 'he-buffalo' },
      { kannada: 'ಗದ್ದೆ', transliteration: 'gadde', english: 'paddy field' },
    ],
    keyPhrase: {
      kannada: 'ಕಂಬಳದ ಓಟ ಅತ್ಯಂತ ರೋಮಾಂಚಕವಾಗಿರುತ್ತದೆ.',
      transliteration: 'Kambalada ota atyanta romanchakavaagiruttade.',
      english: 'The Kambala race is thrilling to witness.',
      context: 'Sports and folk traditions',
    },
  },

  // 22. CITY: BENGALURU
  {
    id: 'city-bengaluru',
    titleEnglish: 'Bengaluru (Garden City to Silicon Capital)',
    titleKannada: 'ಬೆಂಗಳೂರು — ಉದ್ಯಾನ ನಗರಿ ಮತ್ತು ಸಿಲಿಕಾನ್ ವ್ಯಾಲಿ',
    category: 'city',
    categoryLabel: 'Major Cities & Regions',
    region: 'Bengaluru Urban, Southern Karnataka',
    isUNESCO: false,
    periodOrDates: 'Founded 1537 CE by Kempe Gowda I',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Department of Tourism, Karnataka',
    shortDescription: 'Karnataka\'s cosmopolitan state capital balancing lush 240-acre Lalbagh and Cubbon Park gardens with India\'s premier aerospace and software epicenter.',
    historicalSignificance: 'Founded in 1537 by chieftain Hiriya Kempe Gowda with a mud fort and four boundary watchtowers, Bengaluru evolved through Tipu Sultan\'s summer retreat and the British cantonment into India\'s innovation engine.',
    deepDive: 'The granite legislature Vidhana Soudha, built under Chief Minister Kengal Hanumanthaiah with the inscription "ಸರ್ಕಾರದ ಕೆಲಸ ದೇವರ ಕೆಲಸ" (Government work is God\'s work), anchors the city center alongside premier research institutions like the Indian Institute of Science (IISc), ISRO, and HAL.',
    interestingFacts: [
      'The earliest reference to "Bengalooru" appears on a 9th-century CE Ganga stone inscription discovered in Begur village.',
      'Bengaluru sits at an altitude of over 920 meters (3,000 feet) above sea level, giving it pleasant year-round weather.',
    ],
    sourcesAndReferences: [
      'Rice, B. L. (1894). Epigraphia Carnatica Vol. IX.',
      'Pani, N., Radhakrishna, S., & Bhat, K. G. (2010). Bengaluru: Bangalore: Idea of an Emerging City.',
    ],
    relatedVocabulary: [
      { kannada: 'ಉದ್ಯಾನ ನಗರಿ', transliteration: 'udyaana nagari', english: 'garden city' },
      { kannada: 'ವಿಧಾನ ಸೌಧ', transliteration: 'Vidhaana Soudha', english: 'State Capitol legislative house' },
    ],
    keyPhrase: {
      kannada: 'ಸರ್ಕಾರದ ಕೆಲಸ ದೇವರ ಕೆಲಸ.',
      transliteration: 'Sarkaarda kelasa devara kelasa.',
      english: 'Government work is God\'s work (motto etched on Vidhana Soudha).',
      context: 'Landmarks and civic motto',
    },
  },

  // 23. CITY: HUBBALLI-DHARWAD
  {
    id: 'city-hubballi-dharwad',
    titleEnglish: 'Hubballi-Dharwad — Cradle of Hindustani Music & Literature',
    titleKannada: 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ — ಸಾಹಿತ್ಯ ಮತ್ತು ಸಂಗೀತದ ನೆಲೆವೀಡು',
    category: 'city',
    categoryLabel: 'Major Cities & Regions',
    region: 'Dharwad District, North Karnataka',
    isUNESCO: false,
    periodOrDates: 'Ancient trade and cultural twin cities',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Dharwad Heritage Documentation',
    shortDescription: 'Twin cities famed as Karnataka\'s second-largest urban agglomeration, celebrated for producing Hindustani classical legends, Jnanpith laureates, and Dharwad Peda.',
    historicalSignificance: 'Dharwad has fostered India\'s greatest classical vocalists, including Bharat Ratna Pandit Bhimsen Joshi, Gangubai Hangal, Pandit Mallikarjun Mansur, and Pandit Basavaraj Rajguru.',
    deepDive: 'The city is home to Karnatak University and was the creative home of Jnanpith poet Da. Ra. Bendre. Dharwad\'s climate and red soil are also home to the famous Babusingh Thakur Dharwad Peda, awarded a Geographical Indication (GI) tag.',
    interestingFacts: [
      'Dharwad Peda is made from caramelized milk (khoya) rolled in castor sugar and dates back to 1840.',
      'Hubballi features the world\'s longest railway platform at Shree Siddharoodha Swamiji railway station (1,507 meters).',
    ],
    sourcesAndReferences: [
      'Gazetteer of Bombay Presidency: Dharwar District (1884)',
      'Bendre, D. R. (Poetry compilations and cultural memoirs).',
    ],
    relatedVocabulary: [
      { kannada: 'ಸಂಗೀತಗಾರರು', transliteration: 'sangeetagaararu', english: 'musicians' },
      { kannada: 'ಪೇಡಾ', transliteration: 'peda', english: 'traditional milk sweet' },
    ],
    keyPhrase: {
      kannada: 'ಧಾರವಾಡದ ಪೇಡಾ ಜಗತ್ಪ್ರಸಿದ್ಧ.',
      transliteration: 'Dhaarwaadada peda jagatprasiddha.',
      english: 'Dharwad\'s Peda is world-famous.',
      context: 'Food and regional fame',
    },
  },

  // 24. CITY: MANGALURU
  {
    id: 'city-mangaluru',
    titleEnglish: 'Mangaluru (Gateway to Karnataka Coast)',
    titleKannada: 'ಮಂಗಳೂರು — ಕರಾವಳಿಯ ಹೆಬ್ಬಾಗಿಲು',
    category: 'city',
    categoryLabel: 'Major Cities & Regions',
    region: 'Dakshina Kannada District, Arabian Sea Coast',
    isUNESCO: false,
    periodOrDates: 'Ancient port city (Documented in Roman trade records)',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'New Mangalore Port Authority Archives',
    shortDescription: 'Port city bordered by the Arabian Sea and Western Ghats, named after Goddess Mangaladevi, famous for banking, seafood, and multi-lingual warmth.',
    historicalSignificance: 'Known as the "Cradle of Indian Banking" for giving birth to major nationalized banks (Canara Bank, Syndicate Bank, Corporation Bank, Vijaya Bank, and Karnataka Bank).',
    deepDive: 'Mangaluru harmoniously unites speakers of Tulu, Kannada, Konkani, Byari, and Beary languages. Key attractions include the Mangaladevi Temple (9th century), Kadri Manjunatha Temple (housing bronze Buddhist statues from the 10th century), and St. Aloysius Chapel with Italian frescoes.',
    interestingFacts: [
      'Over 75% of India\'s cashew and coffee export shipments pass through the New Mangalore Port.',
      'The Kadri Manjunatha Temple bronze Lokeshwara statue is recognized as one of the finest bronze sculptures in Asia.',
    ],
    sourcesAndReferences: [
      'Sturrock, J. (1894). Madras District Manuals: South Canara.',
      'Archaeological Reports of Coastal Karnataka.',
    ],
    relatedVocabulary: [
      { kannada: 'ಬಂದರು', transliteration: 'bandaru', english: 'sea port' },
      { kannada: 'ಕರಾವಳಿ', transliteration: 'karavali', english: 'coastline' },
    ],
    keyPhrase: {
      kannada: 'ಮಂಗಳೂರಿನ ಕಡಲತೀರಗಳು ಶಾಂತಿಯುತವಾಗಿವೆ.',
      transliteration: 'Mangaloorina kadalateeragalu shaantiyutavaagive.',
      english: 'Mangalore\'s beaches are peaceful.',
      context: 'Travel and leisure',
    },
  },

  // 25. ETIQUETTE: FOLDED HANDS GREETING & RESPECT
  {
    id: 'etiq-namaskara',
    titleEnglish: 'Everyday Etiquette: Namaskara & Polite Speech',
    titleKannada: 'ಕನ್ನಡದ ದಿನನಿತ್ಯದ ಶಿಷ್ಟಾಚಾರ ಮತ್ತು ಮರ್ಯಾದೆ',
    category: 'etiquette',
    categoryLabel: 'Everyday Etiquette & Culture',
    region: 'Statewide',
    isUNESCO: false,
    periodOrDates: 'Timeless cultural practice',
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Karnataka Cultural Norms Guide',
    shortDescription: 'The respectful foundations of Kannada social etiquette: folding hands with "Namaskara", using honorific pronouns "Neevu", and offering food.',
    historicalSignificance: 'Kannada society places deep value on humility, warmth towards guests (Atithi Devo Bhava), and polite generational respect.',
    deepDive: 'When addressing strangers, elders, shopkeepers, or service personnel, polite Kannada uses plural honorific pronouns ("ನೀವು" / Neevu instead of "ನೀನು" / Neenu) and verb suffixes like "-ರಿ" (-ri) or "-ಇರಿ" (-iri). Common polite greetings include "ನಮಸ್ಕಾರ ರೀ" (Namaskara ree).',
    interestingFacts: [
      'Asking "ಊಟ ಆಯ್ತಾ?" (Did you have food?) is used as a warm greeting equivalent to "How are you?" throughout Karnataka.',
      'Removing footwear before entering homes and shops is standard practice across Karnataka.',
    ],
    sourcesAndReferences: [
      'Upadhyaya, U. P. (1988). Conversational Kannada: Sociolinguistic Studies.',
    ],
    relatedVocabulary: [
      { kannada: 'ಮರ್ಯಾದೆ', transliteration: 'maryaade', english: 'respect / courtesy' },
      { kannada: 'ನಮಸ್ಕಾರ', transliteration: 'namaskara', english: 'polite greeting' },
      { kannada: 'ನೀವು', transliteration: 'neevu', english: 'you (polite/formal)' },
    ],
    keyPhrase: {
      kannada: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
      transliteration: 'Namaskaara, neevu hegiddeeri?',
      english: 'Hello, how are you? (polite)',
      context: 'Daily respectful social interactions',
    },
  },

  // 26. ETIQUETTE: KAAPI CULTURE
  {
    id: 'etiq-kaapi',
    titleEnglish: 'Filter Kaapi Culture & Tumbler-Davarah',
    titleKannada: 'ಫಿಲ್ಟರ್ ಕಾಫಿ ಸಂಸ್ಕೃತಿ ಮತ್ತು ದವರಾ-ಲೋಟ',
    category: 'etiquette',
    categoryLabel: 'Everyday Etiquette & Culture',
    region: 'Statewide: Mysuru, Bengaluru, Malenadu',
    isUNESCO: false,
    periodOrDates: 'Introduced 17th Century by Baba Budan; perfected 20th Century',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Coffee Board of India, Bengaluru',
    shortDescription: 'The ritual of freshly brewed South Indian filter coffee poured with high frothing arcs between brass davarah and tumbler.',
    historicalSignificance: 'Legend documents that Sufi saint Baba Budan smuggled seven raw coffee beans from Yemen in 1670 CE and planted them in the Chandradrona hills of Chikkamagaluru, establishing India\'s first coffee estates.',
    deepDive: 'Kannada filter coffee is brewed using a brass percolation filter with medium-roast peaberry and plantation seeds blended with 15–20% chicory for body. It is served piping hot with boiled, full-cream milk, aerated into frothy perfection.',
    interestingFacts: [
      'Coffee Board of India headquarters is permanently based in Bengaluru.',
      'The gesture of pouring coffee from a height to cool it without losing foam is known as "meter kaapi" or "by-two kaapi".',
    ],
    sourcesAndReferences: [
      'Coffee Board of India Historical Monographs',
      'Wild, A. (2005). Coffee: A Dark History.',
    ],
    relatedVocabulary: [
      { kannada: 'ಕಾಫಿ', transliteration: 'kaaphi', english: 'coffee' },
      { kannada: 'ದವರಾ-ಲೋಟ', transliteration: 'davara-lota', english: 'brass wide saucer and tumbler' },
    ],
    keyPhrase: {
      kannada: 'ಬಿಸಿ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕುಡಿಯೋಣ ಬನ್ನಿ.',
      transliteration: 'Bisi bisi philtar kaaphi kudiyona banni.',
      english: 'Come, let us have piping hot filter coffee.',
      context: 'Hospitality and catching up with friends',
    },
  },

  // 27. MONUMENT: BELAVADI VEERANARAYANA TEMPLE
  {
    id: 'monument-belavadi',
    titleEnglish: 'Veera Narayana Temple of Belavadi',
    titleKannada: 'ಬೆಳವಾಡಿಯ ವೀರನಾರಾಯಣ ದೇವಾಲಯ',
    category: 'monument',
    categoryLabel: 'Historical Monuments',
    region: 'Chikkamagaluru District',
    isUNESCO: false,
    periodOrDates: '1200 CE (Hoysala King Veera Ballala II)',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a8747?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Archaeological Survey of India',
    shortDescription: 'Tri-kuta (triple-shrine) Hoysala temple with 108 lathe-turned polished stone pillars and an eight-foot idol of Veera Narayana.',
    historicalSignificance: 'Built by King Veera Ballala II, this temple is linked in regional folklore to Ekachakranagara of the Mahabharata, where Pandava prince Bhima defeated demon Bakasura.',
    deepDive: 'The central shrine features an eight-foot-tall idol of Narayana in standing posture, celebrated by art historians as one of the finest examples of Hoysala iconography. On the vernal equinox, sunlight passes directly through all doorways to illuminate the idol\'s sanctum.',
    interestingFacts: [
      'Every year on March 23, the morning sun rays strike directly on the deity\'s forehead through 7 doorways.',
      'The stone lathe-turned pillars inside have mirror-like reflective polish after 800 years.',
    ],
    sourcesAndReferences: [
      'Archaeological Survey of India Guidebook: Belavadi',
      'Dhaky, M. A. (1977). The Indian Temple Forms in Karnata Inscriptions and Architecture.',
    ],
    relatedVocabulary: [
      { kannada: 'ತ್ರಿಕೂಟ', transliteration: 'trikuta', english: 'three-shrined temple architecture' },
      { kannada: 'ಕಂಬ', transliteration: 'kamba', english: 'stone pillar' },
    ],
    keyPhrase: {
      kannada: 'ಬೆಳವಾಡಿಯ ಕಂಬಗಳ ಹೊಳಪು ಕನ್ನಡ ಶಿಲ್ಪಿಗಳ ಕೈಚಳಕವನ್ನು ತೋರುತ್ತದೆ.',
      transliteration: 'Belawaadiya kambagala holapu Kannada shilpigala kaichalakavannu toruttade.',
      english: 'The sheen of Belavadi\'s pillars displays the mastery of Kannada sculptors.',
      context: 'Architecture and historical marvels',
    },
  },

  // 28. MONUMENT: SRIRANGAPATNA ISLAND FORTRESS
  {
    id: 'monument-srirangapatna',
    titleEnglish: 'Srirangapatna River Island & Fort',
    titleKannada: 'ಶ್ರೀರಂಗಪಟ್ಟಣ ನಡುಗಡ್ಡೆ ಮತ್ತು ಕೋಟೆ',
    category: 'monument',
    categoryLabel: 'Historical Monuments',
    region: 'Mandya District, Kaveri River Island',
    isUNESCO: false,
    periodOrDates: '9th Century CE onwards (Capital of Hyder Ali & Tipu Sultan)',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'ASI Bengaluru Circle',
    shortDescription: 'Historic river island enclosed by the Kaveri River, featuring the ancient Sri Ranganathaswamy Temple, Dariya Daulat Bagh, and Tipu Sultan\'s Fort.',
    historicalSignificance: 'Capital of the Kingdom of Mysore under Hyder Ali and Tipu Sultan, Srirangapatna was the battleground of the Anglo-Mysore Wars that shaped the history of colonial India in 1799.',
    deepDive: 'Key monuments include the Ranganathaswamy Temple (consecrated 894 CE), the Dariya Daulat Bagh (Tipu Sultan\'s teakwood Summer Palace covered in mural paintings of the Battle of Pollilur), and the Gumbaz containing the tombs of Hyder Ali, Fakhr-un-Nisa, and Tipu Sultan.',
    interestingFacts: [
      'Tipu Sultan pioneered military iron-cased rockets from Srirangapatna, which directly inspired Britain\'s Congreve rockets.',
      'The entire town is an oval-shaped island formed by two bifurcating arms of the Kaveri River.',
    ],
    sourcesAndReferences: [
      'Bowring, L. B. (1893). Haidar Ali and Tipu Sultan.',
      'ASI Srirangapatna Circle Reports.',
    ],
    relatedVocabulary: [
      { kannada: 'ನಡುಗಡ್ಡೆ', transliteration: 'nadugadde', english: 'river island' },
      { kannada: 'ಇತಿಹಾಸ', transliteration: 'itihaasa', english: 'history' },
    ],
    keyPhrase: {
      kannada: 'ಕಾವೇರಿ ನದಿಯ ನಡುವೆ ಇರುವ ಶ್ರೀರಂಗಪಟ್ಟಣ ಐತಿಹಾಸಿಕ ತಾಣ.',
      transliteration: 'Kaveri nadiya naduve iruva Srirangapattana aitihasika taana.',
      english: 'Srirangapatna situated in the midst of the Kaveri river is a historic site.',
      context: 'History and monument tours',
    },
  },

  // 29. ARCHITECTURE: AIHOLE — CRADLE OF HINDU TEMPLE ARCHITECTURE
  {
    id: 'arch-aihole',
    titleEnglish: 'Aihole — The Laboratory of Indian Architecture',
    titleKannada: 'ಐಹೊಳೆ — ಭಾರತೀಯ ದೇವಾಲಯ ವಾಸ್ತುಶಿಲ್ಪದ ತೊಟ್ಟಿಲು',
    category: 'architecture',
    categoryLabel: 'Architectural Landmarks',
    region: 'Bagalkot District, Malaprabha Valley',
    isUNESCO: false,
    periodOrDates: '5th–8th Century CE (Early Chalukyas)',
    image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Archaeological Survey of India',
    shortDescription: 'Over 120 stone temples where master sculptors experimented with apsidal plans, stepped roofs, and carved relief prototypes.',
    historicalSignificance: 'Regarded by world art historians as the "Cradle of Indian Temple Architecture", Aihole was where early Chalukyan artisans tested experimental designs before executing larger projects in Badami and Pattadakal.',
    deepDive: 'The apsidal Durga Temple features a Buddhist chaitya-like semicircular ambulatory hall wrapped in Hindu relief carvings. The Meguti Hill Jain temple contains the famed 634 CE Sanskrit Aihole Inscription authored by court poet Ravikirti, detailing Pulakeshin II\'s historic defeat of North Indian Emperor Harsha on the banks of the Narmada.',
    interestingFacts: [
      'The famous 634 CE Aihole inscription provides one of the earliest verifiable epigraphical dates mentioning Mahabharata poet Kalidasa and Bharavi.',
      'Contains 120 stone temples clustered within a single 5 square kilometer agrarian village.',
    ],
    sourcesAndReferences: [
      'Gupte, R. S. (1967). The Art and Architecture of Aihole.',
      'Epigraphia Indica Vol. VI (Aihole Inscription of Pulakeshin II).',
    ],
    relatedVocabulary: [
      { kannada: 'ತೊಟ್ಟಿಲು', transliteration: 'tottilu', english: 'cradle / origin' },
      { kannada: 'ಶಾಸನ', transliteration: 'shaasana', english: 'stone inscription / edict' },
    ],
    keyPhrase: {
      kannada: 'ಐಹೊಳೆಯಲ್ಲಿ ಭಾರತೀಯ ದೇವಾಲಯ ಶಿಲ್ಪಕಲೆಯ ಮೊದಲ ಪ್ರಯೋಗಗಳು ನಡೆದವು.',
      transliteration: 'Aiholeyalli Bhaarateeya devaalaya shilpakaleya modala prayogagalu nadedavu.',
      english: 'The earliest experiments of Indian temple architecture took place in Aihole.',
      context: 'Art historical scholarship',
    },
  },

  // 30. LITERATURE: JNANPITH TRADITION OF KANNADA
  {
    id: 'lit-jnanpith',
    titleEnglish: 'Kannada Literature & The Eight Jnanpith Laureates',
    titleKannada: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಮತ್ತು ಎಂಟು ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು',
    category: 'art',
    categoryLabel: 'Folk Arts & Literature',
    region: 'Statewide',
    isUNESCO: false,
    periodOrDates: 'Classical language with 2,000+ years of continuous literature',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Sahitya Akademi & Kannada Sahitya Parishat',
    shortDescription: 'Kannada has earned eight Jnanpith Awards—the highest literary honor in India—second only to Hindi, demonstrating its profound creative vitality.',
    historicalSignificance: 'Formally recognized as a Classical Language of India in 2008, Kannada boasts continuous literary records from the 450 CE Halmidi Inscription and Kavirajamarga (850 CE) through medieval Vachanas, Dasa Sahitya, to modern Navodaya masterpieces.',
    deepDive: 'The eight Jnanpith laureates are: Kuvempu (K. V. Puttappa, Sri Ramayana Darshanam), Da. Ra. Bendre (Naaku Tanti), K. Shivarama Karanth (Mookajjiya Kanasugalu), Masti Venkatesha Iyengar (Chikkaveera Rajendra), V. K. Gokak (Bharatha Sindhu Rashmi), U. R. Ananthamurthy (Samskara), Girish Karnad (drama and dramaturgy), and Chandrashekhara Kambara.',
    interestingFacts: [
      'Kavirajamarga (850 CE) describes the boundaries of Kannada as stretching from the Kaveri River to the Godavari River.',
      'Kuvempu was the first Kannada author to receive the Jnanpith Award in 1967.',
    ],
    sourcesAndReferences: [
      'Narasimhachar, R. (1988). History of Kannada Literature.',
      'Kannada Sahitya Parishat Bangalore Records.',
    ],
    relatedVocabulary: [
      { kannada: 'ಜ್ಞಾನಪೀಠ', transliteration: 'Jnaanapeetha', english: 'India\'s highest literary award' },
      { kannada: 'ಕವಿ / ಸಾಹಿತಿ', transliteration: 'kavi / saahiti', english: 'poet / literary writer' },
      { kannada: 'ಶಾಸ್ತ್ರೀಯ ಭಾಷೆ', transliteration: 'shaastreeya bhaashe', english: 'classical language' },
    ],
    keyPhrase: {
      kannada: 'ಕನ್ನಡ ಸಾಹಿತ್ಯಕ್ಕೆ ಎಂಟು ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು ಸಂದಿವೆ.',
      transliteration: 'Kannada saahityakke entu Jnaanapeetha prashastigalu sandive.',
      english: 'Kannada literature has been honored with eight Jnanpith awards.',
      context: 'Literary discussions and cultural pride',
    },
  },

  // 31. FESTIVAL: UGADI (KANNADA NEW YEAR)
  {
    id: 'fest-ugadi',
    titleEnglish: 'Ugadi — The Kannada New Year',
    titleKannada: 'ಯುಗಾದಿ — ಹೊಸ ವರುಷದ ಹಬ್ಬ',
    category: 'festival',
    categoryLabel: 'Festivals & Celebrations',
    region: 'Statewide',
    isUNESCO: false,
    periodOrDates: 'Chaitra Shuddha Padyami (March/April)',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'Department of Culture, Karnataka',
    shortDescription: 'The arrival of spring and commencement of the Shalivahana Shaka calendar, marked by the symbolic tasting of bittersweet Bevu-Bella.',
    historicalSignificance: 'Ugadi (from Yuga + Aadi, meaning "beginning of an era") symbolizes renewal of nature. The core ritual of eating "Bevu-Bella" (bitter neem flowers and sweet jaggery) conveys life\'s eternal philosophical truth: accept joy and sorrow with equanimity.',
    deepDive: 'Families hang fresh green mango leaves (Torana) at entrances, draw intricate rangolis, read the annual astronomical almanac (Panchanga Shravana), and prepare sweet Holige / Obbattu (stuffed sweet flatbreads).',
    interestingFacts: [
      'The Bevu-Bella mixture combines 6 distinct tastes: sweet (jaggery), bitter (neem flowers), tangy (raw mango), sour (tamarind), spicy (pepper/chilli), and salty (salt).',
      'The Shalivahana Shaka calendar used on Ugadi was inaugurated in 78 CE by king Shalivahana.',
    ],
    sourcesAndReferences: [
      'Dharampal (1971). Indian Science and Technology in the Eighteenth Century.',
      'Srinivas, M. N. (1976). The Remembered Village.',
    ],
    relatedVocabulary: [
      { kannada: 'ಬೇವು-ಬೆಲ್ಲ', transliteration: 'bevu-bella', english: 'neem and jaggery mix' },
      { kannada: 'ಹೊಸ ವರ್ಷ', transliteration: 'hosa varsha', english: 'new year' },
    ],
    keyPhrase: {
      kannada: 'ಯುಗಾದಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! ಜೀವನದಲ್ಲಿ ಸಿಹಿ-ಕಹಿ ಸಮನಾಗಿರಲಿ.',
      transliteration: 'Yugaadi habbada haardika shubhaashayagalu! Jeevanadalli sihi-kahi samanaagirali.',
      english: 'Happy Ugadi wishes! May joy and sorrow be balanced in life.',
      context: 'New year festive greetings',
    },
  },

  // 32. MONUMENT: BIDAR FORT & MAHMUD GAWAN MADRASA
  {
    id: 'monument-bidar',
    titleEnglish: 'Bidar Fort & Mahmud Gawan Madrasa',
    titleKannada: 'ಬೀದರ್ ಕೋಟೆ ಮತ್ತು ಮಹಮೂದ್ ಗವಾನ್ ಮದರಸಾ',
    category: 'monument',
    categoryLabel: 'Historical Monuments',
    region: 'Bidar District, Northern Karnataka',
    isUNESCO: false,
    periodOrDates: '14th–15th Century CE (Bahmani Sultanate)',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1000&q=80',
    imageAttribution: 'ASI Hyderabad-Bidar Circle',
    shortDescription: 'Monumental red laterite cliff fortress featuring Persian mosaic tiles, the underground Karez water system, and renowned Bidriware metallic art.',
    historicalSignificance: 'Bidar was the capital of the Bahmani Sultanate and Barid Shahi dynasty. Mahmud Gawan\'s Madrasa (1472 CE) housed a world-famous 3,000-manuscript library and scholars from Central Asia and Persia.',
    deepDive: 'Bidar Fort boasts triple-moated fortifications carved directly into rocky plateau laterite. The city is the birthplace of Bidriware—a registered GI art form where delicate pure silver sheets are hammered into zinc-copper alloy and darkened with soil from the fort.',
    interestingFacts: [
      'Bidar possesses one of India\'s most complete "Karez" systems—subterranean aqueducts engineered to tap groundwater without pumps.',
      'Bidriware metal craft soil can only be sourced from specific unpolluted courtyards inside Bidar Fort.',
    ],
    sourcesAndReferences: [
      'Yazdani, G. (1947). Bidar: Its History and Monuments. Oxford University Press.',
      'Archaeological Survey of India.',
    ],
    relatedVocabulary: [
      { kannada: 'ಬಿದರಿ ಕಲೆ', transliteration: 'Bidri kale', english: 'Bidriware silver inlay handicraft' },
      { kannada: 'ಸುರಂಗ ಮಾರ್ಗ', transliteration: 'suranga maarga', english: 'underground tunnel / karez' },
    ],
    keyPhrase: {
      kannada: 'ಬೀದರ್ ಕೋಟೆಯ ಸುರಂಗ ಜಲಮಾರ್ಗಗಳು ಪ್ರಾಚೀನ ಇಂಜಿನಿಯರಿಂಗ್ ಅದ್ಭುತ.',
      transliteration: 'Bidar koteya suranga jalamaargagalu praacheena engineering adbhuta.',
      english: 'The subterranean aqueducts of Bidar Fort are an ancient engineering marvel.',
      context: 'Historical engineering appreciation',
    },
  },
];
