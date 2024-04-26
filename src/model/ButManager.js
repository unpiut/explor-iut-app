import { makeAutoObservable, runInAction } from 'mobx';
import But from './But';

class ButManager {
  _buts;

  _fetchAction;

  _allButRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._buts = [];
    this._allButRetrieved = false;
  }

  get buts() {
    return this._buts;
  }

  get nbbuts() {
    return this._buts.length;
  }

  /**
   * Get all the BUT from the API, and put them in the buts attribute
   * the first time it's called, then return buts.
   * @returns buts
   */
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

  /**
   * Public function of getAllBut, stop possibility of repeated ask to the private function
   * @returns the private function getAllBut
   */
  async getAllBut() {
    if (!this._fetchAction) {
      this._fetchAction = this._getAllBut();
    }
    return this._fetchAction;
  }

  /**
   * Search method with the unique code of a BUT.
   * @param {String} code : unique code of a BUT
   * @returns the BUT associated to the code, or an error if it wasn't found.
   */
  getButByCode(code) {
    // find the BUT
    const butIdx = this._buts.findIndex((b) => b.code === code);
    if (butIdx >= 0) {
      return this._buts[butIdx];
    }
    throw new Error("Ce but n'existe pas.");
  }

  /**
   * Search method with the unique code of a BUT then develop it with more information.
   * @param {String} code : unique code of a BUT
   * @returns the BUT developped associated to the code, or an error if it wasn't found.
   */
  async getButByCodeWithInfo(code) {
    // find the BUT
    const butIdx = this._buts.findIndex((b) => b.code === code);
    if (butIdx >= 0) {
      // add more informations
      await this._buts[butIdx].getInfo();
      return runInAction(() => this._buts[butIdx]);
    }
    throw new Error("Ce but n'existe pas.");
  }
}

export default ButManager;
