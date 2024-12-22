import React from 'react';
import './gerald.css';

export default function LoadingDots() {
    return (
        <div className="msg loading-msg">
            <div className="loading-dots">
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}