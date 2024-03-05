import { makeAutoObservable, runInAction } from 'mobx';
import But from './But';

class ButManager {
  #buts = [];

  #fetchAction;

  #allButRetrieved = false;

  constructor() {
    makeAutoObservable(this);
  }

  get buts() {
    return this.#buts;
  }

  get nbbuts() {
    return this.#buts.length;
  }

  addBut(codeBut) {
    if (this.#buts.some((b) => b.codeBut === codeBut)) {
      throw new Error('Le but a déjà été enregistré');
    }
    const but = new But(codeBut);
    this.#buts.push(but);
    return but;
  }

  removeBut(codeBut) {
    const butIdx = this.#buts.findIndex((b) => b.codeBut === codeBut);
    if (butIdx >= 0) {
      return this.#buts.splice(butIdx, 1)[0];
    }
    throw new Error("Le but n'existe pas");
  }

  async #getAllBut() {
    if (this.#allButRetrieved) {
      return this.#buts;
    }
    const buts = await fetch('https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/referentiel/but');
    return runInAction(async () => {
      this.#buts = await buts.json();
      this.#allButRetrieved = true;
      return this.#buts;
    });
  }

  async getAllBut() {
    if (!this.#fetchAction) {
      this.#fetchAction = this.#getAllBut();
    }
    return this.#fetchAction;
  }

  async getButById(codeBut) {
    let but = this.#buts.find(this.#buts.codeBut === codeBut && this.#buts.description);
    if (!but) {
      but = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/referentiel/but/by-code/${codeBut}`);
      runInAction(async () => {
        but = but.json();
        return new But(but);
      });
    }
    return but;
  }
}

export default ButManager;
