import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import CaseFormation from './CaseFormation';
import RootStore from '../RootStore';
import Footer from './Footer';

function FormationView() {
  const { butManager } = useContext(RootStore);
  const [aJour, setAJour] = useState(false);
  const [buts, setButs] = useState([]);
  function filtrer() {
    const metier = document.getElementById('cherche').value;
    buts.map((but) => {
      if (!but.metiers.find((job) => job === metier)) {
        return setButs(buts.splice(but));
      } return buts;
    });
  }

  async function recupBut() {
    butManager.getAllBut().then((tousLesButs) => {
      setButs([...tousLesButs]);
      setAJour(true);
    });
  }

  if (!aJour) {
    recupBut();
  }

  return (
    <>
      <input className="input-barre" placeholder="Rechercher métier" type="text" id="cherche" />
      <button type="button" onClick={filtrer}>Valider</button>
      <div>
        {buts.map((but) => (
          <CaseFormation
            but={but}
            key={but.code}
          />
        ))}
      </div>
      <Footer droite={{ texte: 'Carte interactive', lien: 'map' }} />
    </>
  );
}

export default observer(FormationView);
