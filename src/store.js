import ButManager from './model/ButManager';
import FranceMap from './model/FranceMap';
import IutManager from './model/IutManager';

const STORE = {
  butConserve: null, // sera créé à la demande
  iutAffiche: null, // sera créé à la demande
  iutConserve: new IutManager(),
  butManager: new ButManager(),
  franceMap: new FranceMap(),
  iutManager: new IutManager(),
};
STORE.butManager.getAllBut();
STORE.iutConserve.getIutById('659bbebaa0b4523f5c848618');
STORE.iutConserve.getIutById('659bbebaa0b4523f5c84877f');
STORE.iutConserve.getIutById('659bbeb9a0b4523f5c848523');
export default STORE;
