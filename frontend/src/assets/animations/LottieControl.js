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

    return <div style={this.props.style}>
      <Lottie options={defaultOptions}
              height={parseInt(height) || 400}
              width={parseInt(width) || 400}
              isStopped={this.state.isStopped}
              isPaused={this.state.isPaused}/>
    </div>
  }
}