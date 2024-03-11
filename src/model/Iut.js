import { makeAutoObservable, runInAction } from 'mobx';

class Iut {
  _idIut;

  _nom;

  _site;

  _location;

  _departements;

  _serviceAlternance;

  constructor(iut) {
    makeAutoObservable(this);
    this._idIut = iut.id;
    this._nom = iut.nom;
    this._site = iut.site;
    this._location = iut.location;
    this._departements = iut.departements;
    this._serviceAlternance = iut.serviceAlternance ? iut.serviceAlternance : null;
  }

  get idIut() {
    return this._idIut;
  }

  get nom() {
    return this._nom;
  }

  get site() {
    return this._site;
  }

  get departements() {
    return this._departements;
  }

  get location() {
    return this._location;
  }

  async getInfo() {
    let iut = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut/${this._idIut}`);
    iut = await iut.json();
    runInAction(() => {
      this._departements = iut.departements;
    });
  }
}

export default Iut;
