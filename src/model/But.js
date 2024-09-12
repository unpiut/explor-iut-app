import { makeAutoObservable, runInAction } from 'mobx';

class But {
  static UNIVERSES_INFO = {
    'Métiers Industriels : Prod-Maintenance, Qualité-R&D': {
      order: 4,
      colors: {
        border: 'border-orange-600',
        background: 'bg-amber-transparent',
      },
    },
    "Métiers support de l'Industriel": {
      order: 3,
      colors: {
        border: 'border-lime-600',
        background: 'bg-lime-transparent',
      },
    },
    'Métiers du Social, Gestion, Commerce': {
      order: 2,
      colors: {
        border: 'border-purple-800',
        background: 'bg-purple-transparent',
      },
    },
    "Métiers de l'informatique": {
      order: 1,
      colors: {
        border: 'border-cyan-500',
        background: 'bg-cyan-500/90',
      },
    },
    default: {
      order: 1000,
      colors: {
        border: 'border-black',
        background: null,
      },
    },
  };

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
    makeAutoObservable(this);
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

  get universMetiersInfo() {
    return But.UNIVERSES_INFO[this._universMetiers] ?? But.UNIVERSES_INFO.default;
  }

  /**
   * Get more informations about a BUT in the API.
   * @returns the BUT with his new informations
   */
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
