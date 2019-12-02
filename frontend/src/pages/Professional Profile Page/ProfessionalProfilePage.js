import React, { useState } from 'react';

import api from '../../services/api';

import '../../pages/Professional Profile Page/ProfessionalProfilePage.css';

import Star from '../../assets/icons/star.svg';
import Coin from '../../assets/icons/coin.svg';
import TempImage from '../../temp/example_photo.png';

export default function ProfessionalProfilePage({ history, match }) {
    const professionalProfileId = match.params.professional_profile_id;

    const[loading, setLoading] = React.useState(true);
    const[professionalProfile, setProfessionalProfile] = React.useState();
    const[jobs, setJobs] = React.useState();
    const[user, setUser] = React.useState();

    React.useEffect(() => {
        (async() => {
            setLoading(true);

            await api.post('/professional_profile/getByUser', {}, {
                headers: {
                    professional_profile_id: professionalProfileId
                }
            }).then(response => {
                console.log(response.data);
                setProfessionalProfile(response.data.professionalProfile);
                setUser(response.data.user);
                setJobs(response.data.jobs);
                setLoading(false);
            }).catch(error => {
                console.log(error);
            });
        })();
    }, []);

    return(
        <div className='main-container'>
            {
                loading ? 'Loading...' :
                <ProfessionalProfileInfo history={history} user={user} professionalProfile={professionalProfile} jobs={jobs} />
            }
        </div>
    );
}

const ProfessionalProfileInfo = ({ user, professionalProfile, jobs }) => {

    const [currentJob, setCurrentJob] = useState(0);

    return(
        <div className="accountInfoContainer">
            <div>
                <div className="cardAccountInfo">
                    <UserInfo currentJob={currentJob} setCurrentJob={setCurrentJob} user={user} professionalProfile={professionalProfile} jobs={jobs} />
                    <div style={{ fontVariant:'small-caps', letterSpacing:'2px', margin:'50px 0 20px 0' }}>Informações de contato</div>
                    <div>
                        <div style={styles.label}>Celular</div>
                        <div style={{display:'inline-block', marginTop:'10px', fontWeight:'600' }}>
                            {professionalProfile.phoneNumber}
                        </div>
                    </div>
                    <div>
                        <div style={styles.label}>E-mail</div>
                        <div style={{ display:'inline-block', marginTop:'10px', marginBottom:'30px', fontWeight:'600' }}>
                            {user.email}
                        </div>
                    </div>
                </div>
            </div>
            
            {
                (jobs.length > 0) ?
                    <div className="jobCard">
                        <div style={styles.jobCardContent}>
                            <div style={styles.profileFullName}>{jobs[currentJob].job}</div>
                            <div style={styles.biography}>{jobs[currentJob].description}</div>
                        </div>
                        <div style={styles.jobCardFooter}>
                            <div style={styles.infoCard} className="unselectable">
                                <img src={Star} style={{ width: '25px' }} />
                                {jobs[currentJob].rate_weighted_average.$numberDecimal}
                            </div>                    
                            <div style={styles.infoCard} className="unselectable">
                                <img src={Coin} style={{ width: '25px' }} />
                                {jobs[currentJob].price}
                            </div>
                            <div style={{ padding:'0 20px', flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <button style={{ margin:0, flex:1, height:'60px' }}>Contratar</button>
                            </div>
                        </div>
                    </div>
                : null
            }
        </div>
    );
}

const UserInfo = ({ currentJob, setCurrentJob, user, professionalProfile, jobs }) => {
    const [likesCount, setLikesCount] = React.useState(professionalProfile.likes.length);

    function handleLike() {
        console.log('LIKE!');
        (async() => {
            await api.post('/professional_profile/like', {}, {
                headers: {
                    authentication: localStorage.getItem('@sipcopa/token'),
                    professional_profile_id: professionalProfile._id
                }
            }).then(response => {
                setLikesCount(response.data.likes.length);
            });
        })();
    }

    return(
        <div style={styles.userInfoContainer}>
            <img src={TempImage} style={styles.profilePhoto} className="unselectable"/>
            <div style={styles.infoContainer} >
                <div style={styles.likesContainer} className="unselectable">
                    <input type='submit' value='like' onClick={handleLike}/>
                    <label>+{likesCount} likes</label>
                </div>
                <div style={styles.profileFullName}>{professionalProfile.fullName}</div>
                <div style={styles.biography}>{professionalProfile.biography}</div>
                <div style={styles.tagJobsContainer}>
                    {
                        (jobs.length > 0) ?
                            jobs.map((element, index) => {
                                if(index === currentJob)
                                    return(
                                        <div className="tagJobSelected">{element.job}</div>
                                    );
                                return(
                                    <div className="tagJob" onClick={(e) => {setCurrentJob(index)}}>{element.job}</div>
                                );
                            })
                        : null
                    }
                </div>
            </div>
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