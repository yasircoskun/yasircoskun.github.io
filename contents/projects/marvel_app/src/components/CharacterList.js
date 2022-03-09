import React from 'react';
import CharacterCard from './CharacterCard';

class CharacterList extends React.Component {
  render() {
    console.log(this.props.charaters);
    if (this.props.charaters.length > 0) {
      return (
        <div className='CharacterList'>
          {this.props.charaters.map(charater => {
            return (
              <CharacterCard
                key={charater.id}
                name={charater.name}
                characterID={charater.id}
                image_path={charater.thumbnail.path + "/portrait_incredible." + charater.thumbnail.extension}
                data={charater}
              ></CharacterCard>
            );
          })}
        </div>
      );
    }
    return <div>Not Character to show</div>;
  }
}

export default CharacterList;