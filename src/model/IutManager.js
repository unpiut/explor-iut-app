import { makeAutoObservable, runInAction } from 'mobx';
import Iut from './Iut';

class IutManager {
  _iuts;

  _iutSelectionnesId;
  // On enregistre les id à la place car lors de la comparaison, on compare l'iut et son wrapper

  _iutRecherches;

  _fetchAction;

  _allIutRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._iuts = [];
    this._iutSelectionnesId = new Set();
    this._iutRecherches = new Set();
    this._allIutRetrieved = false;
  }

  get iuts() {
    return this._iuts;
  }

  get nbIuts() {
    return this._iuts.length;
  }

  get iutSelectionnesId() {
    return this._iutSelectionnesId;
  }

  get iutSelectionnesIdTab() {
    return Array.from(this._iutSelectionnesId);
  }

  get iutRecherches() {
    return this._iutRecherches;
  }

  get iutRecherchesTab() {
    return Array.from(this._iutRecherches);
  }

  get nbIutSelectionnesId() {
    return this._iutSelectionnesId.size;
  }

  switchIutRecherches(buts) {
    this._iutRecherches.clear();
    buts.forEach((but) => {
      this._iuts.forEach((i) => {
        if (i.departements.find((d) => d.codesButDispenses[0] === but.code)) {
          this._iutRecherches.add(i);
        }
      });
    });
  }

  switchIutSelectionnesId(iut) {
    if (this._iutSelectionnesId.has(iut.idIut)) {
      this._iutSelectionnesId.delete(iut.idIut);
    } else {
      this._iutSelectionnesId.add(iut.idIut);
    }
  }

  async _getAllIut() {
    if (this._allIutRetrieved) {
      return this._iuts;
    }
    let iuts = await fetch('https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut');
    iuts = await iuts.json();
    iuts = iuts.map((i) => new Iut(i));
    return runInAction(() => {
      this._iuts = iuts;
      this._allIutRetrieved = true;
      return this._iuts;
    });
  }

  async getAllIut() {
    if (!this._fetchAction) {
      this._fetchAction = await this._getAllIut();
    }
    return this._fetchAction;
  }

  async load() {
    if (!this._fetchAction) {
      this._fetchAction = await this._getAllIut();
    }
    return this._fetchAction;
  }

  async getIutById(idIut) {
    let iut = this._iuts.find((unIut) => unIut.idIut === idIut && unIut.description);
    if (iut) {
      throw new Error("L'iut a déjà été enregistré");
    }
    iut = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut/${idIut}`);
    iut = await iut.json();
    runInAction(() => {
      this._iuts.push(new Iut(iut));
    });
  }

  getIutByButs(buts) {
    const iterateur = buts.values();
    let iutsBon = [];
    const filtre = (iut) => iut.departements.find((dp) => dp.code === iterateur.next().value.code);
    for (let i = 0; i < buts.size; i += 1) {
      iutsBon += this._iuts.filter(filtre);
    }
    return iutsBon;
  }
}

export default IutManager;
