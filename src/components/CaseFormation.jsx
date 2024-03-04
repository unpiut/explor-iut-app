import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import RootStore from '../RootStore';
import ButManager from '../model/ButManager';

function CaseFormation({ but }) {
  const [etat, setEtat] = useState(false);
  const [selection, setSelection] = useState(false);
  const store = useContext(RootStore);
  const {
    filiere, code,
  } = but;
  function changement() {
    setEtat(!etat);
  }

  function selectionner() {
    if (!store.butConserve) {
      store.butConserve = new ButManager();
    }
    if (!selection) {
      store.butConserve.addBut(code);
    } else {
      store.butConserve.removeBut(code);
    }
    setSelection(!selection);
  }

  return (
    <div role="button" onClick={changement} onKeyDown={changement} tabIndex={0}>
      {etat
        ? (
          <>
            <h2>{filiere}</h2>
            {/* <p>
              Description formation :
              {description}
            </p>
            <p>
              Débouchés métiers :
              {metiers}
            </p>
            <p>
              Nom de la formation :
              {nom}
            </p> */}
            <div>
              {/* <a target="_blank" href={url}>en savoir plus</a> */}
              <button onClick={selectionner} type="button">{!selection ? 'selectionner' : 'deselectionner'}</button>
            </div>
          </>
        )
        : <h2>{filiere}</h2>}
    </div>
  );
}
CaseFormation.propTypes = {
  but: PropTypes.shape({
    filiere: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    // metiers: PropTypes.arrayOf(PropTypes.string),
    // url: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    // nom: PropTypes.string.isRequired,
  }).isRequired,

};
export default CaseFormation;
