import { result_item } from './templates.js';

const marker_style = new ol.style.Style({
  image: new ol.style.Icon({
    anchor: [0.5, 1],
    src: 'pin.png'
  })
})

const marker_source =  new ol.source.Vector();

const marker_layer = new ol.layer.Vector({
  source: marker_source,
  visible: true,
  style: marker_style
})

const overlay_container = document.getElementById('ol-popup');
const overlay_content = document.getElementById('popup-content');
const overlay_closer = document.getElementById('popup-closer');

const overlay = new ol.Overlay({
  element: overlay_container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  },
  offset: [-5, -40]
});

overlay_closer.onclick = function() {
  overlay.setPosition(undefined);
  overlay_closer.blur();
  return false;
};

const interact_hover = new ol.interaction.Select();
const showInfoWindow = (evt) => {
  if(evt.selected.length>0){
      const feature = evt.selected[0];
      const id = feature.getId();

      overlay_content.innerHTML = result_item.fill(feature.get('project'));
      overlay.setPosition(feature.getGeometry().getCoordinates());
      map.getView().fit(overlay.getExtent(), map.getSize());
  } else {
    overlay.setPosition(undefined);
  }
}

// cache the results so we don't have to look them up every time
const geo_cache = {}

let map;

export const load_map = () => {
  const map_container = document.querySelector('#map');
  const main = document.querySelector('main');
  const main_h = main.clientHeight;
  const main_w = main.clientWidth;
  map_container.style.width = main_w - 80;
  map_container.style.height = main_h - 40;
  map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      marker_layer
    ],
    overlays: [overlay],
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [37.41, 8.82],
      zoom: 4,
      maxZoom: 8
    })
  });
  map.addInteraction(interact_hover);
  interact_hover.on('select', showInfoWindow);
  return map;
}

export const clear_markers = () => {
  marker_source.clear();
}

export const add_markers = (projects) => {
  projects.forEach(project => {
    const key = 'p'+project.id;
    if (geo_cache[key]) {
      const feature = new ol.Feature({
        type: 'marker',
        geometry: geo_cache[key],
        name: project.organization.name,
        project: project
      });
      feature.setStyle(marker_style);
      feature.setId(project.id);
      marker_source.addFeature(feature);
      map.getView().fit(marker_source.getExtent(), map.getSize());
    } else {
      const address = project.organization.city + ', ' + project.organization.state + ', ' + project.organization.country
      fetch('https://nominatim.openstreetmap.org/search?q=' + address + '&format=json&polygon=0&addressdetails=1', {
        method: 'POST'
      }).then(response => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      }).then(response_json => {
        if (response_json && response_json.length) {
          const coords = [response_json[0].lon, response_json[0].lat];
          geo_cache[key] = new ol.geom.Point(coords);
          const feature = new ol.Feature({
            type: 'marker',
            geometry: geo_cache[key],
            name: project.organization.name,
            project: project
          });
          feature.setStyle(marker_style);
          feature.setId(project.id);
          marker_source.addFeature(feature);
        }
        map.getView().fit(marker_source.getExtent(), map.getSize());
      }).catch(ex => {
        console.log('failed to geocode', ex);
      })
    }
  });
}