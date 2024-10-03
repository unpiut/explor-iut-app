import { reaction } from 'mobx';
import localStorageMgr from '../services/LocalStorageManager';

class AppStateSaver {
  static BUT_STORAGE_KEY = 'listeBut';

  static IUT_STORAGE_KEY = 'listeIut';

  static MAP_VISIT_STORAGE_KEY = 'mapVisited';

  _selectedManager;

  _iutManager;

  _butManager;

  _watchers;

  _pendingRehydrationData = null;

  constructor(selectedManager, iutManager, butManager) {
    this._selectedManager = selectedManager;
    this._iutManager = iutManager;
    this._butManager = butManager;
    this._selectedManager.cacheSaver = this;
    this._iutManager.cacheSaver = this;
  }

  get canRehydrate() {
    return this._pendingRehydrationData && (
      this._pendingRehydrationData.buts || this._pendingRehydrationData.iuts
    );
  }

  async init() {
    this._pendingRehydrationData = { buts: null, iuts: null };

    const [butCodes, iutIds, mapVisited] = await Promise.all([
      localStorageMgr.getItem(AppStateSaver.BUT_STORAGE_KEY),
      localStorageMgr.getItem(AppStateSaver.IUT_STORAGE_KEY),
      localStorageMgr.getItem(AppStateSaver.MAP_VISIT_STORAGE_KEY),
    ]);
    // Handle BUT and IUT
    if (butCodes?.length) {
      // Rehydrate but: for each code get but, create a set then set it into the selectedManager
      const buts = butCodes.map((code) => {
        try {
          return this._butManager.getButByCode(code);
        } catch (err) {
          console.warn(`Retrieved unknown but from cache with code ${code}`);
          return null;
        }
      }).filter((b) => !!b);

      if (buts.length) {
        this._pendingRehydrationData.buts = new Set(buts);
      }
    }

    // We cannot have any iut if not but selected: imbricated if
    if (this._pendingRehydrationData.buts && iutIds?.length) {
      // Rehydrate iut: for each  id get iut, create a set and set it into the selectedManager
      const iuts = iutIds.map((id) => {
        try {
          return this._iutManager.getIutById(id);
        } catch (err) {
          console.warn(`Retrieved unknown iut from cache with id ${id}`);
          return null;
        }
      }).filter((i) => !!i);

      if (iuts.length) {
        this._pendingRehydrationData.iuts = new Set(iuts);
      }
    }
    // HANDLE AlreadyVisit indicator
    if (mapVisited === true || mapVisited === false) {
      this._selectedManager.mapVisited = mapVisited;
    }

    // Setup watchers for automatic cache update
    this._watchers = [
      reaction(() => this._selectedManager.butSelectionnesId, (butSelec) => {
        AppStateSaver.updateSelectedButs(butSelec);
      }),
      reaction(() => this._selectedManager.iutSelectionnesTab, (iutSelect) => {
        AppStateSaver.updateSelectedIuts(iutSelect);
      }),
      reaction(() => this._selectedManager.mapVisited, (mv) => {
        AppStateSaver.updateMapVisited(mv);
      }),
    ];
  }

  async rehydrate() {
    const res = { hasButs: false, hasIuts: false };
    if (!this.canRehydrate) {
      throw new Error('Cannot cancel rehydratation if we cannot rehydrate!');
    }
    // Rehydrate buts if any
    if (this._pendingRehydrationData.buts) {
      // set selected buts
      this._selectedManager.butSelectionnes = this._pendingRehydrationData.buts;
      // set iuts candidates based on buts
      this._iutManager.switchIutRecherches(this._selectedManager.butSelectionnes);
      res.hasButs = true;
    }
    // Rehydrate iuts if any
    if (this._pendingRehydrationData.iuts) {
      // set selected iuts
      this._pendingRehydrationData.iuts
        .forEach((iut) => this._selectedManager.switchIutSelectionnes(iut));
      // Invoke iut refresh for those selected
      // console.log('IUT rehydrated', iutIds);
      await this._selectedManager.miseAJour();
      res.hasIuts = true;
    }
    // remove pending rehydration data
    this._pendingRehydrationData = null;
    return res;
  }

  async cancelRehydratation() {
    if (!this.canRehydrate) {
      throw new Error('Cannot cancel rehydratation if we cannot rehydrate!');
    }
    this._pendingRehydrationData = null;
    return Promise.all([
      localStorageMgr.deleteItem(AppStateSaver.BUT_STORAGE_KEY),
      localStorageMgr.deleteItem(AppStateSaver.IUT_STORAGE_KEY),
    ]);
  }

  static async updateSelectedButs(buts) {
    // care: buts is a set: we must transform it into an array of code
    const codeButs = [...buts].map((b) => b.code);
    // save the array
    await localStorageMgr.setItem(AppStateSaver.BUT_STORAGE_KEY, codeButs);
  }

  static async updateSelectedIuts(iuts) {
    const idIuts = [...iuts].map((iut) => iut.idIut);
    await localStorageMgr.setItem(AppStateSaver.IUT_STORAGE_KEY, idIuts);
  }

  static async updateMapVisited(mapVisited) {
    await localStorageMgr.setItem(AppStateSaver.MAP_VISIT_STORAGE_KEY, mapVisited);
  }
}

export default AppStateSaver;
