import { makeAutoObservable, runInAction } from 'mobx';

class Iut {
  _idIut;

  _nom;

  _site;

  _location;

  _departements;

  _mel;

  _tel;

  _region;

  constructor(iut) {
    makeAutoObservable(this);
    this._idIut = iut.id;
    this._nom = iut.nom;
    this._site = iut.site;
    this._location = iut.location;
    this._region = iut.region;
    this._departements = iut.departements;
    this._mel = iut.mel;
    this._tel = iut.tel;
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

  get mel() {
    return this._mel;
  }

  get tel() {
    return this._tel;
  }

  get region() {
    return this._region;
  }

  /**
   * Get more informations about an IUT in the API.
   */
  async getInfo() {
    let iut = await fetch(`${APP_ENV_API_PATH}/iut/${this._idIut}`);
    iut = await iut.json();
    runInAction(() => {
      this._departements = iut.departements;
      this._mel = iut.mel;
      this._tel = iut.tel;
    });
  }
}

export default Iut;
