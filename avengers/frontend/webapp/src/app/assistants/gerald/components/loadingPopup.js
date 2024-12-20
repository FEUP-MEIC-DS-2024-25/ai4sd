import React from 'react';
import './gerald.css';

export default function LoadingPopup() {
    return (
        <div className="loading-popup">
            <div className="loading-popup-content">
                <h2>Loading Project Context</h2>
                <p>Please wait while we set up your environment...</p>
            </div>
        </div>
    );
}