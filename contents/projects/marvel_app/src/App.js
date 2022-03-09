
import React from 'react';
import axios from 'axios';
import CharacterList from './components/CharacterList';
import './App.scss'
import apikey from './apikey';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { charaters: [], offset: 0 }
  }

  async getCharacters() {
    const response = await axios.get('https://gateway.marvel.com:443/v1/public/characters', {
      params: {
        offset: this.state.offset,
        limit: 30,
        apikey: apikey
      }
    });

    this.setState({ charaters: [...response.data.data.results], offset: this.state.offset += 30 });
    console.log(this.state.charaters)
  }

  async componentDidMount() {
    this.getCharacters()
    var that = this;
    // Scroll Bottom Detection
    window.onscroll = async function (ev) {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        that.getCharacters();
        window.scrollTo(0, 0);
      }
    };
  }

  render() {
    return (
      <div className='Center'>
        <CharacterList charaters={this.state.charaters} />
      </div>
    );
  }
}

export default App;