import React, { useState, useEffect } from 'react';

import './my_account.css';

import api from '../../services/api';

import Loading from '../../assets/animations/lottie.json/skeleton-loading.json';
import LottieControl from '../../assets/animations/LottieControl';
import { InputText } from '../../components/custom/Input';

import Star from '../../assets/icons/star.svg';
import Coin from '../../assets/icons/coin.svg';
import Desert from '../../assets/images/desert.svg';
import TempImage from '../../temp/example_photo.png';

export default function MuAccount() {
    const [loading, setLoading] = useState(true);
    const [user, setUser ] = useState();
    const [professionalProfile, setProfessionalProfile] = useState();
    const [currentJob, setCurrentJob] = useState(0);

    useEffect(() => {
        (async() => {
            const response_user = await api.post('/auth/profile', {}, {
                headers: {
                    authentication: localStorage.getItem('@sipcopa/token')
                }
            }).then((response) => {
                return response.data.user;
            });
    
            setUser(response_user);
    
            const response_professionalProfile = await api.post('/professional_profile/my', {}, {
                headers: {
                    authentication: localStorage.getItem('@sipcopa/token')
                }
            }).then((response) => {
                return response.data;
            });
    
            setProfessionalProfile(response_professionalProfile);
    
            setLoading(false);
        })();
    }, []);

    return(
        <div className="main-container">{
            loading ? 
                <LottieControl animationData={Loading} height="400" /> :
                    professionalProfile.professionalProfile ?
                        <ProfessionalProfileInfo currentJob={currentJob} setCurrentJob={setCurrentJob} user={user} professionalProfile={professionalProfile}/> :
                    <DontHaveProfessionalProfile />
        }</div>
    );
}

const ProfessionalProfileInfo = ({ currentJob, setCurrentJob, user, professionalProfile }) => {
    return(
        <>
            <div className="accountInfoContainer">
                <div className="cardAccountInfo">
                    <UserInfo currentJob={currentJob} setCurrentJob={setCurrentJob} professionalProfile={professionalProfile} />
                    <div style={{ fontVariant:'small-caps', letterSpacing:'2px', margin:'50px 0 20px 0' }}>Informações de contato</div>
                    <div>
                        <div style={styles.label}>Celular</div>
                        <div style={{display:'inline-block', marginTop:'10px', fontWeight:'600' }}>
                            {professionalProfile.professionalProfile.phoneNumber}
                        </div>
                    </div>
                    <div>
                        <div style={styles.label}>E-mail</div>
                        <div style={{ display:'inline-block', marginTop:'10px', marginBottom:'30px', fontWeight:'600' }}>
                            {user.email}
                        </div>
                    </div>
                </div>
                
                <div className="jobCard">
                    <div style={styles.jobCardContent}>
                        <div style={styles.profileFullName}>{professionalProfile.jobs[currentJob].job}</div>
                        <div style={styles.biography}>{professionalProfile.jobs[currentJob].description}</div>
                    </div>
                    <div style={styles.jobCardFooter}>
                        <div style={styles.infoCard} className="unselectable">
                            <img src={Star} style={{ width: '25px' }} />
                            {professionalProfile.jobs[currentJob].rate.$numberDecimal}
                        </div>                    
                        <div style={styles.infoCard} className="unselectable">
                            <img src={Coin} style={{ width: '25px' }} />
                            {professionalProfile.jobs[currentJob].price}
                        </div>
                        <div style={{ padding:'0 20px', flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <button style={{ margin:0, flex:1, height:'60px' }}>Contratar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const UserInfo = ({ currentJob, setCurrentJob, professionalProfile }) => {
    return(
        <div style={styles.userInfoContainer}>
            <img src={TempImage} style={styles.profilePhoto} className="unselectable"/>
            <div style={styles.infoContainer} >
                <div style={styles.likesContainer} className="unselectable">+{professionalProfile.professionalProfile.likes} likes</div>
                <div style={styles.profileFullName}>{professionalProfile.professionalProfile.fullName}</div>
                <div style={styles.biography}>{professionalProfile.professionalProfile.biography}</div>
                <div style={styles.tagJobsContainer}>
                    {
                        professionalProfile.jobs.map((element, index) => {
                            if(index === currentJob)
                                return(
                                    <div className="tagJobSelected">{element.job}</div>
                                );
                            return(
                                <div className="tagJob" onClick={(e) => {setCurrentJob(index)}}>{element.job}</div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}

const DontHaveProfessionalProfile = () => {
    const [createProfissionalProfile, setCreateProfissionalProfile] = useState(false);

    return(
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flex: 1}}>
            {
                createProfissionalProfile ?
                    <CreateProfissionalProfile /> :
                <div style={{ textAlign:'center', fontSize:'12px', padding:'200px' }} className="card">
                    <img src={Desert} alt="desert" />
                    <div style={{ marginTop:'20px' }}><b>Você não possui um perfil profissional registrado.</b><br />
                    É necessário um perfil profissional para adicionar trabalhos.</div>
                    <button onClick={(e) => {setCreateProfissionalProfile(true)}}>Criar um perfil profissional</button>
                </div>
            }
        </div>
    );
}

const CreateProfissionalProfile = () => {
    const[name, setName] = useState('');
    const[biography, setBiography] = useState('');
    const[phoneNumber, setPhoneNumber] = useState('');
    const[state, setState] = useState('');
    const[city, setCity] = useState('');
    const[district, setDistrict] = useState('');
    const[street, setStreet] = useState('');
    const[number, setNumber] = useState('');

    return(
        <div style={{ fontSize:'12px', minWidth:'800px', minHeight:'400px', padding:'20px 50px 20px 50px' }} className="card">
            <div style={{ alignSelf:'center', margin:'10px 0 30px 0', fontVariant:'small-caps', fontSize:'16px', fontWeight: 300, letterSpacing:'2px' }}>Cadastrar perfil profissional</div>
            <div style={{ display:'flex', flexDirection:'row' }} >
                <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1 }}>
                    {/* <input placeholder='foto' /> */}
                    <InputText value='Nome completo' placeholder='Digite seu nome completo' useState={name} setState={setName} style={{ alignSelf: 'stretch' }} />
                    <InputText type="textarea" value='Biografia' placeholder='Escreva um pouco sobre você' useState={biography} setState={setBiography} style={{ alignSelf: 'stretch', marginTop: 20 }} />
                    <InputText value='Número de celular' placeholder='Digite o número do seu celular' useState={phoneNumber} setState={setPhoneNumber} style={{ alignSelf: 'stretch', marginTop: 20 }} />
                    {/* <input placeholder='data de nascimento' /> */}
                </div>
                <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1, margin:'0 0 0 50px' }}>
                    <InputText value='Estado' placeholder='Digite seu estado' useState={state} setState={setState} style={{ alignSelf: 'stretch' }} />
                    <InputText value='Cidade' placeholder='Digite a cidade' useState={city} setState={setCity} style={{ alignSelf: 'stretch', marginTop: 20 }} />
                    <InputText value='Bairro' placeholder='Digite o bairro' useState={district} setState={setDistrict} style={{ alignSelf: 'stretch', marginTop: 20 }} />
                    <InputText value='Rua' placeholder='Digite a rua' useState={street} setState={setStreet} style={{ alignSelf: 'stretch', marginTop: 20 }} />
                    <InputText type='number' value='Número' placeholder='Digite o número' useState={number} setState={setNumber} style={{ alignSelf: 'stretch', marginTop: 20 }} />
                </div>
            </div>
            <button style={{ width:'200px', alignSelf:'flex-end', margin:'50px 0 0 0' }}>Criar perfil profissional</button>
        </div>
    );
}

const styles = {
    userInfoContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#FBFBFD',
        padding: '25px',
        alignItems: 'center'
    },
    infoContainer: {
        margin: '0 0 0 50px'
    },
    profilePhoto: {
        borderRadius: '50%'
    },
    likesContainer: {
        position: 'absolute',
        top: '10px',
        right: '10px',
    },
    profileFullName: {
        fontWeight: 600,
        fontSize: '18px',
        margin: '0 0 10px 0'
    },
    biography: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: '14px',
        minHeight: '100px',
        margin: '0 0 10px 0'
    },
    tagJobsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    jobCardContent: {
        backgroundColor: '#FBFBFD',
        padding: '25px'
    },
    infoCard: {
        display: 'flex',
        flexDirection: 'column',
        width:'80px',
        height: '80px',
        margin: '10px 10px 0 0',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FBFBFD',
    },
    jobCardFooter: {
        display: 'flex',
        flexDirection: 'row',
    },
    label: {
        display: 'inline-block',
        width: '100px',
        textAlign: 'right',
        fontVariant: 'small-caps',
        margin: '0 10px 0 50px',
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: '12px'
    }
}