/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import classNames from 'classnames';
import RootStore from '../RootStore';
import style from './CaseFormationjsx.css';

function CaseFormation({
  but, tabIndex, canOpen, isClose,
}) {
  const [close, setClose] = useState(true);
  const { iutManager, selectedManager } = useContext(RootStore);
  const maClasse = style[`bg-${but.code}`] ?? style['bg-DEFAULT']; // On charge la classe 'version js' de nom bg-codeBUT ou bg-DEFAULT si la classe précédente n'existe pas
  function changement() {
    but.getInfo();
    if (close) {
      canOpen();
      setClose(false);
    } else {
      canOpen();
      setClose(true);
    }
  }

  function selectionner() {
    selectedManager.switchButSelectionne(but);
    iutManager.switchIutRecherches(selectedManager.butSelectionnes);
  }

  return (
    <div
      className={classNames('grid', 'items-center', {
        'aspect-square': !isClose,
        'col-span-1': !isClose,
        'col-span-2': isClose,
        'md:col-span-3': isClose,
        'lg:col-span-4': isClose,
      })}
      tabIndex={tabIndex}
    >
      {isClose
        ? (
          <div
            className="grid gap-y-2 border-2 text-xs  border-blue-900"
          >
            <button
              type="button"
              onClick={changement}
              className={`align-middle font-bold grid grid-cols-3 text-base text-center ${selectedManager.butSelectionnes.has(but) ? 'bg-red-700' : 'bg-blue-900'} border-blue-900`}
            >
              <div />
              <p className="text-slate-50">{but.prettyPrintFiliere}</p>
              <p className="text-slate-50 justify-self-end pr-3">X</p>
            </button>
            <div className="flex flex-wrap align-middle gap-2">
              <p className="align-middle">Titre académique de la formation :</p>
              <p className="font-bold text-sm">

                {`${but.nom} (${but.code})`}
              </p>
            </div>
            <p className="font-bold">
              Description formation :
            </p>
            <p>
              {but.description ? ` ${but.description}` : ''}
            </p>
            <div>
              <p className="font-bold">
                Les spécialités :
              </p>
              {but.parcours.map((parcours) => (
                <p key={parcours[0]}>
                  {' '}
                  { parcours[1]}
                  {parcours !== but.parcours[but.parcours.length - 1] ? ',' : null}
                </p>
              ))}
            </div>
            <p className="font-bold">
              Débouchés métiers :
            </p>
            <p>
              {but.metiers ? ` ${but.metiers}` : ''}
            </p>

            <div className="flex flex-wrap justify-between p-2">
              <a className="underline" target="_blank" href={but.urlFiche} rel="noreferrer">en savoir plus avec iut.fr</a>
              <a className="underline" target="_blank" href={but.urlFranceCompetence} rel="noreferrer">en savoir plus avec France Compétence</a>
            </div>
            <button className="m-2 text-base font-bold border-2 border-blue-900" onClick={selectionner} type="button">{!selectedManager.butSelectionnes.has(but) ? 'selectionner cette formation' : 'deselectionner cette formation'}</button>
          </div>
        )
        : (
          <button
            type="button"
            onClick={changement}
            className={`h-full max-w-full overflow-hidden break-words text-xs md:text-base align-middle text-center leading-loose hover:bg-[length:130%] transition-all duration-300 bg-center border-2 border-blue-900 ${maClasse} bg-contain`}
          >
            <h2 className={`text-white px-2 font-bold py-3 ${selectedManager.butSelectionnes.has(but) ? 'bg-red-transparent' : 'bg-blue-transparent'} w-full`}>{but.prettyPrintFiliere}</h2>
          </button>
        )}
    </div>
  );
}
CaseFormation.propTypes = ({
  but: MPropTypes.objectOrObservableObject.isRequired,
  tabIndex: PropTypes.number.isRequired,
  canOpen: PropTypes.func.isRequired,
  isClose: PropTypes.bool.isRequired,
});
export default observer(CaseFormation);
