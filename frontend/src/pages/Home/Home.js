import React, { useState } from 'react';
import './home.css';

import animationData from '../../assets/animations/lottie.json/rocket.json';
import LottieControl from '../../assets/animations/LottieControl';

import Header from '../../components/header/Header';
import { isAuthenticated } from '../../services/auth'

import Decorartion from '../../assets/decorations.svg';

export default function Home({ history }) {
    if(isAuthenticated())
        history.push('/service');

    return (
        <div className="main-container" style={{ justifyContent:'center' }}>
            <div className="ad">
                <label>Alcance seus objetivos como um <label className="highlighted">profissional.</label></label>
                <button onClick={() => { history.push('/connect'); }}>Criar uma conta</button>
            </div>
            <div className="rocket">
                <LottieControl animationData={animationData} height="600" />
            </div>
            <img className="decoration" src={Decorartion} alt="decoration" />
        </div>
    );
}