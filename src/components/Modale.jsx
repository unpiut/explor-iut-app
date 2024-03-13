import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RootStore from '../RootStore';
import InnerModale from './InnerModale';

function Modale({ iutId }) {
  const { iutManager } = useContext(RootStore);
  const iut = iutManager.iuts.find((i) => i.idIut === iutId);
  return (
    <div>
      <div className="grid gap-y-2 border-2 text-xs  border-blue-900">
        <h2 className="align-middle">{iut.site}</h2>
        <InnerModale iut={iut} />
      </div>
    </div>
  );
}
Modale.propTypes = ({
  iutId: PropTypes.string.isRequired,
});

export default Modale;
