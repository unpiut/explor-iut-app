import { makeAutoObservable } from 'mobx';

class MailManager {
  _adresseMail;

  _nom;

  _nomEntreprise;

  _fonctionDansEntreprise;

  _personnalize;

  _corpsMail;

  construct() {
    makeAutoObservable(this);
    this._personnalize = false;
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

  setAllMail(newMail, newNom, newNomEntreprise, newFonction) {
    this._adresseMail = newMail;
    this._nom = newNom;
    this._nomEntreprise = newNomEntreprise;
    this._fonctionDansEntreprise = newFonction;
  }

  get objet() {
    if (this._nomEntreprise) {
      return `Recherche alternance - ${this._nomEntreprise}`;
    }
    return 'Recherche alternance - votreNomDEntreprise';
  }

  get corpsMail() {
    if (this._personnalize) {
      if (this.nom && this.fonctionDansEntreprise && this._nomEntreprise && this._adresseMail) {
        return `Bonjour, 
    je m'appelle ${this.nom}, je suis ${this.fonctionDansEntreprise} de ${this._nomEntreprise} et je recherche une alternance dans votre IUT.
    Veuillez me recontacter à cette adresse : ${this._adresseMail} pour que nous puissions discuter de la mise en oeuvre de tout cela `;
      }
      return `Bonjour, 
      je m'appelle votreNom, je suis votreFonction de votreNomDEntreprise et je recherche une alternance dans votre IUT.
      Veuillez me recontacter à cette adresse : votreAdresseMail pour que nous puissions discuter de la mise en oeuvre de tout cela `;
    }
    return this._corpsMail;
  }

  set corpsMail(nouveauCorps) {
    this._corpsMail = nouveauCorps;
    this._personnalize = true;
  }
}

export default MailManager;
