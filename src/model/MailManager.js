import { makeAutoObservable } from 'mobx';

class MailManager {
  _adresseMail;

  _nom;

  _nomEntreprise;

  _fonctionDansEntreprise;

  _objet;

  _personnalizeCorps;

  _corpsMail;

  constructor() {
    makeAutoObservable(this);
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
    if (this._nomEntreprise) {
      this._objet = `${this._nomEntreprise} - Demande d'information pour déposer une offre d'alternance`;
    } else {
      this._objet = "nom modifiable - Demande d'information pour déposer une offre d'alternance";
    }
    return this._objet;
  }

  set objet(newObjet) {
    this._objet = newObjet;
  }

  get corpsMail() {
    if (this._personnalizeCorps) {
      return this._corpsMail;
    }
    return `Bonjour,
      Suite à ma consultation et ma recherche sur le site iut.fr, j'ai identifié des formations qui correspondent à mes recherches d'alternants. Pourriez vous me communiquer pour chacune des formations :
      - Quelles années sont concernés par l'alternance?
      - Quelles sont les plannings d'alternance pour la rentrée prochaine?
      - Quelles sont les modalités pour gérer et suivre mon offre d'alternance?
      dans l'attente de votre retour,
    Bien cordialement`;
  }

  set corpsMail(nouveauCorps) {
    this._personnalizeCorps = true;
    this._corpsMail = nouveauCorps;
  }

  isUpdatedInfo() {
    return this._adresseMail === '' || this._nom === '' || this._fonctionDansEntreprise === '' || this._nomEntreprise === '';
  }

  async sendMail({ files, selectedDepartments }) {
    if (!selectedDepartments?.length) {
      throw new Error('Cannot send mail without selected departments');
    }
    const myFormData = new FormData();
    myFormData.append('contactIdentity', this.nom);
    myFormData.append('contactCompany', this.nomEntreprise);
    myFormData.append('contactFunction', this._fonctionDansEntreprise);
    myFormData.append('contactMail', this.adresseMail);
    myFormData.append('mailSubject', this.objet);
    myFormData.append('mailBody', this.corpsMail);
    files?.forEach((f) => myFormData.append('files', f));
    selectedDepartments.forEach((dep) => {
      myFormData.append('deptIds', dep.id);
    });

    const res = await fetch(`${APP_ENV_API_PATH}/mail/request`, {
      method: 'POST',
      body: myFormData,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
    return res.json();
  }

  async resendMail(originalMailSendingDate) {
    const myFormData = new FormData();
    myFormData.append('c', this.adresseMail);
    myFormData.append('cdt', originalMailSendingDate);
    const res = await fetch(`${APP_ENV_API_PATH}/mail/resend-confirmation`, {
      method: 'POST',
      body: myFormData,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
  }
}

export default MailManager;
