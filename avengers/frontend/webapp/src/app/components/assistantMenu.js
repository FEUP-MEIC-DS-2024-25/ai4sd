'use client';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from 'react';
import SettingsPopUp from './settingsPopUp';

export default function AssistantMenu({ buttons, assistantName }) {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    return (
        <div className="relative btn-group w-100 p-3" role="group" aria-label="Basic example">
            {buttons.map((button, index) => (
                <button
                    type="button"
                    data-placement="top"
                    data-toggle="tooltip"
                    key={index}
                    title={button.name}
                    className="btn btn-secondary"
                    onClick={button.name === "Settings" ? toggleSettings : null}
                >
                    <i className={`bi bi-${button.icon}`}></i>
                </button>
            ))}
            {showSettings && (
                <div className="absolute top-0 right-0">
                    <SettingsPopUp onClose={toggleSettings} assistName={assistantName} />
                </div>
            )}
        </div>
    );
}
