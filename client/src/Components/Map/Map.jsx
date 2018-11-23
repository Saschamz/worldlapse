import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import keys from '../../keys.js';
import axios from 'axios';
import './Map.css';
import Spinner from '../Spinner/Spinner';
import Settings from '../Settings/Settings';

const Mapbox = ReactMapboxGl({ accessToken: keys.mapboxToken });

class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      countryOffsets: {},
      settings: {
        searchMethod: 'global',
        range: 125
      },
      spinner: {
        loading: false,
        position: {
          x: null,
          y: null,
        }
      },
    };
    
    this.handleClick = this.handleClick.bind(this);
    this.toggleLocal = this.toggleLocal.bind(this);
    this.setRange = this.setRange.bind(this);
  }

  componentDidMount() {
    this.getCameras = axios.create({
      method: 'GET',
      baseURL: 'https://webcamstravel.p.mashape.com/webcams/list/',
      headers: {
        'X-Mashape-Key': keys.webcamsToken,
        'X-Mashape-Host': 'webcamstravel.p.mashape.com',
      },
    });
  }

  getOffsets(countryCode) {
    const { countryOffsets } = this.state;
    if (!countryOffsets[countryCode]) countryOffsets[countryCode] = 0;

    return countryOffsets;
  }

  requestWebcams(countryCode, limit = 50) {
    const countryOffsets = this.getOffsets(countryCode);

    this.getCameras(`limit=${limit},${countryOffsets[countryCode]}/country=${countryCode}&show=webcams:player,location`)
      .then(res => {
        countryOffsets[countryCode] += 50;
        const { webcams } = res.data.result;
        const spinner = this.spinnerObject(false);

        this.setState(prevState => ({...prevState, markers: [...prevState.markers, ...webcams], countryOffsets, spinner }));
      }); 
  }

  spinnerObject(loading, x, y) {
    const { spinner } = this.state;
    spinner.loading = loading;
    x && ( spinner.position.x = x );
    y && ( spinner.position.y = y );

    return spinner;
  }

  animateOverlay({ x, y }) {
    const el = this.refs.mapContainer;
    el.classList.add('overlay');
    const spinner = this.spinnerObject(true, x, y);

    this.setState(prevState => ({ ...prevState, spinner }));
    setTimeout(() => el.classList.remove('overlay'), 400);
  }
  
  handleClick(_, evt) {
    const { lng, lat } = evt.lngLat;
    const { x, y } = evt.point;
    const { searchMethod, range } = this.state.settings;

    this.animateOverlay({ x, y });

    if (searchMethod === 'global') {
      axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${keys.mapboxToken}&country`)
        .then(res => {
          if (res.data.features.length > 0) {
            const countryCode = res.data.features.filter(stat => stat.id.match(/country/))[0].properties.short_code;
            this.requestWebcams(countryCode);
          }        
          else {
            const spinner = this.spinnerObject(false);
            this.setState(prevState => ({ ...prevState, spinner }));
          }
        });
    } else {
      this.getCameras(`nearby=${lat},${lng},${range}&show=webcams:player,location`)
        .then(res => {
          const { webcams } = res.data.result;
          const spinner = this.spinnerObject(false);
          
          this.setState(prevState => ({...prevState, markers: [...prevState.markers, ...webcams], spinner }));
        }); 
    }
  }

  renderMarker({ location, player }) {
    const src = player.live.embed || player.day.embed;
    const { longitude, latitude, city, country } = location;

    return (
      <Feature 
        onClick={() => this.props.updateFeed({ src, city, country })} 
        coordinates={[longitude, latitude]}
        key={longitude + latitude} />
    );
  }

  toggleLocal(local) {
    const { settings } = this.state;
    settings.searchMethod = local ? 'local' : 'global';
    
    this.setState(prevState => ({ ...prevState, settings }));
  }
  
  setRange(range) {
    const { settings } = this.state;
    settings.range = range;

    this.setState(prevState => ({ ...prevState, settings }));
  }

  render() {
    const { markers } = this.state;
    const { loading } = this.state.spinner;
    const { openModal } = this.props;
    const toggled = this.state.settings.searchMethod === 'local';
    
    return (
      <div>
        { loading && <Spinner position={this.state.spinner.position} /> }
        <Settings 
          toggleLocal={this.toggleLocal} 
          setRange={this.setRange} 
          openModal={openModal}
          toggled={toggled} />
        <div className="map-container" ref="mapContainer">
          <Mapbox
            style='mapbox://styles/mapbox/streets-v8'
            className="map"
            onContextMenu={this.handleClick}>
            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "marker-15" }}>
              { markers.map(marker => this.renderMarker(marker)) }
            </Layer>
          </Mapbox>
        </div>
      </div>
    );
  }
}

export default Map;
