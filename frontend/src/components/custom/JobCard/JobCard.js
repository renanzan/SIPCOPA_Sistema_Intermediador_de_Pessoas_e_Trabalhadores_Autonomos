import React from 'react';

import { getConnectedUserId } from '../../../services/auth';

import './job_card.css';
import Like from '../../../assets/icons/like.svg';
import Unike from '../../../assets/icons/unlike.svg';
import Star from '../../../assets/icons/star.svg';

import PhotoProfileLoading from '../../../assets/animations/lottie.json/photo-profile-loading.json';
import LottieControl from '../../../assets/animations/LottieControl';

import TempImage from '../../../temp/example_photo.png';
import api from '../../../services/api';

export default function JobCard({ job, history, onlyLiked }) {
    const [hover, setHover] = React.useState(false);
    const [liked, setLiked] = React.useState(false);

    const [imageLoding, setImageLoading] = React.useState(true);
    const [image, setImage] = React.useState();

    React.useEffect(() => {
        (async() => {
            await getConnectedUserId().then(response => {
                setLiked(job.user_info.likes.includes(response))
            });

            setImageLoading(true);
            await api.post('/get/image', {}, {
                headers: {
                    image_id: job.user_info.imageId
                }
            }).then(response => {
                const buff = new Buffer(response.data.img.data);

                setImage({
                    buff,
                    type: response.data.type
                });
                setImageLoading(false);
            });
        })();
    }, []);
    

    return(
        <>
            {
                (onlyLiked && !liked) ? null :
                    <div style={styles.cardContainer} onMouseEnter={ e => { setHover(true); }} onMouseLeave={ e => { setHover(false); }}>
                        {
                            hover ?
                                <div style={styles.cardOverlap}>
                                    <label style={{ fontFamily:'Roboto', color:'white', fontSize:'16px', fontWeight:200, marginBottom:'5px' }}>{job.user_info.fullName}</label>
                                    <label style={{ fontFamily:'Roboto', color:'white', fontSize:'26px', fontVariant:'small-caps', textAlign:'center', marginBottom:'5px' }}>{(job.job)}</label>
                                    <div style={{ fontFamily:'Roboto', color:'white', background:'green', padding:'5px 0', minWidth:'50%', display:'flex', justifyContent:'center', fontSize:'28px', fontWeight:200, marginBottom: '10px' }}>{job.price} bp</div>
                                    <div style={{}}>
                                        <input type='submit' value='Visualizar' onClick={e => { history.push(`/service/${job.user_info.userId}/${job._id}`) }} />
                                        <input type='submit' value='Contratar' onClick={e => { history.push(`/service/${job.user_info.userId}/${job._id}/contract`) }} />
                                    </div>
                                </div>
                            : null
                        }

                    <div style={hover ? Object.assign({}, styles.cardContent, styles.cardContentBlur) : styles.cardContent}>
                        <div style={styles.likeContainer}>
                            {
                                liked ?
                                    <img src={Like} alt="like" width="30px"/>
                                :
                                    <img src={Unike} alt="like" width="30px"/>
                            }
                            <label style={styles.labelLikes}>+{job.user_info.likes.length}</label>
                        </div>
                        {
                            imageLoding ? <LottieControl style={{ marginTop:'30px' }} animationData={PhotoProfileLoading} height="128px" width="128px" /> :
                            <img style={styles.photo} src={image.type + ',' + image.buff} alt='profile image' width='128px' height='128px' />
                        }
                        <label style={styles.fullName}>{job.user_info.fullName}</label>
                        <div style={styles.rateContainer}>
                            <img src={Star} alt="star" width="20px" style={{ marginRight: '5px'}} />
                            <label>{job.rate_weighted_average.$numberDecimal}</label>
                        </div>
                        <div style={styles.descriptionContainer}>
                            <label style={{ fontVariant:'small-caps', fontWeight:600, fontSize:'14px' }}>{(job.job)}</label>
                            <br />
                            <br />
                            {job.description}
                        </div>
                        <div style={styles.price}>{job.price} pontos</div>
                    </div>
                </div>  
            }
        </>
        
    );
}

const styles = {
    cardContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'white',
        width: '250px',
        margin: '10px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.25)',
        borderRadius: '4px'
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '250px'
    },
    cardContentBlur: {
        filter: 'blur(2px)'
    },
    cardOverlap: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        borderRadius: '4px',
        background: 'rgba(65, 62, 102, 0.8)'
    },
    likeContainer: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        left: 10,
        top: 10
    },
    labelLikes: {
        color: 'rgba(0, 0, 0, 0.25)',
        fontSize: '14px'
    },
    photo: {
        height: 128,
        width: 128,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px rgba(0, 0, 0, 0.15)',
        borderRadius: '50%',
        marginTop: '30px'
    },
    fullName: {
        fontWeight: 600,
        margin: '10px 0 5px 0'
    },
    rateContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '0 0 10px 0'
    },
    descriptionContainer: {
        flex: 1,
        padding: '0 20px',
        color: 'rgba(0, 0, 0, 0.6)',
        fontWeight: 400,
        fontSize: '12px',
        textAlign: 'center',
    },
    price: {
        fontWeight: 800,
        alignSelf: 'flex-end',
        padding: '5px'
    }
}