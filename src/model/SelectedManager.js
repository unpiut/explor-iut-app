import { makeAutoObservable } from 'mobx';
import XLSX from 'xlsx';
import { dateToLocalDateTimeString } from '../services/timeService';
import localStorageMgr from '../services/LocalStorageManager';

const BUT_STORAGE_KEY = 'listeBut';
const IUT_STORAGE_KEY = 'listeIut';
const ALREADY_VISIT_STORAGE_KEY = 'hasAlreadyVisit';

class SelectedManager {
  _butSelectionnes;

  _iutSelectionnes;

  _iutSelectionnesId;
  // On enregistre les id à la place car lors de la comparaison, on compare l'iut et son wrapper

  _ready;

  _initializationResolver;

  _dateEnvoi;

  _alreadySend;

  _firstVisitMap;

  constructor() {
    makeAutoObservable(this);
    this._butSelectionnes = new Set();
    this._iutSelectionnes = new Set();
    this._iutSelectionnesId = new Set();
    this._dateEnvoi = null;
    this._firstVisitMap = true;
    this._alreadySend = false;
    this._ready = new Promise((resolve) => {
      this._initializationResolver = resolve;
    });
    this._loadAlreadyVisit();
  }

  initFromStorage(buts, iuts) {
    const storedButIds = localStorageMgr.getItem(BUT_STORAGE_KEY);
    if (storedButIds) {
      const idButSet = new Set(storedButIds);
      this._butSelectionnes.clear();
      buts.filter((b) => idButSet.has(b.id))
        .forEach((b) => this._butSelectionnes.add(b));
      const storedIutIds = JSON.parse(localStorageMgr.getItem(IUT_STORAGE_KEY));
      if (storedIutIds) {
        const idIutSet = new Set(storedIutIds);
        this._butSelectionnes.clear();
        iuts.filter((b) => idIutSet.has(b.id))
          .forEach((b) => {
            this._iutSelectionnes.add(b);
            this._iutSelectionnesId.add(b.id);
          });
      }
    }
    this._initializationResolver();
  }

  get butSelectionnes() {
    return this._butSelectionnes;
  }

  set butSelectionnes(butSelectionnes) {
    this._butSelectionnes = butSelectionnes;
  }

  get butSelectionnesId() {
    const tabBut = Array.from(this._butSelectionnes);
    tabBut.map((b) => b.id);
    return tabBut;
  }

  get butSelectionnesTab() {
    return Array.from(this._butSelectionnes);
  }

  get nbButSelectionnes() {
    return this._butSelectionnes.size;
  }

  get iutSelectionnes() {
    return this._iutSelectionnes;
  }

  set iutSelectionnes(iutSelectionnes) {
    this._iutSelectionnes = iutSelectionnes;
  }

  get iutSelectionnesTab() {
    return Array.from(this._iutSelectionnes);
  }

  get iutSelectionnesId() {
    return this._iutSelectionnesId;
  }

  set iutSelectionnesId(iutSelectionnesId) {
    this._iutSelectionnesId = iutSelectionnesId;
  }

  get iutSelectionnesIdTab() {
    return Array.from(this._iutSelectionnesId);
  }

  get nbIutSelectionnesId() {
    return this._iutSelectionnesId.size;
  }

  get dateEnvoi() {
    return this._dateEnvoi;
  }

  set dateEnvoi(dateEnvoi) {
    this._dateEnvoi = dateEnvoi;
  }

  get ready() {
    return this._ready;
  }

  set ready(ready) {
    this._ready = ready;
  }

  get firstVisitMap() {
    return this._firstVisitMap;
  }

  set firstVisitMap(newVisit) {
    this._firstVisitMap = newVisit;
    if (!newVisit) {
      this._saveAlreadyVisit();
    }
  }

  switchButSelectionnes(but) {
    this._alreadySend = false;
    if (this._butSelectionnes.has(but)) {
      this._butSelectionnes.delete(but);
    } else if (this._butSelectionnes.size < 3) {
      this._butSelectionnes.add(but);
    }
  }

  switchIutSelectionnes(iut) {
    this._alreadySend = false;
    if (this._iutSelectionnesId.has(iut.idIut)) {
      this._iutSelectionnes.delete(iut);
      this._iutSelectionnesId.delete(iut.idIut);
    } else {
      this._iutSelectionnes.add(iut);
      this._iutSelectionnesId.add(iut.idIut);
    }
  }

  switchIutSelectionnesIdByBut() {
    const oldIutRecherches = this._iutSelectionnes;
    this._iutSelectionnes.clear();
    this._iutSelectionnesId.clear();
    this._butSelectionnes.forEach((but) => {
      oldIutRecherches.forEach((i) => {
        if (i.departements.find((d) => d.codesButDispenses[0] === but.code)) {
          this._iutSelectionnes.add(i);
          this._iutSelectionnesId.add(i.idIut);
        }
      });
    });
  }

  async miseAJour() {
    this.iutSelectionnes.forEach(async (i) => {
      await i.getInfo();
    });
  }

  async telecharger(typefile) {
    const now = dateToLocalDateTimeString(Date.now());
    const tab = this.iutSelectionnesTab
      .flatMap((iut) => iut.departements.map((dep) => [iut, dep]))
      .filter(([, d]) => this.butSelectionnesTab.some((b) => b.code === d.butDispenses[0].codeBut))
      .map(([iut, dep]) => ({
        'Filière métiers': this.butSelectionnesTab.find((b) => b.code === dep.butDispenses[0].codeBut).prettyPrintFiliere,
        IUT: iut.nom,
        Site: iut.site,
        'Nom de la formation': this.butSelectionnesTab.find((b) => b.code === dep.butDispenses[0].codeBut).nom,
        Courriel: iut.mel,
        Téléphone: iut.tel,
        "Date de l'extraction": now,
        Suivi: '',
      }));
    const worksheet = XLSX.utils.json_to_sheet(tab);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Récapitulatif');
    XLSX.writeFile(workbook, `Récapitulatif-IUT-alternance.${typefile}`, { bookType: typefile, compression: true });
  }

  // Hot fix since initFromStorage has been disabled
  async _loadAlreadyVisit() {
    const hasAlreadyVisit = await localStorageMgr.getItem(ALREADY_VISIT_STORAGE_KEY);
    if (hasAlreadyVisit) {
      this._firstVisitMap = false;
    } else {
      this._firstVisitMap = true;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async _saveAlreadyVisit() {
    return localStorageMgr.setItem(ALREADY_VISIT_STORAGE_KEY, true);
  }
}

export default SelectedManager;
