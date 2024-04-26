import { makeAutoObservable, runInAction } from 'mobx';
import * as echarts from 'echarts/core';

const REMAPING_TOM = {
  Guyane: {
    left: -7.834939110760255,
    top: 48.1885808164957,
    width: 1,
  },
  Guadeloupe: {
    left: -7.834939110760255,
    top: 46,
    width: 2,
  },
  Martinique: {
    left: -7.834939110760255,
    top: 44,
    width: 1,
  },
  Mayotte: {
    left: -7.834939110760255,
    top: 42,
    width: 1,
  },
  'La R\u00e9union': {
    left: -7.834939110760255,
    top: 40,
    width: 1,
  },
};

const ID_BY_CODE_REGION = {
  GUYANE: 'Guyane',
  GUADELOUPE: 'Guadeloupe',
  MARTINIQUE: 'Martinique',
  'NOUVELLE-CALEDONIE': 'Mayotte',
  'LA REUNION': 'La R\u00e9union',
};

function recursiveCoorFlatMap(coors) {
  if (Array.isArray(coors[0])) {
    return coors.flatMap((coor) => recursiveCoorFlatMap(coor));
  }
  return [coors];
}

function buildTopLeftPointByRegion(geoJson) {
  return geoJson.features
    .filter((feature) => feature?.properties?.nom && feature?.geometry?.coordinates)
    .map((feature) => [
      feature.properties.nom,
      feature.geometry.coordinates
        .flatMap((c) => recursiveCoorFlatMap(c))
        .reduce((acc, [long, lat]) => {
          if (lat < acc.minLat) {
            acc.minLat = lat;
          }
          if (lat > acc.maxLat) {
            acc.maxLat = lat;
          }
          if (long < acc.minLong) {
            acc.minLong = long;
          }
          if (long > acc.maxLong) {
            acc.maxLong = long;
          }
          return acc;
        }, {
          minLat: Infinity, maxLat: -Infinity, minLong: Infinity, maxLong: -Infinity,
        }),
    ])
    .reduce((acc, [regionCode, {
      minLat, maxLat, minLong, maxLong,
    }]) => {
      acc[regionCode] = {
        top: minLat,
        height: maxLat - minLat,
        left: minLong,
        width: maxLong - minLong,
      };
      return acc;
    }, {});
}

function computeRegionCenterAndScalingZoom(topLeftPointByRegion) {
  let minCorrectedLeft = Infinity;
  let maxCorrectedRight = -Infinity;
  let minCorrectedTop = Infinity;
  let maxCorrectedBottom = -Infinity;
  const centerAndScaleByRegionCode = Object.entries(topLeftPointByRegion)
    .map(([regionCode, {
      top, height, left, width,
    }]) => {
      const center = [left + width / 2, top + height / 2];
      let correctedCenter = center;
      let correctedLeft = left;
      let correctedRight = left + width;
      let correctedTop = top;
      let correctedBottom = top + height;
      const remappingInfo = REMAPING_TOM[regionCode];
      if (remappingInfo) {
        correctedCenter = [remappingInfo.left + remappingInfo.width / 2,
          remappingInfo.top + (height * (remappingInfo.width / width)) / 2];
        correctedLeft = remappingInfo.left;
        correctedRight = remappingInfo.left + remappingInfo.width;
        correctedTop = remappingInfo.top;
        correctedBottom = remappingInfo.top + height * (remappingInfo.width / width);
      }
      minCorrectedLeft = Math.min(correctedLeft, minCorrectedLeft);
      maxCorrectedRight = Math.max(correctedRight, maxCorrectedRight);
      minCorrectedTop = Math.min(correctedTop, minCorrectedTop);
      maxCorrectedBottom = Math.max(correctedBottom, maxCorrectedBottom);
      return {
        regionCode,
        center,
        correctedCenter,
        correctedWidth: correctedRight - correctedLeft,
        correctedHeight: correctedBottom - correctedTop,
      };
    });
  const maxWidth = maxCorrectedRight - minCorrectedLeft;
  const maxHeight = maxCorrectedBottom - minCorrectedTop;
  return centerAndScaleByRegionCode.reduce((acc, {
    regionCode, center, correctedCenter, correctedWidth, correctedHeight,
  }) => {
    acc[regionCode] = {
      center,
      correctedCenter,
      zoomRatio: Math.min(maxWidth / correctedWidth, maxHeight / correctedHeight),
    };
    return acc;
  }, {});
}

export default class FranceMap {
  _errorManager = null;

  _mapName = 'France';

  _loading = false;

  _loaded = false;

  _franceMap;

  _topLeftPointByRegion;

  _regionCenterAndScalingZoom;

  constructor(errorManager) {
    makeAutoObservable(this, {
      _errorManager: false,
      _mapName: false,
      mapName: false,
      _topLeftPointByRegion: false,
      _regionCenterAndScalingZoom: false,
      remapRegionPoint: false,
      getCenterAndZoomRatioForRegionCode: false,
    });
    this._errorManager = errorManager;
  }

  get loading() {
    return this._loading;
  }

  get loaded() {
    return this._loaded;
  }

  get franceMap() {
    return this._franceMap;
  }

  get mapName() {
    return this._mapName;
  }

  async load(force = false) {
    if (this._loaded && !force) {
      return this._franceMap;
    }
    runInAction(() => {
      this._loading = true;
      this._loaded = false;
    });

    try {
      const jsonData = await import(/* webpackChunkName: "franceRegions" */ '../assets/franceRegions.geojson');
      const topLeftPointByRegion = buildTopLeftPointByRegion(jsonData.default);
      const regionCenterAndScalingZoom = computeRegionCenterAndScalingZoom(topLeftPointByRegion);
      runInAction(() => {
        this._franceMap = jsonData.default;
        this._topLeftPointByRegion = topLeftPointByRegion;
        this._regionCenterAndScalingZoom = regionCenterAndScalingZoom;
        this._loaded = true;
      });
      echarts.registerMap(this._mapName, this._franceMap, REMAPING_TOM);
      return this._franceMap;
    } catch (err) {
      // this._errorManager.handleError(err);
      console.warn(err);
      return null;
    } finally {
      runInAction(() => {
        this._loading = false;
      });
    }
  }

  mapRegionPoint(regionId, location) {
    // Check if regionId is known
    const regionCode = ID_BY_CODE_REGION[regionId];
    if (!regionCode) {
      return [location[0], location[1]];
    }
    // Retrieve remapping info for region and topLeftPoint
    if (!this._topLeftPointByRegion) {
      console.warn('TopLeftPointByRegion has not been initialized !');
      return [location[0], location[1]];
    }
    const remappingInfo = REMAPING_TOM[regionCode];
    const topLeftPoint = this._topLeftPointByRegion[regionCode];
    if (!remappingInfo || !topLeftPoint) {
      console.warn(`Missing remappingInfo or topLeftPoint for regionCode ${regionCode}`);
      return [location[0], location[1]];
    }
    // Compute top shift
    const ratio = remappingInfo.width / topLeftPoint.width;
    const newX = remappingInfo.top + (location[0] - topLeftPoint.top) * ratio;
    const newY = remappingInfo.left + (location[1] - topLeftPoint.left) * ratio;
    return [newX, newY];
  }

  getCenterAndZoomRatioForRegionCode(regionCode) {
    if (!this._regionCenterAndScalingZoom) {
      console.warn('RegionCenterAndScalingZoom has not been initialized !');
      return null;
    }
    return this._regionCenterAndScalingZoom[regionCode];
  }

  locateRegionCodeForCoordinates({ latidude, longitude }) {
    // Compute simple cartesian distance between point and region center
    // then find min
    if (!this._regionCenterAndScalingZoom) {
      console.warn('RegionCenterAndScalingZoom has not been initialized !');
      return null;
    }
    return Object.entries(this._regionCenterAndScalingZoom)
      .map(([regionCode, { center }]) => [
        regionCode,
        (center[0] - longitude) ** 2 + (center[1] - latidude) ** 2,
      ])
      .reduce(
        (acc, [regionCode, dst]) => (acc.dst > dst ? { regionCode, dst } : acc),
        { dst: Infinity, regionCode: null },
      )
      .regionCode;
  }
}
