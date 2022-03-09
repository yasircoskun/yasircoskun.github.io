import React from 'react';

class StringResolver extends React.Component {
  render() {
    if (this.props.object == null) {
      return (<></>)
    }
    return (
      Object.keys(this.props.object).map((key) => {
        if (typeof this.props.object[key] == "string" && this.props.object[key] !== "") {
          return (
            <div>
              <div className='data'>
                <b>{key} : </b>
                <span className=''>{this.props.object[key]}</span>
              </div>
            </div>)
        } else {
          return (<></>)
        }
      })
    )
  }
}

export default StringResolver;
