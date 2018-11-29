import React, { Component } from 'react';
import './App.css';
import Toolbar from './components/toolbar.js'
import Graphs from './components/graphs.js'
import Footer from './components/footer.js'


class App extends Component {
  render() {
    return (
      <div className="App">
        <Toolbar/>
        <Graphs/>
        <Footer/>
      </div>
    );
  }
}

export default App;
