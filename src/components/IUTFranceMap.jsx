/* eslint-disable no-console */

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import * as echarts from 'echarts';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import RootStore from '../RootStore';
import Modale from './Modale';
// import { findGeloloc } from '../../model/geolocService';

function iut2series(iuts, franceMap) {
  return iuts.filter((iut) => {
    if (!iut.location || (iut.location.x ?? false) === false) {
      // console.warn(`Missing location information for IUT ${iut.completeNom}`, iut);
      return false;
    }
    return true;
  }).map((iut) => ({
    name: iut.site ? `${iut.nom} - ${iut.site}` : iut.nom,
    value: franceMap.mapRegionPoint(iut.region, iut.location),
    iutId: iut.idIut,
  }));
}

function iutSelect2series(iutSelectionnes, franceMap) {
  return iutSelectionnes.filter((iut) => {
    if (!iut.location || (iut.location.x ?? false) === false) {
      // console.warn(`Missing location information for IUT ${iut.completeNom}`, iut);
      return false;
    }
    return true;
  }).map((iut) => ({
    name: iut.site ? `${iut.nom} - ${iut.site}` : iut.nom,
    value: franceMap.mapRegionPoint(iut.region, iut.location),
    iutId: iut.idIut,
  }));
}

function createInitalEchartOption(mapName, iuts, franceMap, iutSelectionnes, userCoors = null) {
  const userZoomInfo = { zoom: 1, center: null };
  if (userCoors) {
    console.log('Find region code for user');
    const userRegionCode = franceMap.locateRegionCodeForCoordinates(userCoors);
    if (!userRegionCode) {
      console.warn('No region code found for user');
    } else {
      const zoomInfo = franceMap.getCenterAndZoomRatioForRegionCode(userRegionCode);
      userZoomInfo.zoom = zoomInfo.zoomRatio;
      userZoomInfo.center = zoomInfo.correctedCenter;
    }
  }
  return {
    geo: { // Options d'un système de coordonnées géographique: https://echarts.apache.org/en/option.html#geo
      map: mapName, // Nom de la map enregistrée
      roam: false, // Autorise le déplacement et le zoom dans la carte avec de la souris*
      legend: false,
      itemStyle: { //
        areaColor: '#e7e8ea', // Couleur de base des zones (gris)
      },
      nameProperty: 'nom', // Nom de la propriété utilisé dans les données de carte pour le nom des zones
      zoom: userZoomInfo.zoom,
      center: userZoomInfo.center,
      emphasis: {
        label: {
          show: false,
        },
        itemStyle: {
          areaColor: '#e7e8ea',
          borderWidth: 1,
        },
      },
    },
    tooltip: {
      show: false,
    },
    graphic: {
      id: 'selectedRect',
      color: 'red',
      type: 'rect',
      draggable: 'false',
      cursor: 'pointer',
      z: 100,
    },
    // legend: {}, par de lédende pour cette visualisation
    series: [
      {
        id: 'iut',
        name: 'IUT',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        color: 'blue',
        symbolSize: 10,
        showEffectOn: 'emphasis', // configure quand activer l'effet (ici l'effet "scatter") des symbole, ici lorsque la souris est dessus
        tooltip: { // propriété des tooltip
          formatter: ({ data }) => data.name,
          show: true,
        },
        rippleEffect: { // Configuration de l'effet
          brushType: 'stroke',
          scale: 2.5,
        },
        data: iut2series(iuts, franceMap),
      },
      {
        id: 'selectedIut',
        name: 'IUT',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbol: 'rect',
        color: 'red',
        symbolSize: 12,
        showEffectOn: 'emphasis', // configure quand activer l'effet (ici l'effet "scatter") des symbole, ici lorsque la souris est dessus
        tooltip: { // propriété des tooltip
          formatter: ({ data }) => data.name,
          show: true,
        },
        rippleEffect: { // Configuration de l'effet
          brushType: 'stroke',
          scale: 2.5,
        },
        data: iutSelect2series(iuts, franceMap),
      },
    ],
  };
}

function createDataOnlyOption(iuts, franceMap, iutSelectionnes) {
  return {
    series: [
      {
        id: 'iut',
        data: iut2series(iuts, franceMap),
      },
      {
        id: 'selectedIut',
        data: iut2series(iutSelectionnes, franceMap),
      },
    ],
  };
}

function IUTFranceMap({ className }) {
  const { franceMap, iutManager, selectedManager } = useContext(RootStore);
  const [echartState, setEchartState] = useState(null);
  const [afficheModale, setAfficheModale] = useState(false);
  const [modale, setModale] = useState(null);
  const refContainer = useRef();
  const position = useRef({ x: null, y: null, enAction: false });

  console.log('IUTFranceMap: redraw');

  // Initial Map créator
  useEffect(() => {
    if (refContainer.current && !echartState) {
      console.log('CREATE IUTFranceMap chart');
      console.log(refContainer.current);
      const theChart = echarts.init(refContainer.current);

      theChart.showLoading();

      theChart.on('click', 'geo', () => setAfficheModale(false)); // Evenement permettant de quitter la modale si on clique sur la carte
      document.addEventListener('keydown', (event) => { // Evenement permettant de quitter la modale avec Echap
        if (event.code === 'Backspace') {
          setAfficheModale(false);
        } else if (event.code === 'ControlLeft') {
          theChart.setOption({ geo: { roam: true } });
        }
      });

      document.addEventListener('keyup', (evt) => {
        if (evt.code === 'ControlLeft') {
          theChart.setOption({ geo: { roam: false } });
        }
      });

      theChart.on('click', { seriesId: 'iut' }, (event) => { // Création de la modale sur un IUT
        setAfficheModale(true);
        setModale(<Modale
          iutId={event.data.iutId}
          onClose={() => setAfficheModale(false)}
          X={event.event.event.pageX}
          Y={event.event.event.pageY}
        />);
      });

      theChart.on('click', { seriesId: 'selectedIut' }, (event) => { // Création de la modale sur un IUT déjà sélectionné
        setAfficheModale(true);
        setModale(<Modale
          iutId={event.data.iutId}
          onClose={() => setAfficheModale(false)}
          X={event.event.event.pageX}
          Y={event.event.event.pageY}
        />);
      });

      document.addEventListener('mousedown', (evt) => { // Récupération des valeurs du départ du rectangle de sélection
        position.current = { x: evt.offsetX, y: evt.offsetY, enAction: true };
      });

      document.addEventListener('mousemove', (evt) => { // Dessin du rectangle de sélection avec la position actuelle de la souris
        if (position.current.enAction) {
          theChart.setOption({
            graphic: {
              id: 'selectedRect',
              shape: {
                x: position.current.x < evt.offsetX ? position.current.x : evt.offsetX,
                y: position.current.y < evt.offsetY ? position.current.y : evt.offsetY,
                width: position.current.x < evt.offsetX
                  ? evt.offsetX - position.current.x
                  : position.current.x - evt.offsetX,
                height: position.current.y < evt.offsetY
                  ? evt.offsetY - position.current.y
                  : position.current.y - evt.offsetY,
              },
            },
          });
        }
      });

      document.addEventListener('mouseup', () => { // Suppression du rectangle et récupération des IUT présents dans la zone
        theChart.setOption({
          graphic: {
            id: 'selectedRect',
            shape: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
            },
          },
        });
        position.current = { x: null, y: null, enAction: false };
      });

      // Récupération des données de la france uniquement
      franceMap.load()
        .then(() => {
        // Création des options initiale avec la carte de france et un tableau d'IUTs vide
          theChart.hideLoading();
          theChart.setOption(createInitalEchartOption(franceMap.mapName, [], franceMap));
          // mise en place du state
          // A pour effet de déclencher un useEffect suivant
          setEchartState(theChart);
        });
    }
  }, [refContainer.current]); // Le useEffect sera rappelé si la réf dom de la carte change

  useEffect(() => autorun(() => {
    // Mise à jour de la carte uniquement si la carte a bien été crée et si l'on a des iuts
    if (echartState && iutManager.nbIuts) {
      console.log('re-set data');
      // choix des iuts : ceux selectionnés si l'on a une selection sinon tous les iuts
      const iuts = iutManager.iutRecherchesTab.length
        ? iutManager.iutRecherchesTab
        : iutManager.iuts;
      echartState.setOption(
        createDataOnlyOption(iuts, franceMap, selectedManager.iutSelectionnesTab),
      );
    }
  }), [echartState, iutManager]);

  return (
    <div>
      <div className="grid justify-center">
        <div className="grid justify-center max-w-lg">
          {afficheModale ? modale : null}
        </div>
      </div>
      <div className={classNames(className, 'w-full', 'h-96')} ref={refContainer} />
    </div>
  );
}

IUTFranceMap.propTypes = {
  className: PropTypes.string,
};

IUTFranceMap.defaultProps = {
  className: '',
};
export default observer(IUTFranceMap);
