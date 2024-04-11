import { makeAutoObservable, runInAction } from 'mobx';

class But {
  static IUT_URL_BASE = 'https://www.iut.fr/bachelor-universitaire-de-technologie';

  _code;

  _nom;

  _filiere;

  _description;

  _parcours;

  _metiers;

  _iutsAssocié;

  _urlFiche;

  _urlFranceComp;

  _universMetiers;

  constructor({
    code, nom, filiere, parcours,
    description, metiers, urlFiche,
    urlFranceCompetence, universMetiers,
  }) {
    makeAutoObservable(this, {
      IUT_URL_BASE: false,
    });
    this._code = code;
    this._nom = nom;
    this._filiere = filiere;
    this._parcours = parcours?.map((p) => [p.code, p.nom]);
    this._universMetiers = universMetiers;
    this._description = description;
    this._metiers = metiers;
    this._urlFiche = urlFiche;
    this._urlFranceComp = urlFranceCompetence;
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

  get urlFiche() {
    return this._urlFiche;
  }

  get urlFranceCompetence() {
    return this._urlFranceComp;
  }

  get universMetiers() {
    return this._universMetiers;
  }

  async getInfo() {
    if (!this._description) {
      let but = await fetch(`${APP_ENV_API_PATH}/referentiel/but/by-code/${this._code}`);
      but = await but.json();
      return runInAction(() => {
        this._description = but.description;
        this._urlFiche = but.urlFiche;
        this._urlFranceComp = but.urlFranceCompetence;
        this._metiers = but.metiers;
      });
    }
    return this;
  }
}

export default But;
