import React from 'react';

import Like from '../../assets/icons/like.svg';
import Star from '../../assets/icons/star.svg';

import TempImage from '../../temp/example_photo.png';

export default function JobCard(props) {
    return(
        <div style={styles.cardContainer}>
            <div style={styles.likeContainer}>
                <img src={Like} alt="like" width="30px"/>
                <label style={styles.labelLikes}>+{props.job.user_info.likes}</label>
            </div>
            <img style={styles.photo} src={TempImage} alt="profile image" />
            <label style={styles.fullName}>{props.job.user_info.fullName}</label>
            <div style={styles.rateContainer}>
                <img src={Star} alt="star" width="20px" style={{ marginRight: '5px'}} />
                <label>{props.job.rate.$numberDecimal}</label>
            </div>
            <div style={styles.descriptionContainer}>
                <label style={{ fontVariant:'small-caps', fontWeight:600, fontSize:'14px' }}>{(props.job.job)}</label>
                <br />
                <br />
                {props.job.description}
            </div>
            <div style={styles.price}>{props.job.price} pontos</div>
        </div>
    );
}

const styles = {
    cardContainer: {
        position: 'relative',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        background:'white',
        width: '250px',
        margin:'10px',
        padding:'5px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.25)',
        borderRadius: '4px'
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
        height: 150,
        width: 150,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'solid 1px rgba(0, 0, 0, 0.15)',
        borderRadius: '50%',
        marginTop: '15px'
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