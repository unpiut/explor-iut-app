import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import CaseFormation from './CaseFormation';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function FormationView() {
  const { butManager } = useContext(RootStore);
  const { buts } = butManager;
  function filtrer() {
    const metier = document.getElementById('cherche').value;
    // très mauvais, mais je ne corrige pas, je pense que c'est du code en cours
    buts.map((but) => {
      if (but.code !== metier) {
        buts.splice(but);
      }
    });
  }

  function couleur(index) {
    if (index % 2 === 0) {
      return 'bg-blue-900 text-slate-50';
    }
    return 'bg-slate-50 text-blue-900 border-2 border-blue-900';
  }

  return (
    <>
      <div className="mb-4">
        <div className="border border-blue-900 flex">
          <input className="input-barre w-full" placeholder="Rechercher métier" type="text" id="cherche" />
          <button type="button" className="p-2" onClick={filtrer}>Valider</button>
        </div>
        <p className="text-end mr-2">
          {buts.length}
          {' '}
          formations liées à la recherche
        </p>
      </div>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 px-3 pb-20">
        {buts.map((but, index) => (
          <CaseFormation
            key={but.code}
            className={couleur(index)}
            but={but}
            butManager={butManager}
          />
        ))}
      </div>
      <div className="items-center fixed flex  justify-between bottom-0 right-0 left-0 bg-slate-50">
        <p className="pl-2">
          {butManager.nbButSelectionnes}
          {' '}
          Formations sélectionnées
        </p>
        <div className="ring rounded ring-blue-900 m-4 items-center flex justify-self-end h-3/5">
          <a className="font-bold" href="/map">Carte interactive</a>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
        </div>
      </div>
    </>
  );
}

export default observer(FormationView);
