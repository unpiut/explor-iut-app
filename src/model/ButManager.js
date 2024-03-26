import { makeAutoObservable, runInAction } from 'mobx';
import But from './But';

class ButManager {
  _buts;

  _butRecherches;

  _fetchAction;

  _allButRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._buts = [];
    this._butRecherches = [];
    this._allButRetrieved = false;
  }

  get buts() {
    return this._buts;
  }

  get butRecherches() {
    return this._butRecherches.length ? this._butRecherches : this._buts;
  }

  get nbbuts() {
    return this._buts.length;
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
    let buts = await fetch(`${APP_ENV_API_PATH}/referentiel/but`);
    buts = await buts.json();
    buts = buts.map((b) => new But(b));
    runInAction(() => {
      this._allButRetrieved = true;
      this._buts = buts;
    });
    return this._buts;
  }

  async getAllBut() {
    if (!this._fetchAction) {
      this._fetchAction = this._getAllBut();
    }
    return this._fetchAction;
  }

  getButByCode(code) {
    const butIdx = this._buts.findIndex((b) => b.code === code);
    if (butIdx >= 0) {
      return this._buts[butIdx];
    }
    throw new Error("Ce but n'existe pas.");
  }

  async getButByCodeWithInfo(code) {
    const butIdx = this._buts.findIndex((b) => b.code === code);
    if (butIdx >= 0) {
      await this._buts[butIdx].getInfo();
      return runInAction(() => this._buts[butIdx]);
    }
    throw new Error("Ce but n'existe pas.");
  }

  rechercheBut(mots) {
    if (mots === '') {
      this._butRecherches.length = 0;
    } else {
      const motCle = mots.toUpperCase();
      this._butRecherches = this._buts.map((but) => (motCle === but.code ? but : null));
    }
  }
}

export default ButManager;
