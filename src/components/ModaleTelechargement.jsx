import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import RootStore from '../RootStore';

function Modale({ onClose }) {
  const { selectedManager } = useContext(RootStore);

  return (
    <div className="absolute grid justify-center w-screen md:w-auto top-1/3 left-1/2">
      <div className="relative left-[-50%] bg-slate-50 z-10 border-2 text-xs md:text-base border-blue-900">
        <div className="p-4 bg-blue-900 flex gap-4 justify-between">
          <h2 className="text-slate-50 align-middle text-xl font-bold">Sélection du type de fichier téléchargé</h2>
          <button className="text-slate-50" type="button" onClick={onClose}>X</button>
        </div>
        <div className="p-4 flex text-xl justify-items-center justify-between flex-wrap">
          <button className="border-2 p-2 rounded-md border-blue-900" type="button" onClick={() => { selectedManager.telecharger('csv'); onClose(); }}>CSV</button>
          <button className="border-2 p-2 rounded-md border-blue-900" type="button" onClick={() => { selectedManager.telecharger('ods'); onClose(); }}>ODS</button>
          <button className="border-2 p-2 rounded-md border-blue-900" type="button" onClick={() => { selectedManager.telecharger('xlsx'); onClose(); }}>Excel</button>
        </div>
      </div>
    </div>
  );
}
Modale.propTypes = ({
  onClose: PropTypes.func.isRequired,
});
export default observer(Modale);
