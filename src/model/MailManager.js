import { makeAutoObservable } from 'mobx';
import i18n from 'i18next';

class MailManager {
  _adresseMail;

  _nom;

  _nomEntreprise;

  _fonctionDansEntreprise;

  _personnalizeCorps;

  _corpsMail;

  constructor() {
    makeAutoObservable(this, {
      forgeMailObjet: false,
    });
    this._personnalizeCorps = false;
    this._adresseMail = '';
    this._nom = '';
    this._nomEntreprise = '';
    this._fonctionDansEntreprise = '';
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

  get corpsMail() {
    return this._corpsMail;
  }

  set corpsMail(nouveauCorps) {
    this._corpsMail = nouveauCorps;
  }

  initCorpsMail() {
    if (i18n.exists('courrielCorpsDefaut')) {
      this._corpsMail = i18n.t('courrielCorpsDefaut');
    } else {
      this._corpsMail = `Bonjour,
Suite à ma consultation et ma recherche sur le site iut.fr, j'ai identifié des formations qui correspondent à mes recherches d'alternants. Pourriez vous me communiquer pour chacune des formations les informations informations de base concernant l'alternance ?
      
dans l'attente de votre retour,
Bien cordialement`;
    }
  }

  forgeMailObjet() {
    const preffix = this._nomEntreprise ?? 'nom modifiable';
    const suffix = i18n.exists('courrielObjetSuffix') ? i18n.t('courrielObjetSuffix') : "Demande d'information pour déposer une offre d'alternance";
    return `${preffix} - ${suffix}`;
  }

  forgeMailBody() {
    if (!this._corpsMail) {
      this.initCorpsMail();
    }
    return this._corpsMail;
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
    myFormData.append('mailSubject', this.forgeMailObjet());
    myFormData.append('mailBody', this.forgeMailBody());
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
