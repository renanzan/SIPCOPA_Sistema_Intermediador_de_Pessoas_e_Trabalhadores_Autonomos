import React from 'react';

export default function Footer() {
    return(
        <div className="footer" style={styles.footer}>FOOTER</div>
    );
}

const styles = {
    footer: {
        marginTop: '50px',
        background: 'rgba(0, 0, 0, 0.4)',
        minHeight: '300px'
    }
}