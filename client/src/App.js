import React, { Component } from 'react';
import './App.css';

import Map from './Components/Map/Map';
import Feed from './Components/Feed/Feed';
import Modal from './Components/Modal/Modal';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      renderFeed: false,
      feedData: null,
      showModal: false,
    };

    this.updateFeed = this.updateFeed.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }
  
  componentDidMount() {
    if (!localStorage.getItem('modal')) {
      this.setState(prevState => ({ ...prevState, showModal: true }));
      localStorage.setItem('modal', 'seen');
    }
  }

  updateFeed({ src, city, country }) {
    this.setState(prevState => ({ ...prevState, renderFeed: true, feedData: { src, city, country } }));
  }

  toggleModal() {
    this.setState(prevState => ({ ...prevState, showModal: !prevState.showModal })); 
  }

  render() {
    const { renderFeed, feedData, showModal } = this.state;

    return (
      <div className="App">
        { showModal && <Modal closeModal={this.toggleModal} /> }
        { renderFeed && <Feed data={feedData} /> }
        <Map updateFeed={this.updateFeed} openModal={this.toggleModal}/>
      </div>
    );
  }
}

export default App;
