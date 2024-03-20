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
      return `Recherche alternance - ${this._nomEntreprise}`;
    }
    return 'Recherche alternance - [votreNomDEntreprise]';
  }

  set objet(newObjet) {
    this._personnalizeObjet = true;
    this._objet = newObjet;
  }

  get corpsMail() {
    if (this._personnalizeCorps) {
      return this._corpsMail;
    }
    if (this._nom && this._fonctionDansEntreprise && this._nomEntreprise && this._adresseMail) {
      return `Bonjour, 
    je m'appelle ${this._nom}, je suis ${this._fonctionDansEntreprise} de ${this._nomEntreprise} et je recherche une alternance dans votre IUT.
    Veuillez me recontacter à cette adresse : ${this._adresseMail} pour que nous puissions discuter de la mise en oeuvre de tout cela `;
    }
    return `Bonjour, 
      je m'appelle [votreNom], je suis [votreFonction] de [votreNomDEntreprise] et je recherche une alternance dans votre IUT.
      Veuillez me recontacter à cette adresse : [votreAdresseMail] pour que nous puissions discuter de la mise en oeuvre de tout cela `;
  }

  set corpsMail(nouveauCorps) {
    this._personnalizeCorps = true;
    this._corpsMail = nouveauCorps;
  }
}

export default MailManager;
