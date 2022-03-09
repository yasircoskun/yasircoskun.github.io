import React from 'react';
import axios from 'axios';
import ScrollList from './ScrollList';
import apikey from '../apikey';

class TabLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] }
  }

  async getDataFromUrl(apiUrl) {
    const response = await axios.get(apiUrl, {
      params: {
        apikey: apikey
      }
    });

    this.setState({ data: [...response.data.data.results] });
    return [...response.data.data.results];
  }

  ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  async componentDidMount() {
    Object.keys(this.props.data).forEach(async (key) => {
      if (typeof this.props.data[key]['collectionURI'] !== "undefined") {
        let newState = {};
        this.getDataFromUrl(this.props.data[key]['collectionURI'])
          .then((res) => {
            newState[this.ucFirst(key)] = res;
            this.setState(newState)
          })


      }
    })
  }

  render() {
    return (
      <>
        <div className='Tab' id='General'>
          <ScrollList
            id={'ScrollList_' + this.props.characterID}
            characterID={this.props.characterID}
            type={"General"}
            data={[this.props.data]}
          ></ScrollList>
        </div>
        {
          Object.keys(this.props.data).map((key) => {
            if (typeof this.props.data[key]['collectionURI'] !== "undefined") {
              return (
                <div className='Tab' id={this.ucFirst(key)}>
                  <ScrollList
                    id={'ScrollList_' + this.props.characterID}
                    characterID={this.props.characterID}
                    type={this.ucFirst(key)}
                    data={this.state[this.ucFirst(key)]}
                  ></ScrollList>
                </div>
              );
            }

            return (<></>)
          })
        }</>
    )
  }
}

export default TabLoader;
