import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

// ─── Mapping "Nom court de la formation" (nouveau format PS) → code BDD ────────
// Le nouveau fichier Parcoursup utilise la colonne "Nom court de la formation"
// ex: "BUT-TC", "BUT-Informatique", "BUT-GB-SAB"
// On extrait le code BDD en supprimant le préfixe "BUT-" et le suffixe "-App"
// puis on applique les correspondances manuelles pour les cas ambigus.

const NOM_COURT_TO_BDD_CODE = {
  // Informatique / Numérique
  'Informatique': 'INFO',
  'MMI': 'MMI',
  'RT': 'RT',
  'SD': 'SD',
  // Génie
  'GEII': 'GEII',
  'GMP': 'GMP',
  'GIM': 'GIM',
  'GC-CD': 'GCCD',
  'GCGP': 'GCGP',
  'GB-SAB': 'GB',
  'GB-BMB': 'GB',
  'GB-SEE': 'GB',
  'GB-Opt.Agr': 'GB',
  'BD-DN': 'GB',
  'SGM': 'SGM',
  'MP': 'MP',
  'Chimie': 'Chimie',
  'HSE': 'HSE',
  'MTEE': 'MT2E',
  'PEC': 'PEC',
  // Tertiaire
  'GEA': 'GEA',
  'TC': 'TC',
  'GACO': 'GACO',
  'CJ': 'CJ',
  'CS-Opt.ASSC': 'CS',
  'CS-Opt.AS': 'CS',
  'CS-Opt.ES': 'CS',
  'CS-VTD': 'CS',
  'CGE3S': 'CS',
  'IC-Opt.CO': 'Info-Com',
  'IC-Opt.MLP': 'Info-Com',
  'IC-Opt.INO': 'Info-Com',
  'IC-Opt.JOUR': 'Info-Com',
  'IC-PUB': 'Info-Com',
  'MLT': 'MLT',
  'QLIO': 'QLIO',
};

/**
 * Extrait le code BDD depuis le "Nom court de la formation" du nouveau format PS.
 * Ex: "BUT-TC-App" → "TC" → "TC"
 *     "BUT-GB-SAB" → "GB-SAB" → "GB"
 *     "BUT-Informatique" → "Informatique" → "INFO"
 */
function getButCodeFromNomCourt(nomCourt) {
  if (!nomCourt) return null;
  // Supprimer préfixe "BUT-"
  let key = String(nomCourt).replace(/^BUT-/i, '');
  // Supprimer suffixe "-App" (apprentissage)
  key = key.replace(/-App$/i, '');
  // Chercher correspondance directe
  if (NOM_COURT_TO_BDD_CODE[key]) return NOM_COURT_TO_BDD_CODE[key];
  // Retourner la clé brute si pas de mapping (formations nouvelles)
  return key;
}

// ─── Mapping nom normalisé Parcoursup → nom normalisé BDD ────────────────────
// Le nouveau format utilise "Nom de l'établissement" avec format :
// "IUT Lyon1 Site de Bourg-en-Bresse (01)"
// "IUT de l'Aisne - Site de Soissons-Cuffies (02)"
// On peut aussi utiliser "Identifiant de l'établissement" (code UAI) pour les matching.

const PS_TO_BDD_IUT_OVERRIDE = {
  'iut lyon1': 'iut lyon 1',
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
  'iut de toulouse': 'iut toulouse',
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
  // Nouvelles entrées pour le nouveau format (avec département entre parenthèses)
  'iut clermont auvergne': 'iut clermont ferrand',
  'i u t clermont auvergne': 'iut clermont ferrand',
  'iut nice cote d azur': 'iut nice',
  'i u t nice cote d azur': 'iut nice',
  'iut reims chalons charleville': 'iut reims',
  'iut reims chalons charleville site de charleville': 'iut reims',
  'iut paris rives de seine': 'iut paris rives de seine',
  'iut de paris': 'iut paris rives de seine',
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function norm(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['']/g, '\'')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalise un nom d'IUT en supprimant:
 * - les infos de site/antenne/campus
 * - le numéro de département entre parenthèses (nouveau format: "IUT Lyon1 Site de Bourg-en-Bresse (01)")
 * - les références université
 */
function normIUT(s) {
  if (!s) return '';
  let n = norm(s);
  // Supprimer le numéro de département entre parenthèses en fin de chaîne ex: "(01)"
  n = n.replace(/\s*\(\d{2,3}\)\s*$/, '').trim();
  // Normaliser les abréviations IUT
  n = n.replace(/i\.?u\.?t\.?\s*/g, 'iut ').replace(/\s+/g, ' ').trim();
  // Supprimer les séparateurs de site/antenne
  for (const sep of [' - site', ' site de ', ' site d ', ' antenne de ', ' pole de ', ' pole d ', ' campus ']) {
    const idx = n.indexOf(sep);
    if (idx > 0) n = n.slice(0, idx).trim();
  }
  // Supprimer les tirets isolés en fin de chaîne
  n = n.replace(/\s+-\s*$/, '').trim();
  // Supprimer les références à l'université
  n = n.replace(/\buniversite\b.*/, '').replace(/\buniv\b.*/, '').trim();
  // Ponctuation résiduelle
  n = n.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return n;
}

/**
 * Résout le nom normalisé BDD depuis un nom Parcoursup brut.
 */
function resolveBDDName(psRaw, bddNormSet) {
  const psNorm = normIUT(psRaw);

  // 1. Override explicite
  if (PS_TO_BDD_IUT_OVERRIDE[psNorm]) return PS_TO_BDD_IUT_OVERRIDE[psNorm];

  // 2. Correspondance directe
  if (bddNormSet.has(psNorm)) return psNorm;

  // 3. Correspondance partielle
  for (const bddN of bddNormSet) {
    if (psNorm.startsWith(bddN) || bddN.startsWith(psNorm)) return bddN;
  }

  // 4. Chevauchement suffisant (60% des mots communs, longueur > 3)
  const psWords = new Set(psNorm.split(' ').filter(w => w.length > 3));
  for (const bddN of bddNormSet) {
    const bddWords = bddN.split(' ').filter(w => w.length > 3);
    const common = bddWords.filter(w => psWords.has(w)).length;
    if (bddWords.length > 0 && common / bddWords.length >= 0.6) return bddN;
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
 * Détecte le format du fichier Parcoursup (nouveau ou ancien).
 * Nouveau : colonne "Nom court de la formation" + "Types de formation"
 * Ancien  : colonne "Filière de formation très agrégée" + "Filière de formation détaillée bis"
 */
function detectParcoursupFormat(rows) {
  if (!rows.length) return 'unknown';
  const cols = Object.keys(rows[0]);
  if (cols.includes('Nom court de la formation') && cols.includes('Types de formation')) return 'nouveau';
  if (cols.includes('Filière de formation très agrégée')) return 'ancien';
  return 'unknown';
}

/**
 * Parse le fichier Parcoursup (nouveau format: fr-esr-cartographie_formations_parcoursup.xlsx)
 * Retourne uniquement les lignes BUT avec les champs normalisés.
 */
function parseParcoursupNouveauFormat(rows) {
  return rows
    .filter(r => r['Types de formation'] && String(r['Types de formation']).includes('BUT'))
    .map(r => ({
      _format: 'nouveau',
      etablissement: r['Nom de l\'établissement'] || '',
      uai: r['Identifiant de l\'établissement'] || '',
      nomCourt: r['Nom court de la formation'] || '',
      nomLong: r['Nom long de la formation'] || '',
      region: r['Région'] || '',
      departement: r['Département'] || '',
      commune: r['Commune'] || '',
      session: r['Session'],
      lienFiche: r['Lien vers la fiche formation'] || '',
      codeInterne: r['Code interne Parcoursup de la formation'] || '',
      apprentissage: r['Formations en apprentissage'] === 'Oui' || String(r['Nom court de la formation']).endsWith('-App'),
    }));
}

/**
 * Parse le fichier Parcoursup (ancien format: Donnée_parcousup.xlsx)
 * Rétrocompatibilité.
 */
function parseParcoursupAncienFormat(rows) {
  return rows
    .filter(r => r['Filière de formation très agrégée'] === 'BUT')
    .map(r => ({
      _format: 'ancien',
      etablissement: r['Établissement'] || '',
      uai: r['Code UAI de l\'établissement'] || '',
      nomCourt: r['Filière de formation détaillée bis'] || '',
      nomLong: r['Filière de formation détaillée bis'] || '',
      region: r['Région de l\'établissement'] || '',
      departement: r['Code départemental de l\'établissement'] || '',
      commune: r['Commune de l\'établissement'] || '',
      session: r['Session'],
      lienFiche: r['Lien de la formation sur la plateforme Parcoursup'] || '',
      codeInterne: r['cod_aff_form'] || '',
      capacite: r['Capacité de l\'établissement par formation'],
      apprentissage: false,
    }));
}

/**
 * Parse le fichier Parcoursup (quel que soit le format).
 */
function parseParcoursupFile(wb) {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const format = detectParcoursupFormat(rows);

  if (format === 'nouveau') return { rows: parseParcoursupNouveauFormat(rows), format: 'nouveau' };
  if (format === 'ancien') return { rows: parseParcoursupAncienFormat(rows), format: 'ancien' };
  throw new Error('Format Parcoursup non reconnu. Colonnes attendues : « Nom court de la formation » (nouveau) ou « Filière de formation très agrégée » (ancien).');
}

/**
 * Parse l'onglet IUT de la BDD ExplorIUT.
 */
function parseDataFile(wb) {
  const iutSheet = wb.Sheets['IUT'];
  const butSheet = wb.Sheets['BUT'];
  if (!iutSheet || !butSheet) return null;

  const rows = XLSX.utils.sheet_to_json(iutSheet, { defval: null });
  let lastIUT = null, lastSite = null, lastRegion = null;

  const clean = rows.map((row) => {
    if (row['IUT']) lastIUT = row['IUT'];
    if (row['Site (lieux)']) lastSite = row['Site (lieux)'];
    if (row['Région']) lastRegion = row['Région'];
    return { ...row, 'IUT': lastIUT, 'Site (lieux)': lastSite, 'Région': lastRegion };
  }).filter(r => r['Diplôme']);

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

// ─── Logique de comparaison ───────────────────────────────────────────────────

function compare(dataFile, parcoursupData) {
  const { entries: bddEntries, bddNormSet } = dataFile;
  const { rows: parcoursupRows, format } = parcoursupData;

  // --- Étape 1 : Dédoublonner les lignes Parcoursup (par IUT résolu + code BUT) ---
  const psMap = new Map();
  const unknownIUTs = new Set();

  parcoursupRows.forEach((row) => {
    // Identifier le code BUT selon le format
    let code;
    if (format === 'nouveau') {
      code = getButCodeFromNomCourt(row.nomCourt);
    }
    else {
      // Ancien format: utiliser l'ancien mapping par préfixe
      code = getButCodeLegacy(row.nomCourt);
    }
    if (!code) return;

    const bddName = resolveBDDName(row.etablissement, bddNormSet);
    if (!bddName) {
      unknownIUTs.add(row.etablissement);
      return;
    }

    const key = `${bddName}|||${code}`;
    if (!psMap.has(key)) {
      psMap.set(key, {
        iutNormBDD: bddName,
        etablissement: row.etablissement,
        butCode: code,
        nomLong: row.nomLong,
        uai: row.uai,
        departement: row.departement,
        region: row.region,
        commune: row.commune,
        session: row.session,
        lienFiche: row.lienFiche,
        codeInterne: row.codeInterne,
        capacite: row.capacite,
        apprentissage: row.apprentissage,
      });
    }
  });

  // --- Étape 2 : Construire le set BDD ---
  const bddSet = new Set(bddEntries.map(e => `${e.iutNorm}|||${e.diplomeNorm}`));

  // --- Étape 3 : Ouvertures (dans PS, absents de BDD) ---
  const openedBUTs = [];
  const psFoundKeys = new Set();

  for (const [key, item] of psMap.entries()) {
    psFoundKeys.add(key);
    const bddKey = `${item.iutNormBDD}|||${norm(item.butCode)}`;
    if (!bddSet.has(bddKey)) {
      openedBUTs.push({ ...item, type: 'opened' });
    }
  }

  // --- Étape 4 : Fermetures (dans BDD, absents de PS) ---
  const closedBUTs = [];
  const bddChecked = new Map();

  bddEntries.forEach((e) => {
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

  const sessions = [...new Set(parcoursupRows.map(r => r.session))].filter(Boolean).sort();
  const latestSession = sessions[sessions.length - 1];

  return {
    openedBUTs,
    closedBUTs,
    unknownIUTs: [...unknownIUTs],
    latestSession,
    totalPS: psMap.size,
    totalBDD: bddEntries.length,
    format,
  };
}

// Rétrocompatibilité : ancien mapping par préfixe de texte
const BUT_CODE_TO_PS_PREFIXES_LEGACY = {
  'MMI': ['metiers du multimedia et de l\'internet', 'metiers du multimédia et de l\'internet'],
  'Chimie': ['chimie'],
  'GB': ['genie biologique', 'genie biologique parcours'],
  'GCGP': ['genie chimique genie des procedes', 'genie chimique - genie des procedes'],
  'GCCD': ['genie civil', 'genie civil - construction durable'],
  'GEII': ['genie electrique et informatique industrielle'],
  'MP': ['mesures physiques'],
  'SGM': ['science et genie des materiaux'],
  'GIM': ['genie industriel et maintenance'],
  'GMP': ['genie mecanique et productique'],
  'QLIO': ['qualite, logistique industrielle et organisation', 'qualite logistique industrielle et organisation'],
  'PEC': ['packaging, emballage et conditionnement', 'packaging emballage et conditionnement'],
  'MLT': ['management de la logistique et des transports'],
  'MT2E': ['metiers de la transition et de l\'efficacite energetiques', 'metiers de la transition et de l efficacite energetiques'],
  'HSE': ['hygiene securite environnement', 'hygiene, securite, environnement'],
  'INFO': ['informatique'],
  'SD': ['science des donnees'],
  'RT': ['reseaux et telecommunications'],
  'CJ': ['carrieres juridiques'],
  'CS': ['carrieres sociales'],
  'GACO': ['gestion administrative et commerciale des organisations'],
  'TC': ['techniques de commercialisation'],
  'Info-Com': ['information communication', 'information-communication'],
  'GEA': ['gestion des entreprises et des administrations'],
};

function getButCodeLegacy(specialtyName) {
  const n = norm(specialtyName);
  for (const [code, prefixes] of Object.entries(BUT_CODE_TO_PS_PREFIXES_LEGACY)) {
    for (const prefix of prefixes) {
      if (n === prefix || n.startsWith(prefix)) return code;
    }
  }
  return null;
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function Badge({ children, color }) {
  const colors = {
    green: 'border-green-700 bg-green-100 text-green-900',
    red: 'border-red-700 bg-red-100 text-red-900',
    orange: 'border-orange-600 bg-orange-100 text-orange-900',
    blue: 'border-blue-600 bg-blue-100 text-blue-900',
    gray: 'border-stone-400 bg-stone-100 text-stone-600',
  };
  return (
    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border-2 uppercase tracking-wide font-mono ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
}

function ButCard({ item }) {
  const psUrl = item.lienFiche || (item.codeInterne
    ? `https://dossierappel.parcoursup.fr/Candidats/public/fiches/afficherFicheFormation?g_ta_cod=${item.codeInterne}&typeBac=0&originePc=0`
    : null);

  return (
    <div className="mb-2 pl-3 border-stone-800 border-2 rounded py-2 pr-3 bg-white">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        {item.type === 'opened'
          ? <Badge color="green">Ouverture</Badge>
          : <Badge color="red">Fermeture</Badge>}
        {item.apprentissage && <Badge color="blue">Apprentissage</Badge>}
        <span className="font-mono text-blue-900 font-bold text-sm">
          [
          {item.butCode}
          ]
        </span>
        <span className="font-semibold text-sm">{item.etablissement || item.iutNorm}</span>
        {item.site && (
          <span className="text-stone-500 text-sm">
            (
            {item.site}
            )
          </span>
        )}
        {item.commune && item.commune !== item.etablissement && (
          <span className="text-stone-400 text-xs">
            —
            {item.commune}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-500">
        {item.region && <span>{item.region}</span>}
        {item.departement && (
          <span className="ml-2">
            Dépt :
            {item.departement}
          </span>
        )}
        {item.uai && (
          <span className="ml-2 font-mono">
            UAI :
            {item.uai}
          </span>
        )}
        {item.capacite != null && (
          <span className="ml-2">
            ·
            {item.capacite}
            {' '}
            places
          </span>
        )}
        {item.session && (
          <span className="ml-2">
            · Session
            {item.session}
          </span>
        )}
      </p>
      {item.nomLong && item.nomLong !== item.butCode && (
        <p className="text-xs text-stone-400 mt-0.5 italic">{item.nomLong}</p>
      )}
      {psUrl && (
        <a
          href={psUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-700 hover:underline text-xs mt-1 inline-block"
        >
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
  const [parcoursupData, setParcoursupData] = useState(null);
  const [dataFilename, setDataFilename] = useState('');
  const [parcoursupFilename, setParcoursupFilename] = useState('');
  const [detectedFormat, setDetectedFormat] = useState(null);
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
    }
    catch (err) {
      setError(`Fichier BDD : ${err.message}`);
    }
  }, []);

  const handleParcoursupFile = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null); setResults(null);
    try {
      const wb = await loadXlsx(file);
      const parsed = parseParcoursupFile(wb);
      if (!parsed.rows.length) throw new Error('Aucune ligne BUT trouvée.');
      setParcoursupData(parsed);
      setDetectedFormat(parsed.format);
      setParcoursupFilename(file.name);
    }
    catch (err) {
      setError(`Fichier Parcoursup : ${err.message}`);
    }
  }, []);

  function handleCompare(evt) {
    evt.preventDefault();
    if (!dataFile || !parcoursupData || loading) return;
    setLoading(true); setError(null);
    setTimeout(() => {
      try {
        setResults(compare(dataFile, parcoursupData));
      }
      catch (err) {
        setError(`Erreur lors de la comparaison : ${err.message}`);
      }
      finally {
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
        Compatible avec le nouveau format
        {' '}
        <span className="font-mono text-xs">fr-esr-cartographie_formations_parcoursup</span>
        {' '}
        et l'ancien format statistiques.
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
                ✓
                {' '}
                {dataFilename}
                <span className="font-normal text-stone-500 ml-2">
                  (
                  {dataFile?.entries.length}
                  {' '}
                  entrées)
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
                ✓
                {' '}
                {parcoursupFilename}
                <span className="font-normal text-stone-500 ml-2">
                  (
                  {parcoursupData?.rows.length}
                  {' '}
                  lignes BUT)
                </span>
                {detectedFormat && (
                  <span className={`ml-2 text-xs font-mono px-1 rounded ${detectedFormat === 'nouveau' ? 'bg-blue-200 text-blue-800' : 'bg-yellow-200 text-yellow-800'}`}>
                    format
                    {' '}
                    {detectedFormat}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Lancement */}
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium mb-1">3. Lancer la comparaison</p>
              <button
                type="submit"
                disabled={!dataFile || !parcoursupData || loading}
                className="rounded border-2 border-blue-900 px-3 py-1 text-sm hover:bg-blue-50 transition-colors disabled:border-stone-300 disabled:text-stone-400"
              >
                {loading ? 'Analyse en cours…' : 'Comparer les fichiers'}
              </button>
            </div>

            {results && (
              <div className={`mt-2 pl-2 rounded border-4 font-bold text-sm py-1 ${totalChanges === 0
                ? 'border-green-700 bg-green-100'
                : 'border-blue-700 bg-blue-100'
                }`}
              >
                {totalChanges === 0
                  ? '✅ Base de données à jour'
                  : `${totalChanges} modification${totalChanges > 1 ? 's' : ''} détectée${totalChanges > 1 ? 's' : ''}`}
                {results.latestSession && (
                  <span className="font-normal ml-1 text-stone-600">
                    (session
                    {results.latestSession}
                    )
                  </span>
                )}
                <div className="font-normal text-xs text-stone-500 mt-0.5">
                  {results.totalPS}
                  {' '}
                  formations Parcoursup ·
                  {results.totalBDD}
                  {' '}
                  entrées BDD
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 pl-2 rounded border-red-700 border-4 bg-red-100 font-bold text-sm py-1">
          ⚠️
          {' '}
          {error}
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
                ⚠️
                {' '}
                {results.unknownIUTs.length}
                {' '}
                établissement(s) Parcoursup non identifiés dans la BDD
                <span className="text-xs font-normal">{showUnknown ? '▲ masquer' : '▼ voir'}</span>
              </button>
              {showUnknown && (
                <ul className="mt-2 text-xs text-orange-700 list-disc list-inside space-y-0.5">
                  {results.unknownIUTs.sort().map((u, i) => <li key={i}>{u}</li>)}
                </ul>
              )}
              <p className="text-xs text-orange-600 mt-2">
                Ces établissements n'ont pas pu être associés à un IUT de la base. Leurs formations n'ont pas été analysées.
                Vous pouvez compléter le dictionnaire
                {' '}
                <code>PS_TO_BDD_IUT_OVERRIDE</code>
                {' '}
                dans le code source.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
