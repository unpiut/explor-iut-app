import ButManager from './model/ButManager';
import FranceMap from './model/FranceMap';
import IutManager from './model/IutManager';
import MailManager from './model/MailManager';

const STORE = {
  butManager: new ButManager(),
  franceMap: new FranceMap(),
  iutManager: new IutManager(),
  mailManager: new MailManager(),
  etape: 1,
};
STORE.butManager.getAllBut();
STORE.iutManager.getAllIut();
export default STORE;
