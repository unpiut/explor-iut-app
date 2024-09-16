import AdminManager from './model/AdminManager';
import AppStateSaver from './model/AppStateSaver';
import ButManager from './model/ButManager';
import FranceMap from './model/FranceMap';
import IutManager from './model/IutManager';
import MailManager from './model/MailManager';
import SelectedManager from './model/SelectedManager';
import initI18n from './services/i18n';

const STORE = {
  butManager: new ButManager(),
  franceMap: new FranceMap(),
  iutManager: new IutManager(),
  mailManager: new MailManager(),
  selectedManager: new SelectedManager(),
  dateEnvoi: null,
  adminManager: new AdminManager(),
  stateSaver: null,
  bootstraping: null,
};

STORE.stateSaver = new AppStateSaver(STORE.selectedManager, STORE.iutManager, STORE.butManager);
STORE.bootstraping = (async () => {
  await Promise.all([initI18n(), STORE.butManager.getAllBut(), STORE.iutManager.getAllIut()]);
  await STORE.stateSaver.init();
})();

export default STORE;
