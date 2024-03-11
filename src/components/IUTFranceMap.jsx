/* eslint-disable no-console */

import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import classNames from 'classnames';
import * as echarts from 'echarts';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
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
    iut,
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
        symbol: 'pin',
        color: 'red',
        symbolSize: 15,
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

function IUTFranceMap({ className }) {
  const { franceMap, iutManager, butManager } = useContext(RootStore);
  const [echartState, setEchartState] = useState(null);
  const [modale, setModale] = useState(null);
  const refContainer = useRef();

  console.log('IUTFranceMap: redraw');

  // Initial Map créator
  useEffect(() => {
    if (refContainer.current && echartState === null) {
      console.log('CREATE IUTFranceMap chart');
      console.log(refContainer.current);
      const theChart = echarts.init(refContainer.current);

      theChart.on('click', { seriesId: 'iut' }, (event) => {
        setModale(<Modale iut={event.data.iut} />);
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

      theChart.showLoading();
      // findGeloloc()
      Promise.all([franceMap.load(), iutManager.load()])
        .then(([, iuts]) => {
          theChart.hideLoading();
          if (iuts) {
            theChart.setOption(createInitalEchartOption(
              franceMap.mapName,
              iuts,
              franceMap,
            ));
          }
        });

      setEchartState(theChart);
    }
  }, [refContainer.current]);

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
