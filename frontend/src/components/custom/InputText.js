import React, { useState } from 'react';

export const InputText = (props) => {
    const [isEmpty, setIsEmpty] = useState(true);
    const [focus, setFocus] = useState(false);
    
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
                    onBlur={e => setFocus(false)} />
            
                {isEmpty ? <label style={styles.placeholder}>{props.placeholder}</label> : null}
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
    }
}