import React, { Component } from 'react';
import '../css/toolbar.css';
import logo  from '../trend-big.png';

class Toolbar extends Component {
  render() {
    return (
      <div className="Toolbar">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href=" ">
                <img src={logo} width="50" height="50" className="d-inline-block align-middle" alt=""/>
                Trends vs. Stocks
            </a>
        </nav>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">

            </div>
        </div>
        </nav>
      </div>
    );
  }
}

export default Toolbar;