import React from 'react';

class Thumbnail extends React.Component {
  render() {
    if (this.props.data == null) {
      return (<></>)
    }
    return (
      <div className='Thumbnail'>
        <img src={this.props.data.path + "/portrait_incredible." + this.props.data.extension} alt="..."></img>
      </div>
    )
  }
}

export default Thumbnail;
