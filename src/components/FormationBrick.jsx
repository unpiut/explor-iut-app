/* eslint no-param-reassign: ["error", { "props": false }] */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import RootStore from '../RootStore';
import style from './CaseFormationjsx.css';

function FormationBrick({
  but, tabIndex, canOpen, isClose,
}) {
  const { t } = useTranslation();
  const [close, setClose] = useState(true);
  const { iutManager, selectedManager } = useContext(RootStore);
  function couleurBordure() {
    switch (but.universMetiers) {
      case "Métiers de l'informatique": return 'border-cyan-500';
      case 'Métiers Industriels : Prod-Maintenance, Qualité-R&D': return 'border-orange-600';
      case "Métiers support de l'Industriel": return 'border-lime-600';
      case 'Métiers du Social, Gestion, Commerce': return 'border-purple-800';
      default: return null;
    }
  }
  const styleBordure = couleurBordure();
  function couleurFond() {
    switch (but.universMetiers) {
      case "Métiers de l'informatique": return 'bg-cyan-500/90';
      case 'Métiers Industriels : Prod-Maintenance, Qualité-R&D': return 'bg-amber-transparent';
      case "Métiers support de l'Industriel": return 'bg-lime-transparent';
      case 'Métiers du Social, Gestion, Commerce': return 'bg-purple-transparent';
      default: return null;
    }
  }
  const styleFond = couleurFond();
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
    selectedManager.switchButSelectionnes(but);
    iutManager.switchIutRecherches(selectedManager.butSelectionnes);
    selectedManager.switchIutSelectionnesIdByBut();
    canOpen();
    setClose(true);
  }

  return (
    <div
      className={classNames('grid', 'items-center', {
        'aspect-square': !isClose,
        'col-span-1': !isClose,
        'col-span-2': isClose,
        'md:col-span-3': isClose,
        'lg:col-span-3': isClose,
        'xl:col-span-5': isClose,
      })}
      tabIndex={tabIndex}
    >
      {isClose
        ? (
          <div
            className={`grid gap-y-2 border-4 text-sm  ${styleBordure}`}
          >
            <button
              type="button"
              onClick={changement}
              className={`align-middle font-bold grid grid-cols-3 text-base text-center ${selectedManager.butSelectionnes.has(but) ? 'bg-red-700' : styleFond} border-blue-900`}
            >
              <div />
              <p className="text-slate-50">
                {selectedManager.butSelectionnes.has(but)
                  ? `${but.prettyPrintFiliere} ✅` : but.prettyPrintFiliere}
              </p>
              <p className="text-slate-50 justify-self-end pr-3">X</p>
            </button>

            <button className="m-2 text-base font-bold border-2 border-blue-900" onClick={selectionner} type="button">{!selectedManager.butSelectionnes.has(but) ? t('caseFormSelect') : t('caseFormDeselect')}</button>

            <div className="flex flex-wrap align-middle gap-2">
              <p className="align-middle">{t('caseFormTitre')}</p>
              <p className="font-bold text-base">

                {`${but.nom} (${but.code})`}
              </p>
            </div>
            <p className="font-bold">
              {t('caseFormDesc')}
            </p>
            <p>
              {but.description ? ` ${but.description}` : ''}
            </p>
            <div>
              <p className="font-bold">
                {t('caseFormSpe')}
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
              {t('caseFormDebouch')}
            </p>
            <p>
              {but.metiers ? ` ${but.metiers}` : ''}
            </p>

            <div className="flex flex-wrap justify-between p-2">
              <a className="underline font-bold text-base" target="_blank" href={but.urlFiche} rel="noreferrer">{t('caseFormIutfr')}</a>
              <a className="underline font-bold text-base" target="_blank" href={but.urlFranceCompetence} rel="noreferrer">{t('caseFormFrComp')}</a>
            </div>
          </div>
        )
        : (
          <button
            type="button"
            onClick={changement}
            className={`h-full max-w-full overflow-hidden break-words text-xs md:text-sm xl:text-base align-middle text-center leading-loose hover:bg-[length:130%] transition-all duration-300 bg-center border-4 ${maClasse} ${styleBordure} bg-contain`}
          >
            <h2 className={`text-white px-2 font-bold py-3 ${selectedManager.butSelectionnes.has(but) ? 'bg-red-transparent' : styleFond} w-full`}>
              {selectedManager.butSelectionnes.has(but)
                ? `${but.prettyPrintFiliere} ✅` : but.prettyPrintFiliere}
            </h2>
          </button>
        )}
    </div>
  );
}
FormationBrick.propTypes = ({
  but: MPropTypes.objectOrObservableObject.isRequired,
  tabIndex: PropTypes.number.isRequired,
  canOpen: PropTypes.func.isRequired,
  isClose: PropTypes.bool.isRequired,
});
export default observer(FormationBrick);
