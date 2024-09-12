import { makeAutoObservable } from 'mobx';

class AdminManager {
  _username = '';

  _password = '';

  constructor() {
    makeAutoObservable(this);
  }

  get username() {
    return this._username;
  }

  set username(uname) {
    this._username = uname;
  }

  get password() {
    return this._password;
  }

  set password(pass) {
    this._password = pass;
  }

  get hasCredential() {
    return !!this._username && !!this._password;
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

  async downloadLastData() {
    if (!this.hasCredential) {
      throw new Error('Cannot upload data without any credential');
    }
    const pass = btoa(`${this._username}:${this._password}`);
    const headers = new Headers();
    headers.set('Authorization', `Basic ${pass}`);

    // Retrieve last data file
    const res = await fetch(`${APP_ENV_API_PATH}/admin/data-sheets/current`, {
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
    const objectUrl = URL.createObjectURL(blob);

    // return objectUrl and filename
    return { objectUrl, filename };
  }
}

export default AdminManager;
