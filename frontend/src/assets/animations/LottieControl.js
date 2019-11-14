import React from 'react'
import Lottie from 'react-lottie';

var defaultAnimationData;
var height, width;

export default class LottieControl extends React.Component {

    constructor(props) {
        defaultAnimationData = props.animationData;
        height = props.height;
        width = props.width;

        super(props);
        this.state = {isStopped: false, isPaused: false};
    }

    render() {
        // const buttonStyle = {
        //     display: 'block',
        //     margin: '10px auto'
        // };

        const defaultOptions = {
            loop: true,
            autoplay: true, 
            animationData: defaultAnimationData,
            rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return <div>
      <Lottie options={defaultOptions}
              height={parseInt(height) || 400}
              width={parseInt(width) || 400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
      {/* <button style={buttonStyle} onClick={() => this.setState({isStopped: true})}>stop</button>
      <button style={buttonStyle} onClick={() => this.setState({isStopped: false})}>play</button>
      <button style={buttonStyle} onClick={() => this.setState({isPaused: !this.state.isPaused})}>pause</button> */}
    </div>
  }
}