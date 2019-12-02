import React, { useState } from 'react';

import api from '../../services/api';

import '../../pages/Professional Profile Page/ProfessionalProfilePage.css';

import Star from '../../assets/icons/star.svg';
import StarOff from '../../assets/icons/star-off.svg';
import User from '../../assets/icons/user.svg';
import TempImage from '../../temp/example_photo.png';

export default function ProfessionalProfilePage({ history, location, match }) {
    const jobId = match.params.job_id;

    const[loading, setLoading] = React.useState(true);
    const[professionalProfile, setProfessionalProfile] = React.useState();
    const[job, setJob] = React.useState();
    const [comments, setComments] = React.useState([]);

    React.useEffect(() => {
        (async() => {
            setLoading(true);

            await api.post('/job/show', {}, {
                headers: {
                    job_id: jobId
                }
            }).then(response => {
                setJob(response.data.job);
                setProfessionalProfile(response.data.professionalProfile);
            });

            await api.post('/contracts/getByJobId', {}, {
                headers: {
                    job_id: jobId
                }
            }).then(response => {
                response.data.forEach(element => {
                    if(element.status === 'close' && element.rate.$numberDecimal >= 0)
                        setComments(comments => [...comments, {
                            employer: element.employer,
                            rate: element.rate.$numberDecimal,
                            comment: element.comment,
                            updatedAt: element.updatedAt
                        }]);
                });
                setLoading(false);
            });
        })();
    }, []);

    function handleContratar() {
        history.push(location.pathname + '/contract');
    }

    return(
        <div className='main-container' style={{ justifyContent:'center', alignItems:'center' }}>
            {
                loading ? 'Loading...' :
                <div style={{ marginTop:'50px', display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                        <label style={{ fontSize:'12px' }}>{professionalProfile.fullName}</label>
                        <label style={{ fontWeight:600, fontVariant:'small-caps', fontSize:'18px' }}>{job.job}</label>
                        <label style={{ fontWeight:600, background:'green', color:'white', padding:'2px 5px', margin:'5px 0', fontVariant:'small-caps', fontSize:'14px' }}>{job.price} bitpoints</label>
                        <label style={{ color:'rgba(0, 0, 0, 0.4)', fontSize:'12px', marginBottom:'30px' }}>{job.description}</label>
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <label style={{ fontWeight:800, fontSize:'36px' }}>{parseFloat(job.rate_weighted_average.$numberDecimal).toFixed(1)}</label>
                            <div>
                                {
                                    job.rate_weighted_average.$numberDecimal >= 1 ?
                                        <img src={Star} width='25px' style={{ marginRight:'5px' }} />
                                    :
                                        <img src={StarOff} width='25px' style={{ marginRight:'5px' }} />
                                }
                                {
                                    job.rate_weighted_average.$numberDecimal >= 2 ?
                                        <img src={Star} width='25px' style={{ marginRight:'5px' }} />
                                    :
                                        <img src={StarOff} width='25px' style={{ marginRight:'5px' }} />
                                }
                                {
                                    job.rate_weighted_average.$numberDecimal >= 3 ?
                                        <img src={Star} width='25px' style={{ marginRight:'5px' }} />
                                    :
                                        <img src={StarOff} width='25px' style={{ marginRight:'5px' }} />
                                }
                                {
                                    job.rate_weighted_average.$numberDecimal >= 4 ?
                                        <img src={Star} width='25px' style={{ marginRight:'5px' }} />
                                    :
                                        <img src={StarOff} width='25px' style={{ marginRight:'5px' }} />
                                }
                                {
                                    job.rate_weighted_average.$numberDecimal >= 5 ?
                                        <img src={Star} width='25px' style={{ marginRight:'5px' }} />
                                    :
                                        <img src={StarOff} width='25px' style={{ marginRight:'5px' }} />
                                }
                            </div>
                            <label style={{ fontSize:'12px', color:'rgba(0, 0, 0, 0.4)' }}>{comments.length} avaliações</label>
                        </div>
                    </div>

                    <input type='submit' value='Contratar' style={{ marginTop:'40px' }} onClick={handleContratar}/>

                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'50px', width:'700px' }}>
                        <label style={{ fontVariant:'small-caps', fontWeight:600, letterSpacing:'2px' }}>Avaliações</label>
                        {
                            (comments.length > 0) ?
                                comments.map((element, index) => {
                                    return(
                                        <div key={index}>
                                            <CommentCard key={index} userId={element.employer} rate={element.rate} comment={element.comment} updatedAt={element.updatedAt} />
                                        </div>
                                    );
                                })
                            :
                                <label>Sem comentários.</label>
                        }
                    </div>

                </div>
            }
        </div>
    );
}

const CommentCard = ({ history, userId, rate, comment, updatedAt }) => {
    const [loading, setLoading] = React.useState(true);
    const [username, setUsername] = React.useState();
    const date = new Date(updatedAt);

    React.useEffect(() => {
        setLoading(true);

        (async() => {
            await api.post('/getUser', {}, {
                headers: {
                    user_id: userId
                }
            }).then(response => {
                setUsername(response.data.username);
                setLoading(false);
            });
        })();

    }, []);

    return(
        <div style={{ width:'500px' }}>
            {
                loading ? 'loading comment...' :
                <div style={{ padding:'0 20px' }}>
                    <hr style={{ margin:'20px 0', borderColor:'rgba(0, 0, 0, 0.1)', borderWidth: '1px 0 0 0'}} />
                    <div style={{ display:'flex', flexDirection:'row' }}>
                        <img src={User} height='60px' style={{ opacity:'0.6' }} />
                        <div style={{ flex:1, marginLeft:'20px' }}>
                            <div>
                                <div style={{ marginBottom:'5px', fontWeight:600 }}>{username}</div>
                                <div style={{ display:'flex', flexDirection:'row', alignItems:'center' }}>
                                        <label style={{ fontWeight:600, marginRight:'10px', fontSize:'14px' }}>{rate},0</label><br />
                                        {
                                            rate >= 1 ?
                                                <img src={Star} width='15px' style={{ marginRight:'5px' }} />
                                            :
                                                <img src={StarOff} width='15px' style={{ marginRight:'5px' }} />
                                        }
                                        {
                                            rate >= 2 ?
                                                <img src={Star} width='15px' style={{ marginRight:'5px' }} />
                                            :
                                                <img src={StarOff} width='15px' style={{ marginRight:'5px' }} />
                                        }
                                        {
                                            rate >= 3 ?
                                                <img src={Star} width='15px' style={{ marginRight:'5px' }} />
                                            :
                                                <img src={StarOff} width='15px' style={{ marginRight:'5px' }} />
                                        }
                                        {
                                            rate >= 4 ?
                                                <img src={Star} width='15px' style={{ marginRight:'5px' }} />
                                            :
                                                <img src={StarOff} width='15px' style={{ marginRight:'5px' }} />
                                        }
                                        {
                                            rate >= 5 ?
                                                <img src={Star} width='15px' style={{ marginRight:'5px' }} />
                                            :
                                                <img src={StarOff} width='15px' style={{ marginRight:'5px' }} />
                                        }
                                        <label style={{ marginLeft:'10px', color:'rgba(0, 0, 0, 0.6)', fontSize:'12px' }}>{ `${String(date.getDate()).padStart(2, '0')}/${date.getMonth()+1}/${date.getFullYear()}` }</label><br />
                                    </div>
                            </div>
                            {
                                comment ? <div style={{ backgroundColor:'#E2D7CB', padding:'10px', margin:'10px 0', borderRadius:'4px', fontSize:'14px' }}>{comment}</div> : null
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}