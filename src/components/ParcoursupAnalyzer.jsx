import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

// ─── Mapping BUT code → nom(s) Parcoursup ────────────────────────────────────
// Clés = code court BDD, valeurs = préfixes/noms exacts tels qu'ils apparaissent
// dans la colonne "Filière de formation détaillée bis" de Parcoursup.
const BUT_CODE_TO_PS_PREFIXES = {
  MMI: ["metiers du multimedia et de l'internet", "metiers du multimédia et de l'internet"],
  Chimie: ['chimie'],
  GB: ['genie biologique', 'genie biologique parcours'],
  GCGP: ['genie chimique genie des procedes', 'genie chimique - genie des procedes'],
  GCCD: ['genie civil', 'genie civil - construction durable'],
  GEII: ['genie electrique et informatique industrielle'],
  MP: ['mesures physiques'],
  SGM: ['science et genie des materiaux'],
  GIM: ['genie industriel et maintenance'],
  GMP: ['genie mecanique et productique'],
  QLIO: ['qualite, logistique industrielle et organisation', 'qualite logistique industrielle et organisation'],
  PEC: ['packaging, emballage et conditionnement', 'packaging emballage et conditionnement'],
  MLT: ['management de la logistique et des transports'],
  MT2E: ["metiers de la transition et de l'efficacite energetiques", "metiers de la transition et de l efficacite energetiques"],
  HSE: ['hygiene securite environnement', 'hygiene, securite, environnement'],
  INFO: ['informatique'],
  SD: ['science des donnees'],
  RT: ['reseaux et telecommunications'],
  CJ: ['carrieres juridiques'],
  CS: ['carrieres sociales'],
  GACO: ['gestion administrative et commerciale des organisations'],
  TC: ['techniques de commercialisation'],
  'Info-Com': ['information communication', 'information-communication'],
  GEA: ['gestion des entreprises et des administrations'],
};

// ─── Mapping nom normalisé Parcoursup → nom normalisé BDD ────────────────────
// Utilisé quand la normalisation automatique ne suffit pas.
const PS_TO_BDD_IUT_OVERRIDE = {
  'iut aix marseille': 'iut aix marseille',
  'iut d aix marseille': 'iut aix marseille',
  'iut d amiens': 'iut amiens',
  'iut d avignon': 'iut avignon',
  'iut d evreux': 'iut evreux',
  'iut d evry val d essonne': 'iut evry',
  'iut d illkirch': 'iut strasbourg',
  'iut d orleans': 'iut orleans',
  'iut d orsay': 'iut orsay',
  'iut de bayonne': 'iut bayonne',
  'iut de besancon': 'iut besancon vesoul',
  'iut de besancon antenne de vesoul': 'iut besancon vesoul',
  'iut de besancon antenne de dole': 'iut besancon vesoul',
  'iut de bethune': 'iut bethune',
  'iut de beziers': 'iut beziers',
  'iut de blagnac': 'iut toulouse ii blagnac',
  'iut de blois': 'iut blois',
  'iut de bobigny': 'iut bobigny',
  'iut de bordeaux': 'iut bordeaux',
  'iut de bourges': 'iut bourges',
  'iut de brest': 'iut brest',
  'iut de cachan': 'iut cachan',
  'iut de cergy pontoise': 'iut cergy pontoise',
  'iut de chalon sur saone': 'iut chalon sur saone',
  'iut de chambery': 'iut chambery',
  'iut de chartres': 'iut chartres',
  'iut de colmar': 'iut colmar',
  'iut de corte': 'iut corse',
  'iut de creteil vitry': 'iut creteil vitry',
  'iut de dijon': 'iut dijon auxerre',
  'iut de dijon antenne d auxerre': 'iut dijon auxerre',
  'iut de dijon antenne de nevers': 'iut dijon auxerre',
  'iut de figeac': 'iut figeac',
  'iut de haguenau': 'iut haguenau',
  'iut de kourou': 'iut kourou',
  'iut de kourou campus de troubiran a cayenne': 'iut kourou',
  'iut de l aisne': 'iut saint quentin',
  'iut de l indre': 'iut indre',
  'iut de l oise': 'iut beauvais oise',
  'iut de la guadeloupe campus de st claude': 'iut guadeloupe',
  'iut de la martinique': 'iut martinique',
  'iut de la reunion': 'iut la reunion',
  'iut de lannion': 'iut lannion',
  'iut de lens': 'iut lens',
  'iut de lorient': 'iut lorient',
  'iut de lorient antenne de pontivy': 'iut lorient',
  'iut de mantes en yvelines': 'iut mantes en yvelines',
  'iut de marne la vallee': 'iut marne la vallee',
  'iut de marne la vallee antenne de meaux': 'iut marne la vallee',
  'iut de metz': 'iut metz',
  'iut de montpellier sete': 'iut montpellier',
  'iut de montreuil': 'iut montreuil',
  'iut de moselle est': 'iut sarreguemines',
  'iut de nancy brabois': 'iut nancy brabois',
  'iut de nantes antenne de chateaubriant': 'iut nantes',
  'iut de nice antenne de cannes': 'iut nice',
  'iut de nice antenne de menton': 'iut nice',
  'iut de nice antenne de valbonne': 'iut nice',
  'iut de nimes': 'iut nimes',
  'iut de paris rives de seine': 'iut paris rives de seine',
  'iut de perpignan': 'iut perpignan',
  'iut de quimper': 'iut quimper',
  'iut de rennes': 'iut rennes',
  'iut de roanne': 'iut roanne',
  'iut de rodez': 'iut rodez',
  'iut de rouen': 'iut rouen',
  'iut de saint brieuc': 'iut saint brieuc',
  'iut de saint denis': 'iut saint denis',
  'iut de saint denis antenne de la plaine': 'iut saint denis',
  'iut de saint die': 'iut saint die des vosges',
  'iut de saint etienne': 'iut saint etienne',
  'iut de saint malo': 'iut saint malo',
  'iut de sceaux ecole universitaire de premier cycle': 'iut sceaux',
  'iut de schiltigheim': 'iut strasbourg',
  'iut de senart fontainebleau': 'iut senart fontainebleau',
  'iut de tarbes': 'iut tarbes',
  'iut de toulon': 'iut toulon',
  'iut de toulon antenne de draguignan': 'iut toulon',
  'iut de toulon antenne de toulon porte d italie': 'iut toulon',
  'iut de toulouse': 'iut toulouse',
  'iut de toulouse antenne d auch': 'iut toulouse',
  'iut de toulouse antenne de castres': 'iut toulouse',
  'iut de tours': 'iut tours',
  'iut de tremblay en france paris 8': 'iut tremblay en france',
  'iut de troyes': 'iut troyes',
  'iut de valence': 'iut valence',
  'iut de valenciennes': 'iut valenciennes',
  'iut de vannes': 'iut vannes',
  'iut de velizy': 'iut velizy',
  'iut de velizy antenne de rambouillet': 'iut velizy',
  'iut de ville d avray': 'iut paris nanterre',
  'iut de ville d avray antenne de nanterre': 'iut paris nanterre',
  'iut de ville d avray antenne de saint cloud': 'iut paris nanterre',
  'iut de villetaneuse': 'iut villetaneuse',
  'iut des pays de l adour': 'iut pays de l adour',
  'iut des pays de l adour antenne de mont de marsan': 'iut pays de l adour',
  'iut du creusot': 'iut le creusot',
  'iut du havre': 'iut havre',
  'iut du limousin': 'iut limoges',
  'iut du limousin site de limoges': 'iut limoges',
  'iut grand ouest normandie': 'iut caen',
  'iut h poincare de longwy': 'iut longwy',
  'iut jean moulin de l': 'iut lyon 3',
  'iut littoral boulogne mer': 'iut littoral cote d opale',
  'iut littoral calais': 'iut littoral cote d opale',
  'iut littoral dunkerque': 'iut littoral cote d opale',
  'iut littoral saint omer': 'iut littoral cote d opale',
  'iut lumiere lyon 2': 'iut lyon 2',
  'iut lyon1': 'iut lyon 1',
  'iut 1 grenoble': 'iut grenoble 1',
  'iut 1 grenoble eneps': 'iut grenoble 1',
  'iut 2 de grenoble': 'iut grenoble 2',
  'iut nord franche comte': 'iut belfort',
  'iut nancy charlemagne': 'iut nancy charlemagne',
  'iut de nancy charlemagne': 'iut nancy charlemagne',
  'iut nancy brabois': 'iut nancy brabois',
  'iut de nancy brabois antenne de luneville': 'iut nancy brabois',
  'iut epinal hubert curien': 'iut epinal',
  'iut de l': 'iut lille',
  'iut de l universite de lille': 'iut lille',
  'institut universitaire de technologie de lille': 'iut lille',
  'institut universitaire de technologie de reims': 'iut reims',
  'institut universitaire de technologie de paris pajol': 'iut paris diderot',
  'iut de schiltigheim site de selestat': 'iut strasbourg',
  'iut de montpellier sete site de montpellier campus occitanie': 'iut montpellier',
  'la rochelle': 'la rochelle',
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function norm(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalise un nom d'IUT (côté Parcoursup ou BDD) en chaîne courte sans accents,
 * sans ponctuation, sans info de site/université.
 */
function normIUT(s) {
  if (!s) return '';
  let n = norm(s);
  n = n.replace(/i\.?u\.?t\.?\s*/g, 'iut ').replace(/\s+/g, ' ').trim();
  // Supprimer tout ce qui suit un séparateur de site
  for (const sep of [' - site', ' site de ', ' site d ', ' antenne de ', ' pole de ', ' pole d ', ' campus ']) {
    const idx = n.indexOf(sep);
    if (idx > 0) n = n.slice(0, idx).trim();
  }
  // Supprimer les références à l'université
  n = n.replace(/\buniversite\b.*/, '').replace(/\buniv\b.*/, '').trim();
  // Ponctuation résiduelle
  n = n.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return n;
}

/**
 * Résout le nom normalisé BDD depuis un nom Parcoursup brut.
 * Applique d'abord les overrides manuels, sinon tente une correspondance automatique.
 */
function resolveBDDName(psRaw, bddNormSet) {
  const psNorm = normIUT(psRaw);

  // 1. Override explicite
  if (PS_TO_BDD_IUT_OVERRIDE[psNorm]) return PS_TO_BDD_IUT_OVERRIDE[psNorm];

  // 2. Correspondance directe
  if (bddNormSet.has(psNorm)) return psNorm;

  // 3. Correspondance partielle : le nom BDD est contenu dans le nom PS, ou vice-versa
  for (const bddN of bddNormSet) {
    if (psNorm.startsWith(bddN) || bddN.startsWith(psNorm)) return bddN;
  }

  // 4. Chevauchement suffisant (60% des mots communs)
  const psWords = new Set(psNorm.split(' ').filter(w => w.length > 3));
  for (const bddN of bddNormSet) {
    const bddWords = bddN.split(' ').filter(w => w.length > 3);
    const common = bddWords.filter(w => psWords.has(w)).length;
    if (bddWords.length > 0 && common / bddWords.length >= 0.6) return bddN;
  }

  return null; // IUT inconnu
}

/**
 * Identifie le code BUT (clé BDD) depuis un nom de spécialité Parcoursup.
 */
function getButCode(specialtyName) {
  const n = norm(specialtyName);
  for (const [code, prefixes] of Object.entries(BUT_CODE_TO_PS_PREFIXES)) {
    for (const prefix of prefixes) {
      if (n === prefix || n.startsWith(prefix)) return code;
    }
  }
  return null;
}

// ─── Chargement des fichiers ──────────────────────────────────────────────────

function loadXlsx(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try { res(XLSX.read(e.target.result, { type: 'array' })); }
      catch (err) { rej(err); }
    };
    reader.onerror = () => rej(new Error('Lecture du fichier impossible'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Parse l'onglet IUT de la BDD ExplorIUT.
 * Retourne une liste de { iutNorm, diplome, site, region, departement }.
 */
function parseDataFile(wb) {
  const iutSheet = wb.Sheets['IUT'];
  const butSheet = wb.Sheets['BUT'];
  if (!iutSheet || !butSheet) return null;

  const rows = XLSX.utils.sheet_to_json(iutSheet, { defval: null });
  let lastIUT = null, lastSite = null, lastRegion = null;

  const clean = rows.map(row => {
    if (row['IUT']) lastIUT = row['IUT'];
    if (row['Site (lieux)']) lastSite = row['Site (lieux)'];
    if (row['Région']) lastRegion = row['Région'];
    return { ...row, IUT: lastIUT, 'Site (lieux)': lastSite, Région: lastRegion };
  }).filter(r => r['Diplôme']);

  // Construire le set des noms BDD normalisés (pour la résolution de correspondance)
  const bddNormSet = new Set(clean.map(r => normIUT(r.IUT)));

  const entries = clean.map(r => ({
    iutRaw: r.IUT,
    iutNorm: normIUT(r.IUT),
    diplome: String(r['Diplôme']).trim(),
    diplomeNorm: norm(String(r['Diplôme']).trim()),
    site: r['Site (lieux)'] || '',
    region: r['Région'] || '',
    departement: r['Departement'] || '',
  }));

  return { entries, bddNormSet };
}

/**
 * Parse le fichier Parcoursup et retourne uniquement les lignes BUT.
 */
function parseParcoursupFile(wb) {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return rows.filter(r => r['Filière de formation très agrégée'] === 'BUT');
}

// ─── Logique de comparaison ───────────────────────────────────────────────────

function compare(dataFile, parcoursupRows) {
  const { entries: bddEntries, bddNormSet } = dataFile;

  // --- Étape 1 : Dédoublonner les lignes Parcoursup (par IUT résolu + code BUT) ---
  const psMap = new Map(); // clé: "iutNormBDD|||butCode" → objet
  const unknownIUTs = new Set();

  parcoursupRows.forEach(row => {
    const spec = row['Filière de formation détaillée bis'] || '';
    const code = getButCode(spec);
    if (!code) return;

    const etabRaw = row['Établissement'] || '';
    const bddName = resolveBDDName(etabRaw, bddNormSet);

    if (!bddName) {
      unknownIUTs.add(etabRaw);
      return;
    }

    const key = `${bddName}|||${code}`;
    if (!psMap.has(key)) {
      psMap.set(key, {
        iutNormBDD: bddName,
        etablissement: etabRaw,
        butCode: code,
        uai: row["Code UAI de l'établissement"] || row['Code UAI de l\'établissement'] || '',
        departement: row['Code départemental de l\'établissement'] || row["Code départemental de l'établissement"] || '',
        region: row['Région de l\'établissement'] || row["Région de l'établissement"] || '',
        session: row['Session'],
        capacite: row['Capacité de l\'établissement par formation'] || row["Capacité de l'établissement par formation"],
        cod: row['cod_aff_form'],
        spec,
      });
    }
  });

  // --- Étape 2 : Construire les sets BDD ---
  // Set des combinaisons (iutNorm, diplomeNorm) présentes dans la BDD
  const bddSet = new Set(bddEntries.map(e => `${e.iutNorm}|||${e.diplomeNorm}`));

  // --- Étape 3 : Trouver les ouvertures (présents dans PS, absents de BDD) ---
  const openedBUTs = [];
  const psFoundKeys = new Set();

  for (const [key, item] of psMap.entries()) {
    psFoundKeys.add(key);
    const bddKey = `${item.iutNormBDD}|||${norm(item.butCode)}`;
    if (!bddSet.has(bddKey)) {
      openedBUTs.push({ ...item, type: 'opened' });
    }
  }

  // --- Étape 4 : Trouver les fermetures (présents dans BDD, absents de PS) ---
  const closedBUTs = [];
  // On groupe par (iutNorm, diplomeNorm) pour éviter les doublons liés aux sites multiples
  const bddChecked = new Map();

  bddEntries.forEach(e => {
    const key = `${e.iutNorm}|||${e.diplomeNorm}`;
    if (bddChecked.has(key)) return;
    bddChecked.set(key, e);

    const psKey = `${e.iutNorm}|||${e.diplome}`;
    if (!psFoundKeys.has(psKey)) {
      closedBUTs.push({
        type: 'closed',
        iutNorm: e.iutNorm,
        etablissement: e.iutRaw,
        site: e.site,
        butCode: e.diplome,
        region: e.region,
        departement: e.departement,
      });
    }
  });

  // --- Métadonnées ---
  const sessions = [...new Set(parcoursupRows.map(r => r['Session']))].filter(Boolean).sort();
  const latestSession = sessions[sessions.length - 1];

  return {
    openedBUTs,
    closedBUTs,
    unknownIUTs: [...unknownIUTs],
    latestSession,
    totalPS: psMap.size,
    totalBDD: bddEntries.length,
  };
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function Badge({ children, color }) {
  const colors = {
    green: 'border-green-700 bg-green-100 text-green-900',
    red: 'border-red-700 bg-red-100 text-red-900',
    orange: 'border-orange-600 bg-orange-100 text-orange-900',
    gray: 'border-stone-400 bg-stone-100 text-stone-600',
  };
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border-2 uppercase tracking-wide font-mono ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function ButCard({ item }) {
  const psUrl = item.cod
    ? `https://dossierappel.parcoursup.fr/Candidats/public/fiches/afficherFicheFormation?g_ta_cod=${item.cod}&typeBac=0&originePc=0`
    : null;

  return (
    <div className="mb-2 pl-3 border-stone-800 border-2 rounded py-2 pr-3 bg-white">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        {item.type === 'opened'
          ? <Badge color="green">Ouverture</Badge>
          : <Badge color="red">Fermeture</Badge>
        }
        <span className="font-mono text-blue-900 font-bold text-sm">[{item.butCode}]</span>
        <span className="font-semibold text-sm">{item.etablissement || item.iutNorm}</span>
        {item.site && <span className="text-stone-500 text-sm">({item.site})</span>}
      </div>
      <p className="text-xs text-stone-500">
        {item.region && <span>{item.region}</span>}
        {item.departement && <span className="ml-2">Dépt : {item.departement}</span>}
        {item.uai && <span className="ml-2 font-mono">UAI : {item.uai}</span>}
        {item.capacite != null && <span className="ml-2">· {item.capacite} places</span>}
        {item.session && <span className="ml-2">· Session {item.session}</span>}
      </p>
      {item.spec && (
        <p className="text-xs text-stone-400 mt-0.5 italic">{item.spec}</p>
      )}
      {psUrl && (
        <a href={psUrl} target="_blank" rel="noopener noreferrer"
          className="text-sky-700 hover:underline text-xs mt-1 inline-block">
          Voir sur Parcoursup ↗
        </a>
      )}
    </div>
  );
}

function Section({ title, items, emptyMsg, renderItem }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 w-full text-left mb-2"
      >
        <h2 className="text-base font-semibold flex-1">{title}</h2>
        <span className="rounded border-2 border-blue-900 px-2 text-sm font-bold">{items.length}</span>
        <span className="text-stone-400 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        items.length === 0
          ? <p className="text-sm text-stone-400 italic pl-2">{emptyMsg}</p>
          : items.map((item, i) => renderItem(item, i))
      )}
    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────

export default function ParcoursupAnalyzer() {
  const [dataFile, setDataFile] = useState(null);
  const [parcoursupRows, setParcoursupRows] = useState(null);
  const [dataFilename, setDataFilename] = useState('');
  const [parcoursupFilename, setParcoursupFilename] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUnknown, setShowUnknown] = useState(false);

  const handleDataFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null); setResults(null);
    try {
      const wb = await loadXlsx(file);
      const parsed = parseDataFile(wb);
      if (!parsed) throw new Error('Onglets "IUT" et "BUT" introuvables dans ce fichier.');
      setDataFile(parsed);
      setDataFilename(file.name);
    } catch (err) {
      setError(`Fichier BDD : ${err.message}`);
    }
  }, []);

  const handleParcoursupFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null); setResults(null);
    try {
      const wb = await loadXlsx(file);
      const rows = parseParcoursupFile(wb);
      if (!rows.length) throw new Error('Aucune ligne BUT trouvée.');
      setParcoursupRows(rows);
      setParcoursupFilename(file.name);
    } catch (err) {
      setError(`Fichier Parcoursup : ${err.message}`);
    }
  }, []);

  function handleCompare(evt) {
    evt.preventDefault();
    if (!dataFile || !parcoursupRows || loading) return;
    setLoading(true); setError(null);
    setTimeout(() => {
      try {
        setResults(compare(dataFile, parcoursupRows));
      } catch (err) {
        setError(`Erreur lors de la comparaison : ${err.message}`);
      } finally {
        setLoading(false);
      }
    }, 50);
  }

  const totalChanges = results ? results.openedBUTs.length + results.closedBUTs.length : null;

  return (
    <div className="col-span-3 border-t-2 border-stone-300 pt-6 mt-4">
      <h1 className="text-xl font-semibold mb-1">Analyse Parcoursup ↔ ExplorIUT</h1>
      <p className="text-sm text-stone-500 mb-4">
        Compare un export Parcoursup avec la base de données ExplorIUT pour détecter les ouvertures et fermetures de BUT.
      </p>

      <form onSubmit={handleCompare}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Fichier BDD */}
          <div>
            <p className="text-sm font-medium mb-1">
              1. Base de données ExplorIUT
              <span className="text-stone-400 font-normal"> (data_XXXX.xlsx)</span>
            </p>
            <input type="file" accept=".xlsx" onChange={handleDataFile} className="block text-sm mb-2" />
            {dataFilename && (
              <div className="pl-2 rounded border-green-700 border-2 bg-green-100 font-bold text-sm py-0.5">
                ✓ {dataFilename}
                <span className="font-normal text-stone-500 ml-2">
                  ({dataFile?.entries.length} entrées)
                </span>
              </div>
            )}
          </div>

          {/* Fichier Parcoursup */}
          <div>
            <p className="text-sm font-medium mb-1">
              2. Export Parcoursup
              <span className="text-stone-400 font-normal"> (.xlsx)</span>
            </p>
            <input type="file" accept=".xlsx" onChange={handleParcoursupFile} className="block text-sm mb-2" />
            {parcoursupFilename && (
              <div className="pl-2 rounded border-green-700 border-2 bg-green-100 font-bold text-sm py-0.5">
                ✓ {parcoursupFilename}
                <span className="font-normal text-stone-500 ml-2">
                  ({parcoursupRows?.length} lignes BUT)
                </span>
              </div>
            )}
          </div>

          {/* Lancement */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium mb-1">3. Lancer la comparaison</p>
              <button
                type="submit"
                disabled={!dataFile || !parcoursupRows || loading}
                className="rounded border-2 border-blue-900 px-3 py-1 text-sm hover:bg-blue-50 transition-colors disabled:border-stone-300 disabled:text-stone-400"
              >
                {loading ? 'Analyse en cours…' : 'Comparer les fichiers'}
              </button>
            </div>

            {results && (
              <div className={`mt-2 pl-2 rounded border-4 font-bold text-sm py-1 ${totalChanges === 0
                ? 'border-green-700 bg-green-100'
                : 'border-blue-700 bg-blue-100'
                }`}>
                {totalChanges === 0
                  ? '✅ Base de données à jour'
                  : `${totalChanges} modification${totalChanges > 1 ? 's' : ''} détectée${totalChanges > 1 ? 's' : ''}`}
                {results.latestSession && (
                  <span className="font-normal ml-1 text-stone-600">(session {results.latestSession})</span>
                )}
                <div className="font-normal text-xs text-stone-500 mt-0.5">
                  {results.totalPS} formations Parcoursup · {results.totalBDD} entrées BDD
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 pl-2 rounded border-red-700 border-4 bg-red-100 font-bold text-sm py-1">
          ⚠️ {error}
        </div>
      )}

      {results && (
        <>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <Section
              title="BUT ouverts (dans Parcoursup, absents de la BDD)"
              items={results.openedBUTs}
              emptyMsg="Aucun nouveau BUT détecté."
              renderItem={(item, i) => <ButCard key={i} item={item} />}
            />
            <Section
              title="BUT fermés (dans la BDD, absents de Parcoursup)"
              items={results.closedBUTs}
              emptyMsg="Aucune fermeture détectée."
              renderItem={(item, i) => <ButCard key={i} item={item} />}
            />
          </div>

          {results.unknownIUTs.length > 0 && (
            <div className="mt-4 border-2 border-orange-400 rounded p-3 bg-orange-50">
              <button
                type="button"
                onClick={() => setShowUnknown(o => !o)}
                className="text-sm font-semibold text-orange-800 flex items-center gap-2"
              >
                ⚠️ {results.unknownIUTs.length} établissement(s) Parcoursup non identifiés dans la BDD
                <span className="text-xs font-normal">{showUnknown ? '▲ masquer' : '▼ voir'}</span>
              </button>
              {showUnknown && (
                <ul className="mt-2 text-xs text-orange-700 list-disc list-inside space-y-0.5">
                  {results.unknownIUTs.sort().map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              )}
              <p className="text-xs text-orange-600 mt-2">
                Ces établissements n'ont pas pu être associés à un IUT de la base. Leurs formations n'ont pas été analysées.
                Vous pouvez compléter le dictionnaire <code>PS_TO_BDD_IUT_OVERRIDE</code> dans le code source.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
