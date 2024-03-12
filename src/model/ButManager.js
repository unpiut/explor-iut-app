import { makeAutoObservable, runInAction } from 'mobx';
import But from './But';

class ButManager {
  _buts;

  _butSelectionnes;

  _butRecherches;

  _fetchAction;

  _allButRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._buts = [];
    this._butRecherches = [];
    this._butSelectionnes = new Set();
    this._allButRetrieved = false;
  }

  get buts() {
    return this._buts;
  }

  get butSelectionnes() {
    return this._butSelectionnes;
  }

  set butSelectionnes(but) {
    if (this._butSelectionnes.has(but)) {
      this._butSelectionnes.delete(but);
    } else {
      this._butSelectionnes.add(but);
    }
  }

  get butSelectionnesTab() {
    return Array.from(this._butSelectionnes);
  }

  get butRecherches() {
    return this._butRecherches;
  }

  get nbbuts() {
    return this._buts.length;
  }

  get nbButSelectionnes() {
    return this._butSelectionnes.size;
  }

  get nbButRecherches() {
    let compte = 0;
    this._butRecherches.forEach((but) => { if (but !== null)compte += 1; });
    return compte;
  }

  async _getAllBut() {
    if (this._allButRetrieved) {
      return this._buts;
    }
    let buts = await fetch('https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/referentiel/but');
    buts = await buts.json();
    return runInAction(() => {
      this._allButRetrieved = true;
      buts.forEach((but) => {
        const unBut = new But(but);
        this._buts.push(unBut);
        this._butRecherches.push(unBut);
      });
      return this._buts;
    });
  }

  async getAllBut() {
    if (!this._fetchAction) {
      this._fetchAction = this._getAllBut();
    }
    return this._fetchAction;
  }

  async getButByCode(code) {
    const butIdx = this._buts.findIndex((b) => b.code === code);
    if (butIdx >= 0) {
      return this._buts[butIdx];
    }
    let but = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/referentiel/but/${code}`);
    but = await but.json();
    return runInAction(() => new But(but));
  }

  rechercheBut(mots) {
    console.log(this._buts);
    this._butRecherches = this._buts.map((but) => (mots === but.code ? but : null));
  }
}

export default ButManager;
