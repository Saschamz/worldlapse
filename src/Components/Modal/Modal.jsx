import React from 'react';
import './Modal.css';

const Modal = props => (
  <div className="modal-container">
    <div className="modal">
      <h1>Worldlapse</h1>
      <div className="rows">
        <div className="row">
          <i className="fas fa-hand-point-up"></i>
          Rightclick anywhere to search for live feeds/timelapses from that country.
        </div>
        <div className="row">
          <i className="fas fa-sliders-h"></i>
          Use the toggle and slider in the bottom left corner to 
          instead search within a 1-250 kilometer radius.
        </div>
        <div className="row">
          <i className="fas fa-hand-point-up"></i>
          Keep rightclicking if you want to load more feeds.
        </div>
        <div className="row">
          <i className="fas fa-video"></i>
          When you're ready, leftclick on one of the markers to see what's going on.
        </div>
      </div>
      <button onClick={props.closeModal}>Got it!</button>
    </div>
  </div>
);

export default Modal;
