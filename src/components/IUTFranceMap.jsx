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
    name: iut.site,
    value: franceMap.mapRegionPoint(iut.region, iut.location),
    iutId: iut.idIut,
  }));
}

function createInitalEchartOption(mapName, iuts, franceMap, userCoors = null) {
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
      roam: true, // Autorise le déplacement et le zoom dans la carte avec de la souris
      itemStyle: { //
        areaColor: '#e7e8ea', // Couleur de base des zones (gris)
      },
      nameProperty: 'nom', // Nom de la propriété utilisé dans les données de carte pour le nom des zones
      zoom: userZoomInfo.zoom,
      center: userZoomInfo.center,
    },
    tooltip: { // propriété des tooltip
      formatter: ({ data }) => data.name,
    },
    // legend: {}, par de lédende pour cette visualisation
    series: [
      {
        id: 'iut',
        name: 'IUT',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        color: 'red',
        symbolSize: 10,
        showEffectOn: 'emphasis', // configure quand activer l'effet (ici l'effet "scatter") des symbole, ici lorsque la souris est dessus
        rippleEffect: { // Configuration de l'effet
          brushType: 'stroke',
          scale: 2.5,
        },
        data: iut2series(iuts, franceMap),
      },
    ],
  };
}

function createDataOnlyOption(iuts, franceMap) {
  return {
    series: [
      {
        id: 'iut',
        data: iut2series(iuts, franceMap),
      },
    ],
  };
}

function IUTFranceMap({ className }) {
  const { franceMap, iutManager } = useContext(RootStore);
  const [echartState, setEchartState] = useState(null);
  const [modale, setModale] = useState(null);
  const refContainer = useRef();

  console.log('IUTFranceMap: redraw');

  // Initial Map créator
  useEffect(() => {
    if (refContainer.current && !echartState) {
      console.log('CREATE IUTFranceMap chart');
      console.log(refContainer.current);
      const theChart = echarts.init(refContainer.current);

      theChart.showLoading();

      theChart.on('click', { seriesId: 'iut' }, (event) => {
        setModale(<Modale iutId={event.data.iutId} />);
      });

      theChart.on('click', 'geo', (event) => {
        const currentZoom = theChart.getOption().geo[0]?.zoom;
        if (currentZoom > 1) {
          theChart.setOption({
            geo: {
              center: null,
              zoom: 1,
            },
          });
        } else {
          const zoomInfo = franceMap.getCenterAndZoomRatioForRegionCode(event.name);
          if (zoomInfo) {
            theChart.setOption({
              geo: {
                center: zoomInfo.correctedCenter,
                zoom: zoomInfo.zoomRatio,
              },
            });
          }
        }
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
      console.log(iutManager.iutRecherchesTab);
      // choix des iuts : ceux selectionnés si l'on a une selection sinon tous les iuts
      const iuts = iutManager.iutRecherchesTab.length
        ? iutManager.iutRecherchesTab
        : iutManager.iuts;
      echartState.setOption(createDataOnlyOption(iuts, franceMap));
    }
  }), [echartState, iutManager]);

  return (
    <div>
      {modale}
      <div className={classNames(className, 'w-full', 'h-96')} ref={refContainer} />
    </div>
  );
}
IUTFranceMap.propTypes = ({
  className: PropTypes.string.isRequired,
});

export default observer(IUTFranceMap);
