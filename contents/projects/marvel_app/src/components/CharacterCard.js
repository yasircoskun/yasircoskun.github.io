import React from 'react';
import TabLoader from './TabLoader';

class CharacterCard extends React.Component {
  async componentDidMount() {
    document.querySelectorAll('#CharacterCard_' + this.props.characterID + ' .TabHeader li').forEach(elem => {
      elem.onclick = (e) => {
        e.target.className = 'active';
        console.log(this.props.characterID);
        document.querySelector('#CharacterCard_' + this.props.characterID + ' #' + e.target.innerText).style.display = 'flex';
        document.querySelectorAll('#CharacterCard_' + this.props.characterID + ' .TabHeader li').forEach(sibling => {
          if (sibling !== e.target) {
            sibling.className = '';
            document.querySelector('#CharacterCard_' + this.props.characterID + ' #' + sibling.innerText).style.display = 'none';
          }
        })
      }
    })
  }

  ucFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render() {
    return (
      <div id={'CharacterCard_' + this.props.characterID} className="CharacterCard">
        <div className='TabArea' key={'TabArea_' + this.props.characterID}>
          <ul className='TabHeader'>
            <li className='active'>General</li>
            {Object.keys(this.props.data).map((key) => {
              if (typeof this.props.data[key]['collectionURI'] !== "undefined") {
                return (<li>{this.ucFirst(key)}</li>);
              }
              return false;
            })}
          </ul>
          <div className='TabBody'>
            <TabLoader
              characterID={this.props.characterID}
              data={this.props.data}
            ></TabLoader>
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterCard;
