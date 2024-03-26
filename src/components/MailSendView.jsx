import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { selectedManager } = useContext(RootStore);
  if (!selectedManager.nbIutSelectionnesId) {
    window.location.replace('/');
  }
  return (
    <div className="grid h-screen">
      <h1 className="text-center text-xl">Courriel envoyé</h1>
      <p className="text-center">
        Votre courriel a bien été envoyé
        {selectedManager.nbIutSelectionnesId < 2 ? " à l'IUT sélectionné" : ` aux ${selectedManager.nbIutSelectionnesId} IUT sélectionnés`}
        .
      </p>
      <form method="GET">

        <div className="grid justify-center">
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/result">
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>Revenir au récapitulatif de vos choix</p>
          </Link>
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/">
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>Choisir d&apos;autres formations</p>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default observer(ModifyMailView);
