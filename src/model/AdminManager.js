import { makeAutoObservable, runInAction } from 'mobx';

class AdminManager {
  _username = '';

  _password = '';

  _credVerified = false;

  _lastError = null;

  _loadingDataHistory = false;

  _dataHistory;

  _lastObjectUrl;

  constructor() {
    makeAutoObservable(this, {
      _computeCredHeaders: false,
      _lastObjectUrl: false,
    });
  }

  get username() {
    return this._username;
  }

  set username(uname) {
    this._username = uname;
    this._credVerified = false;
  }

  get password() {
    return this._password;
  }

  set password(pass) {
    this._password = pass;
    this._credVerified = false;
  }

  get hasCredential() {
    return !!this._username && !!this._password;
  }

  get credentialVerified() {
    return this._credVerified;
  }

  get lastError() {
    return this._lastError;
  }

  get loadingDataHistory() {
    return this._loadingDataHistory;
  }

  get dataHistory() {
    return this._dataHistory;
  }

  async verifyCredential() {
    const headers = this._computeCredHeaders();
    try {
      const res = await fetch(`${APP_ENV_API_PATH}/admin/check`, {
        headers,
      });
      if (!res.ok) {
        throw new Error('Identifiants invalides');
      }
      runInAction(() => {
        this._credVerified = true;
      });
      this.loadDataHistory();
    } catch (e) {
      runInAction(() => {
        this._lastError = e;
      });
    }
  }

  async loadDataHistory() {
    const headers = this._computeCredHeaders();
    runInAction(() => {
      this._loadingDataHistory = true;
    });
    try {
      const res = await fetch(`${APP_ENV_API_PATH}/admin/data-sheets`, {
        headers,
      });
      if (!res.ok) {
        throw new Error('Identifiants invalides');
      }
      const data = await res.json();
      const history = data.map(({ version, used }) => ({
        version: new Date(version),
        used,
        id: version,
      }));
      runInAction(() => {
        this._dataHistory = history;
      });
    } catch (e) {
      runInAction(() => {
        this._lastError = e;
      });
    } finally {
      runInAction(() => {
        this._loadingDataHistory = false;
      });
    }
  }

  async uploadData({ file, filename }) {
    if (!file) {
      throw new Error('Cannot upload data without any file');
    }
    if (!this.hasCredential) {
      throw new Error('Cannot upload data without any credential');
    }
    const myFormData = new FormData();
    myFormData.append('file', file);
    myFormData.append('fileName', filename);

    const pass = btoa(`${this._username}:${this._password}`);
    const headers = new Headers();
    headers.set('Authorization', `Basic ${pass}`);

    const res = await fetch(`${APP_ENV_API_PATH}/admin/data-sheets`, {
      method: 'PUT',
      headers,
      body: myFormData,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
  }

  async downloadData(id) {
    if (!this.hasCredential) {
      throw new Error('Cannot upload data without any credential');
    }
    const pass = btoa(`${this._username}:${this._password}`);
    const headers = new Headers();
    headers.set('Authorization', `Basic ${pass}`);

    // Retrieve last data file
    const res = await fetch(`${APP_ENV_API_PATH}/admin/data-sheets/${id ?? 'current'}`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
    // Compute filename
    const cd = res.headers.get('Content-Disposition');
    let filename;
    if (cd) {
      const m = cd.match('filename="([^"]+)"');
      if (m.length === 2) {
        [, filename] = m;
      }
    }
    if (!filename) {
      filename = 'exploriut_data.xlsx';
    }

    // get data from blob
    const blob = await res.blob();

    // Compute objectUrl
    if (this._lastObjectUrl) {
      URL.revokeObjectURL(this._lastObjectUrl);
      this._lastObjectUrl = null;
    }
    this._lastObjectUrl = URL.createObjectURL(blob);

    // return objectUrl and filename
    return { objectUrl: this._lastObjectUrl, filename };
  }

  _computeCredHeaders() {
    if (!this.hasCredential) {
      throw new Error('Cannot upload data without any credential');
    }
    const pass = btoa(`${this._username}:${this._password}`);
    const headers = new Headers();
    headers.set('Authorization', `Basic ${pass}`);
    return headers;
  }
}

export default AdminManager;
