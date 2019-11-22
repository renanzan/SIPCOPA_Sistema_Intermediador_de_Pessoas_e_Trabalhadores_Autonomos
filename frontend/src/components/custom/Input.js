import React, { useState, useEffect } from 'react';

import Arrow from '../../assets/icons/arrow.svg';

export const InputText = (props) => {
    const [isEmpty, setIsEmpty] = useState(true);
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        if(props.useState.length > 0)
            setIsEmpty(false);
    }, []);
    
    const handleTextChange = (event) => {
        props.setState(event.target.value);

        if(event.target.value.length > 0 && isEmpty)
            setIsEmpty(false);
        else if(event.target.value.length === 0)
            setIsEmpty(true);
    }

    return (
        <div style={Object.assign(focus ? {opacity: 1} : {opacity: 0.6}, styles.container, props.style)}>
            <label htmlFor={props.value} style={Object.assign({}, styles.label, ((isEmpty) ? styles.labelBefore : styles.labelAfter))}>{props.value}</label>
            <div style={styles.inputContainer}>
                <input
                    type={props.type || 'text'}
                    id={props.value}
                    spellCheck={props.spellCheck || false}
                    style={styles.input}
                    value={props.useState}
                    onChange={handleTextChange}
                    onFocus={e => setFocus(true)}
                    onBlur={e => setFocus(false)}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') {
                            props.onPressEnter();
                        }
                    }}/>
            
                {isEmpty ? <label style={styles.placeholder}>{props.placeholder}</label> : null}
            </div>
        </div>
    );
}

export const OrderBy = (props) => {
    const [desc, setDesc] = useState(true);

    return(
        <div style={Object.assign({}, styles.orderByContainer, props.style)} onClick={() => { props.setLowestPrice(!props.lowestPrice); setDesc(!desc); }}>
            <label style={styles.orderByLabel}>Ordenar por</label>
            <label style={styles.orderByValue}>Menor Preço</label>
            <div style={styles.orderByButton}>
                <img src={Arrow} alt='arrow' style={desc ? styles.orderByButtonIconDesc : styles.orderByButtonIconAsc} />
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontSize: 10,
        marginBottom: 2,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    labelBefore: {
        transitionDuration: '0.3s',
        transform: 'translateY(20px)',
        opacity: 0
    },
    labelAfter: {
        transitionDuration: '0.3s',
        opacity: 1
    },
    inputContainer: {
        zIndex: 1,
        height: 45,
        position: 'relative',
        display: 'flex',
    },
    input: {
        flex: 1,
        border: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 10,
        paddingRight: 10
    },
    placeholder: {
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'absolute',
        right: 0,
        left: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        paddingLeft:'10px',
        paddingRight: '10px',
        fontWeight: '300',
        fontSize: 14
    },
    orderByContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        border: 'solid',
        borderWidth: '0 0 2px 0',
        borderColor: '#656570',
        height: '50px',
        cursor: 'pointer'
    },
    orderByLabel: {
        color: '#656570',
        cursor: 'pointer'
    },
    orderByValue: {
        color: '#2AABCC',
        flex: 1,
        textAlign: 'center',
        cursor: 'pointer'
    },
    oderByArrow: {
        display:'flex',
        alignItems: 'çenter',
        width: '50px'
    },
    orderByButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '50px',
        height: '50px'
    },
    orderByButtonIconDesc: {
        width: '10px',
        transform: 'rotate(90deg)'
    },
    orderByButtonIconAsc: {
        width: '10px',
        transform: 'rotate(270deg)'
    }
}