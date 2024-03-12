import { makeAutoObservable, runInAction } from 'mobx';

class But {
  _code;

  _nom;

  _filiere;

  _description;

  _parcours;

  _metiers;

  _iutsAssocié;

  constructor(but) {
    makeAutoObservable(this);
    this._code = but.code;
    this._nom = but.nom;
    this._filiere = but.filiere;
    this._parcours = but.parcours.map((parcours) => [parcours.code, parcours.nom]);
  }

  get filiere() {
    return this._filiere;
  }

  get prettyPrintFiliere() {
    return this._filiere.replaceAll('Métiers ', '').replaceAll(/de |d'|du |l'|la |en |l’/g, '');
  }

  get nom() {
    return this._nom;
  }

  get description() {
    return this._description;
  }

  get metiers() {
    return this._metiers;
  }

  get code() {
    return this._code;
  }

  get parcours() {
    return this._parcours;
  }

  get urlIUT() {
    const url = this._nom.replaceAll(' ', '-').replaceAll("'", '').replaceAll(/[éèêë]/g, 'e');
    return `https://www.iut.fr/bachelor-universitaire-de-technologie/${url}/`;
  }

  async getInfo() {
    if (!this._description) {
      let but = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/referentiel/but/by-code/${this._code}`);
      but = await but.json();
      return runInAction(() => {
        this._description = but.description;
        this._metiers = but.parcours.map((parcours) => parcours.metiers);
      });
    }
    return this;
  }
}

export default But;
