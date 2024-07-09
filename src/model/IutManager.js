import { makeAutoObservable, runInAction } from 'mobx';
import Iut from './Iut';

class IutManager {
  _iuts;

  _iutRecherches;

  _fetchAction;

  _allIutRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._iuts = [];
    this._iutRecherches = new Set();
    this._allIutRetrieved = false;
  }

  get iuts() {
    return this._iuts;
  }

  get nbIuts() {
    return this._iuts.length;
  }

  get iutRecherches() {
    return this._iutRecherches;
  }

  get iutRecherchesTab() {
    return Array.from(this._iutRecherches);
  }

  switchIutRecherches(buts) {
    this._iutRecherches.clear();
    buts.forEach((but) => {
      this._iuts.forEach((i) => {
        if (i.departements.find((d) => d.butDispenses[0].codeBut === but.code)) {
          this._iutRecherches.add(i);
        }
      });
    });
  }

  async _getAllIut() {
    if (this._allIutRetrieved) {
      return this._iuts;
    }
    let iuts = await fetch(`${APP_ENV_API_PATH}/iut`);
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

  getIutById(idIut) {
    const iut = this._iuts.find((i) => i.idIut === idIut);
    if (iut) {
      return iut;
    }
    throw new Error("L'iut n'existe pas");
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
