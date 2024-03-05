import { makeAutoObservable } from 'mobx';

class But {
  #filiere;

  #description;

  #metiers;

  #url;

  #codeBut;

  #nom;

  constructor(but) {
    makeAutoObservable(this);
    this.#codeBut = but.code;

    this.#nom = but.nom;
    this.#filiere = but.filiere;
    this.#url = but.urlFiche;
    this.#description = but.description;
    this.#metiers = '';
    if (but.parcours) {
      but.parcours.forEach((parcours) => {
        this.#metiers += parcours.metiers;
      });
    }
  }

  get filiere() {
    return this.#filiere;
  }

  get nom() {
    return this.#nom;
  }

  get url() {
    return this.#url;
  }

  get description() {
    return this.#description;
  }

  get metiers() {
    return this.#metiers;
  }

  get codeBut() {
    return this.#codeBut;
  }
}

export default But;
