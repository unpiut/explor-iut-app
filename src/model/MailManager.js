import { makeAutoObservable } from 'mobx';

class MailManager {
  _adresseMail;

  _nom;

  _nomEntreprise;

  _fonctionDansEntreprise;

  _personnalizeObjet;

  _objet;

  _personnalizeCorps;

  _corpsMail;

  constructor() {
    makeAutoObservable(this);
    this._personnalizeObjet = false;
    this._personnalizeCorps = false;
    this._adresseMail = '';
    this._nom = '';
    this._nomEntreprise = '';
    this._fonctionDansEntreprise = '';
    this._objet = '';
    this._corpsMail = '';
  }

  get adresseMail() {
    return this._adresseMail;
  }

  set adresseMail(newAdresse) {
    this._adresseMail = newAdresse;
  }

  get nom() {
    return this._nom;
  }

  set nom(newNom) {
    this._nom = newNom;
  }

  get nomEntreprise() {
    return this._nomEntreprise;
  }

  set nomEntreprise(newNomEntreprise) {
    this._nomEntreprise = newNomEntreprise;
  }

  get fonctionDansEntreprise() {
    return this._fonctionDansEntreprise;
  }

  set fonctionDansEntreprise(newFonction) {
    this._fonctionDansEntreprise = newFonction;
  }

  get objet() {
    if (this._personnalizeObjet) {
      return this._objet;
    }
    if (this._nomEntreprise) {
      return `${this._nomEntreprise} - Demande d’information sur la déposition d'une offre d’alternance au sein de l’IUT`;
    }
    return "nom modifiable - Demande d’information sur la déposition d'une offre d’alternance au sein de l’IUT";
  }

  set objet(newObjet) {
    this._personnalizeObjet = true;
    this._objet = newObjet;
  }

  get corpsMail() {
    if (this._personnalizeCorps) {
      return this._corpsMail;
    }
    return `Bonjour,
      Suite à ma consultation et ma recherche sur le site iut.fr, j’ai identifié des formations qui correspondent à mes recherches d’apprentis. Afin de préciser ma demande et de vous communiquer pourriez vous me communiquer pour chacune des formations :
      - Quelles années sont concernés par l’alternance?
      - Quelles sont les plannings d’alternance pour la rentrée prochaine?
      - Quelles sont les modalités pour déposer mon offre d’alternance?
      Merci de transmettre cette demande au service compétent au sein de votre IUT et dans l’attente d’un retour rapide,
      Bien cordialement`;
  }

  set corpsMail(nouveauCorps) {
    this._personnalizeCorps = true;
    this._corpsMail = nouveauCorps;
  }

  isUpdatedInfo() {
    return this._adresseMail === '' || this._nom === '' || this._fonctionDansEntreprise === '' || this._nomEntreprise === '';
  }
}

export default MailManager;
