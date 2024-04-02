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

function symbolDept(dept) {
  if (dept === 0) {
    return 'rect';
  } if (dept === 1) {
    return 'circle';
  }
  return 'triangle';
}

function iut2series(iuts, franceMap, iutSelectionnes = null, butsRecherches = null) {
  let butsCodeRecherche = [];
  const data = [];
  const edges = [];
  if (butsRecherches) {
    butsCodeRecherche = butsRecherches.map((b) => b.code);
  }
  iuts.filter((iut) => {
    if (!iut.location || (iut.location.x ?? false) === false) {
      // console.warn(`Missing location information for IUT ${iut.completeNom}`, iut);
      return false;
    }
    return true;
  }).flatMap((iut) => {
    if (butsRecherches) {
      const selectionne = iutSelectionnes.some((i) => i === iut);
      return iut.departements.filter(
        (dep) => butsCodeRecherche.some((code) => code === dep.codesButDispenses[0]),
      ).map((d, index) => {
        if (index === 0) {
          data.push({
            id: iut.site ? `${iut.nom} - ${iut.site}` : `${iut.nom}`,
            name: iut.site ? `${iut.nom} - ${iut.site}` : `${iut.nom}`,
            fixed: true,
            value: franceMap.mapRegionPoint(iut.region, iut.location),
            iutId: iut.idIut,
            itemStyle: { color: selectionne ? 'red' : 'blue' },
            symbol: symbolDept(butsCodeRecherche.findIndex((b) => b === d.codesButDispenses[0])),
          });
        } else {
          data.push({
            id: iut.site ? `${iut.nom} - ${iut.site} - ${d.code}` : `${iut.nom} - ${d.code}`,
            name: iut.site ? `${iut.nom} - ${iut.site} - ${d.code}` : `${iut.nom} - ${d.code}`,
            value: franceMap.mapRegionPoint(iut.region, iut.location),
            iutId: iut.idIut,
            itemStyle: { color: selectionne ? 'red' : 'blue' },
            symbol: symbolDept(butsCodeRecherche.findIndex((b) => b === d.codesButDispenses[0])),
          });
          edges.push({
            source: iut.site ? `${iut.nom} - ${iut.site}` : `${iut.nom}`,
            target: iut.site ? `${iut.nom} - ${iut.site} - ${d.code}` : `${iut.nom} - ${d.code}`,
          });
        }
        return [data, edges];
      });
    }
    data.push({
      id: iut.site ? `${iut.nom} - ${iut.site}` : iut.nom,
      name: iut.site ? `${iut.nom} - ${iut.site}` : iut.nom,
      value: franceMap.mapRegionPoint(iut.region, iut.location),
      iutId: iut.idIut,
      color: 'blue',
      symbol: 'circle',
    });
    return [data, edges];
  });
  return [data, edges];
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
      console.log(zoomInfo);
      userZoomInfo.zoom = zoomInfo.zoomRatio;
      userZoomInfo.center = zoomInfo.correctedCenter;
    }
  }
  const [lesDatas, edges] = iut2series(iuts, franceMap);
  return {
    geo: { // Options d'un système de coordonnées géographique: https://echarts.apache.org/en/option.html#geo
      map: mapName, // Nom de la map enregistrée
      roam: true, // Autorise le déplacement et le zoom dans la carte avec de la souris*
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
      type: 'rect',
      draggable: 'false',
      cursor: 'pointer',
      z: 100,
      style: {
        fill: '#1028A7',
        opacity: 0.2,
      },
    },
    animationDuration: 2000,
    // legend: {}, par de lédende pour cette visualisation
    series: [
      {
        id: 'iut',
        name: 'IUT',
        type: 'graph',
        coordinateSystem: 'geo',
        force: {
          repulsion: 100,
          edgeLength: 5,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
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
        data: lesDatas,
        edges,
      },
    ],
  };
}

function createDataOnlyOption(iuts, franceMap, iutSelectionnes, butsRecherches) {
  const [data, edges] = iut2series(iuts, franceMap, iutSelectionnes, butsRecherches);
  return {
    series: [
      {
        id: 'iut',
        data,
        edges,
      },
    ],
  };
}

function zoomGeoLoc({ latitude, longitude }) {
  return {
    geo: {
      zoom: 5,
      center: [longitude, latitude],
    },
  };
}

function IUTFranceMap({ className }) {
  const {
    franceMap, iutManager, selectedManager,
  } = useContext(RootStore);
  const [echartState, setEchartState] = useState(null);
  const [afficheModale, setAfficheModale] = useState(false);
  const [modale, setModale] = useState(null);
  const refContainer = useRef();
  const geoLocal = useRef({ latitude: null, longitude: null });
  const position = useRef({
    initialX: null, x: null, width: null, initialY: null, y: null, height: null, enAction: false,
  });
  const enDeplacement = useRef(false);

  console.log('IUTFranceMap: redraw');

  // Initial Map créator
  useEffect(() => {
    if (refContainer.current && !echartState) {
      console.log('CREATE IUTFranceMap chart');
      const theChart = echarts.init(refContainer.current);

      theChart.showLoading();

      theChart.on('click', 'geo', () => setAfficheModale(false)); // Evenement permettant de quitter la modale si on clique sur la carte
      document.addEventListener('keydown', (event) => { // Evenement permettant de quitter la modale avec Echap
        if (event.code === 'Backspace') {
          setAfficheModale(false);
        } else if (event.code === 'ControlLeft' && !enDeplacement.current) {
          theChart.setOption({ geo: { roam: false } });
          enDeplacement.current = true;
        }
      });

      document.addEventListener('keyup', (evt) => {
        if (evt.code === 'ControlLeft') {
          theChart.setOption({ geo: { roam: true } });

          enDeplacement.current = false;
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

      theChart.on('mousedown', 'geo', (evt) => { // Récupération des valeurs du départ du rectangle de sélection
        position.current = {
          initialX: evt.event.offsetX,
          initialY: evt.event.offsetY,
          enAction: true,
        };
      });

      document.addEventListener('mousemove', (evt) => { // Dessin du rectangle de sélection avec la position actuelle de la souris
        if (position.current.enAction) {
          if (!(position.current.initialX < evt.offsetX)) {
            position.current.x = evt.offsetX;
            position.current.width = position.current.initialX - evt.offsetX;
          } else {
            position.current.x = position.current.initialX;
            position.current.width = evt.offsetX - position.current.initialX;
          }

          if (!(position.current.initialY < evt.offsetY)) {
            position.current.y = evt.offsetY;
            position.current.height = position.current.initialY - evt.offsetY;
          } else {
            position.current.y = position.current.initialY;
            position.current.height = evt.offsetY - position.current.initialY;
          }

          theChart.setOption({
            graphic: {
              id: 'selectedRect',
              shape: {
                x: position.current.x,
                y: position.current.y,
                width: position.current.width,
                height: position.current.height,
              },
            },
          });
        }
      });

      document.addEventListener('mouseup', () => { // Suppression du rectangle et récupération des IUT présents dans la zone
        const iutIdSelect = [];
        if (position.current.enAction) {
          const iutChart = theChart.getOption().series[0].data;
          console.log(iutChart);
          console.log(theChart.getOption());
          iutChart.filter((i) => {
            if (i.value) {
              const positionI = theChart.convertToPixel('geo', i.value);
              return position.current.x < positionI[0]
              && positionI[0] < position.current.width + position.current.x
              && positionI[1] < position.current.height + position.current.y
              && position.current.y < positionI[1];
            }
            return false;
          }).map((i) => {
            if (!iutIdSelect.some((iutId) => iutId === i.iutId)) {
              iutIdSelect.push(i.iutId);
              selectedManager.switchIutSelectionnes(iutManager.getIutById(i.iutId));
            }
            return i;
          });

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
          position.current = {
            x: null, width: null, y: null, height: null, enAction: false,
          };
        }
      });

      // Récupération des données de la france uniquement
      Promise.all([franceMap.load(),
        navigator.geolocation.getCurrentPosition((geoPosition) => {
          geoLocal.current.latitude = geoPosition.coords.latitude;
          geoLocal.current.longitude = geoPosition.coords.longitude;
        })])
        .then(() => {
          // Création des options initiale avec la carte de france et un tableau d'IUTs vide
          theChart.hideLoading();
          theChart.setOption(
            createInitalEchartOption(
              franceMap.mapName,
              [],
              franceMap,
              geoLocal.current,
            ),

          );
          if (!(geoLocal.current.latitude === null && geoLocal.current.longitude === null)) {
            setTimeout(() => {
              theChart.setOption(zoomGeoLoc(geoLocal.current));
              setEchartState(theChart);
            }, 600);
          }
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
      echartState.setOption(
        createDataOnlyOption(
          iutManager.iutRecherchesTab,
          franceMap,
          selectedManager.iutSelectionnesTab,
          selectedManager.butSelectionnesTab,
        ),
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
