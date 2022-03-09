import React from 'react';
import Thumbnail from './Thumbnail';
import StringResolver from './StringResolver'

class ScrollListElement extends React.Component {
  render() {
    if (this.props.data == null) {
      return (<></>)
    }
    return (
      <div className='ScrollListElement'>
        <div className='Image'>
          <Thumbnail data={this.props.data.thumbnail} />
        </div>
        <div className='Info'>
          <StringResolver object={this.props.data}></StringResolver>
        </div>
      </div>
    )
  }
}

class ScrollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { scrollNumber: 1, touchStartY: 0 }
    this.scroll = this.scroll.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
    this.onMouseLeave = this.mouseLeave.bind(this);
  }

  mouseEnter(e) {
    document.body.style.overflow = 'hidden';
  }

  mouseLeave(e) {
    document.body.style.overflow = 'auto';
  }

  touchStart(e) {
    this.setState({ touchStartY: e.touches[0].pageY })
    document.body.style.overflow = 'hidden';
  }

  touchMove(e) {
    this.setState({ touchEndY: e.touches[0].pageY })
    document.body.style.overflow = 'auto';
  }

  getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

  touchEnd(e) {
    let scrollArea = document.querySelector('#ScrollList_' + this.props.characterID + '_' + this.props.type).parentNode
    let scrollLength = scrollArea.clientHeight
    if (this.state.touchStartY > this.state.touchEndY) {
      let scrollTo = (this.state.scrollNumber + 1) * scrollLength;
      if (scrollTo > 0 & scrollTo < scrollArea.scrollHeight) {
        this.setState({ scrollNumber: this.state.scrollNumber + 1 });
        scrollArea.scroll({ top: scrollTo, behavior: "smooth" });
      } else {
        document.body.style.overflow = 'auto';
        window.scroll({ top: this.getCoords(scrollArea.parentElement.parentElement.parentElement.nextElementSibling).top , behavior: "smooth"})
      }
    } else {
      let scrollTo = (this.state.scrollNumber - 1) * scrollLength;
      if (scrollTo > 0 & scrollTo < scrollArea.scrollHeight) {
        this.setState({ scrollNumber: this.state.scrollNumber - 1 });
        scrollArea.scroll({ top: scrollTo, behavior: "smooth" });
      } else {
        document.body.style.overflow = 'auto';
        
        window.scroll({ top: this.getCoords(scrollArea.parentElement.parentElement.parentElement.previousElementSibling).top, behavior: "smooth"})
      }
    }
    this.setState({ touchStartY: 0, touchEndY: 0 })
  }

  scroll(e) {
    let scrollArea = document.querySelector('#ScrollList_' + this.props.characterID + '_' + this.props.type).parentNode
    console.log(scrollArea.clientHeight)
    let scrollLength = scrollArea.clientHeight
    if (e.deltaY < 0) {
      let scrollTo = (this.state.scrollNumber - 1) * scrollLength;
      if (scrollTo > 0 & scrollTo < scrollArea.scrollHeight) {
        this.setState({ scrollNumber: this.state.scrollNumber - 1 });
        scrollArea.scroll({ top: scrollTo, behavior: "smooth" });
      } else {
        document.body.style.overflow = 'auto';
      }
    } else {
      let scrollTo = (this.state.scrollNumber + 1) * scrollLength;
      if (scrollTo > 0 & scrollTo < scrollArea.scrollHeight) {
        this.setState({ scrollNumber: this.state.scrollNumber + 1 });
        scrollArea.scroll({ top: scrollTo, behavior: "smooth" });
      } else {
        document.body.style.overflow = 'auto';
      }
    }
  }

  render() {
    if (this.props.data == null || !Array.isArray(this.props.data)) {
      return (<></>)
    }
    return (
      <div
        onWheel={this.scroll}
        onTouchStart={this.touchStart}
        onTouchMove={this.touchMove}
        onTouchEnd={this.touchEnd}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
        id={'ScrollList_' + this.props.characterID + '_' + this.props.type}
        className='ScrollList'
      >
        {this.props.data.map(data => {
          return (
            <ScrollListElement
              characterID={this.props.characterID}
              data={data}
            ></ScrollListElement>
          )
        })}
      </div>
    )
  }
}

export default ScrollList;
