import { makeAutoObservable } from 'mobx';
import XLSX from 'xlsx';
import { dateToLocalDateTimeString } from '../services/timeService';

class SelectedManager {
  _butSelectionnes;

  _iutSelectionnes;

  _iutSelectionnesId;
  // On enregistre les id à la place car lors de la comparaison, on compare l'iut et son wrapper

  constructor() {
    makeAutoObservable(this);
    this._butSelectionnes = new Set();
    this._iutSelectionnes = new Set();
    this._iutSelectionnesId = new Set();
  }

  get butSelectionnes() {
    return this._butSelectionnes;
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

  get iutSelectionnesTab() {
    return Array.from(this._iutSelectionnes);
  }

  get iutSelectionnesId() {
    return this._iutSelectionnesId;
  }

  get iutSelectionnesIdTab() {
    return Array.from(this._iutSelectionnesId);
  }

  get nbIutSelectionnesId() {
    return this._iutSelectionnesId.size;
  }

  switchButSelectionne(but) {
    if (this._butSelectionnes.has(but)) {
      this._butSelectionnes.delete(but);
    } else if (this._butSelectionnes.size < 3) {
      this._butSelectionnes.add(but);
    }
  }

  switchIutSelectionnes(iut) {
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
}

export default SelectedManager;
