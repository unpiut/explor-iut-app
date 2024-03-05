import { makeAutoObservable, runInAction } from 'mobx';
import Iut from './Iut';

class IutManager {
  #iuts = [];

  #fetchAction;

  #allIutRetrieved = false;

  constructor() {
    makeAutoObservable(this);
  }

  get iuts() {
    return this.#iuts;
  }

  get nbIuts() {
    return this.#iuts.length;
  }

  addIut(idIut = null, unIut = null) {
    if (unIut) {
      this.#iuts.push(new Iut(unIut));
    } else if (idIut) {
      if (this.#iuts.some((b) => b.idIut === idIut)) {
        throw new Error("L'iut a déjà été enregistré");
      } else {
        fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut?Iut=${idIut}`)
          .then((iuts) => iuts.map((iut) => this.#iuts.push(new Iut(iut))));
      }
    }
  }

  removeIut(idIut = null, unIut = null) {
    if (idIut) {
      const IutIdx = this.#iuts.findIndex((b) => b.idIut === idIut);
      if (IutIdx >= 0) {
        return this.#iuts.splice(IutIdx, 1)[0];
      }
      throw new Error("L'iut n'existe pas");
    } else if (unIut) {
      const supression = fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut?Iut=${unIut}`)
        .then((iuts) => iuts.map((iut) => {
          const iutEnleve = [];
          const IutIdx = this.#iuts.findIndex((b) => b.idIut === iut.idIut);
          if (IutIdx >= 0) {
            iutEnleve.push(this.#iuts.splice(IutIdx, 1)[0]);
          } else {
            throw new Error("L'iut n'existe pas");
          }
          return iutEnleve;
        }))
        .catch((error) => new Error(`Oups! A fatal error happened:${error}`));
      return supression;
    } else {
      return new Error("Aucune valeur n'a été enregistré");
    }
  }

  async #getAllIut() {
    if (this.#allIutRetrieved) {
      return this.#iuts;
    }
    const iuts = await fetch('https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut');
    return runInAction(async () => {
      this.#iuts = await iuts.json();
      this.#allIutRetrieved = true;
      return this.#iuts;
    });
  }

  async load() {
    if (!this.#fetchAction) {
      this.#fetchAction = this.#getAllIut();
    }
    return this.#fetchAction;
  }

  async getIutById(idIut) {
    let iut = this.#iuts.find((unIut) => unIut.idIut === idIut && unIut.description);
    if (!iut) {
      iut = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut/${idIut}`);
      iut = await iut.json();
      return runInAction(() => {
        this.#iuts.push(new Iut(iut));
      });
    }
    return iut;
  }
}

export default IutManager;
