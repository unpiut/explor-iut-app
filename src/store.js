import ButManager from './model/ButManager';
import FranceMap from './model/FranceMap';
import IutManager from './model/IutManager';

const STORE = {
  butManager: new ButManager(),
  franceMap: new FranceMap(),
  iutManager: new IutManager(),
  etape: 1,
};
STORE.butManager.getAllBut();
STORE.iutManager.getAllIut();
export default STORE;
