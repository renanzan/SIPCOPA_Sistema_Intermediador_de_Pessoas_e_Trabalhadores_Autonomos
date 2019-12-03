import React from 'react'
import Lottie from 'react-lottie';



export default function LottieControl({ animationData:_animationData, height:_height, width:_width, loop:_loop, style }) {
    const [animationData, setAnimationData] = React.useState(_animationData);
    const [height, setHeight] = React.useState(_height);
    const [width, setWidth] = React.useState(_width);

    const [isStopped, setStoped] = React.useState(false);
    const [isPaused, setPaused] = React.useState(false);

    // const buttonStyle = {
    //     display: 'block',
    //     margin: '10px auto'
    // };

    const defaultOptions = {
        loop: _loop===undefined ? true : _loop,
        autoplay: true, 
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

    return(
        <div style={style}>
            <Lottie
                options={defaultOptions}
                height={parseInt(height) || 400}
                width={parseInt(width) || 400}
                
                isStopped={isStopped}
                isPaused={isPaused}/>
        </div>
    );
}