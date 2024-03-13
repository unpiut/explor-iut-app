import { makeAutoObservable, runInAction } from 'mobx';
import Iut from './Iut';

class IutManager {
  _iuts;

  _iutSelectionnes;

  _iutRecherches;

  _fetchAction;

  _allIutRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._iuts = [];
    this._iutSelectionnes = new Set();
    this._iutRecherches = new Set();
    this._allIutRetrieved = false;
  }

  get iuts() {
    return this._iuts;
  }

  get nbIuts() {
    return this._iuts.length;
  }

  get iutSelectionnes() {
    return this._iutSelectionnes;
  }

  get iutSelectionnesTab() {
    return Array.from(this._iutSelectionnes);
  }

  get iutRecherches() {
    return this._iutRecherches;
  }

  get iutRecherchesTab() {
    return Array.from(this._iutRecherches);
  }

  get nbIutSelectionnes() {
    return this._iutSelectionnes.size;
  }

  switchIutRecherches(buts) {
    buts.forEach((but) => {
      this._iuts.forEach((i) => {
        if (i.departements.find((d) => d.codesButDispenses[0] === but.code)) {
          if (this._iutRecherches.has(i)) {
            this._iutRecherches.delete(i);
          } else {
            this._iutRecherches.add(i);
          }
        }
      });
    });
  }

  switchIutSelectionnes(iut) {
    if (this._iutSelectionnes.has(iut)) {
      this._iutSelectionnes.delete(iut);
    } else {
      this._iutSelectionnes.add(iut);
    }
  }

  async _getAllIut() {
    if (this._allIutRetrieved) {
      return this._iuts;
    }
    let iuts = await fetch('https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut');
    iuts = await iuts.json();
    iuts.map((i) => new Iut(i));
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
