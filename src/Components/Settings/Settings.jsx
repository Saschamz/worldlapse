import React, { Component } from 'react';
import './Settings.css';

class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      range: 125
    }
  }

  render() {
    const { toggleLocal, setRange, toggled, openModal } = this.props;
    const label = toggled ? 'Local' : 'Global';

    return (
      <div className="toggle">
        <div className="btn-info" onClick={() => openModal()}>
          <i className="fas fa-info-circle info"></i>
        </div>
        <div className="settings-container">
          { toggled && 
          <div className="range-container">
            <label className="label" htmlFor="range-slider">{this.state.range} km</label>
            <input 
              className="range-slider"
              id="range-slider"
              type="range" 
              min="1" 
              max="250"
              defaultValue="125"
              onChange={e => this.setState({ range: e.target.value })}
              onMouseUp={e => setRange(e.target.value)} />
          </div>
          }
          <label className="label" htmlFor="myonoffswitch">{label}</label>
          <div className="onoffswitch">
              <input 
                type="checkbox" 
                className="onoffswitch-checkbox" 
                name="onoffswitch" 
                onClick={e => toggleLocal(e.target.checked)}
                id="myonoffswitch" />
              <label className="onoffswitch-label" htmlFor="myonoffswitch">
                  <span className="onoffswitch-inner"></span>
                  <span className="onoffswitch-switch"></span>
              </label>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
