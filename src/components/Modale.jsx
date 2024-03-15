import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RootStore from '../RootStore';
import InnerModale from './InnerModale';

function Modale({ iutId, onClose }) {
  const { iutManager } = useContext(RootStore);
  const iut = iutManager.iuts.find((i) => i.idIut === iutId);
  return (
    <div className="px-10 grid justify-center gap-y-2 border-2 text-xs  border-blue-900">
      <div className="flex justify-between">
        <h2 className="align-middle">{iut.site}</h2>
        <button type="button" onClick={onClose}>X</button>
      </div>
      <InnerModale iut={iut} />
    </div>
  );
}
Modale.propTypes = ({
  iutId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
});

export default Modale;
