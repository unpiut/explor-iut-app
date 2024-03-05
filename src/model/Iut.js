import { makeAutoObservable } from 'mobx';

class Iut {
  #idIut;

  #nom;

  #site;

  #departements;

  #serviceAlternance;

  constructor(iut) {
    makeAutoObservable(this);
    this.#idIut = iut.id;
    this.#nom = iut.nom;
    this.#site = iut.site;
    this.#departements = iut.departements;
    this.#serviceAlternance = iut.serviceAlternance ? iut.serviceAlternance : null;
  }

  get nom() {
    return this.#nom;
  }

  get site() {
    return this.#site;
  }

  get departements() {
    return this.#departements;
  }
}

export default Iut;
