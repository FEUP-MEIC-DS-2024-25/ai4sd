'use client';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.css';
import React, { useState } from 'react';
import { getAssistantFilters } from "@/app/utils/utils";
import { setAssistantFilters } from "@/app/utils/utils";

function SettingsPopUp({ onClose, assistName }) {
    const [filters, setFilters] = useState(getAssistantFilters(assistName) || {});

    // Recursive rendering function for nested filters
    const renderFilters = (filters, parentKey = '') => {
        return Object.keys(filters).map((key) => {
            const value = filters[key];
            const currentKey = parentKey ? `${parentKey}.${key}` : key;

            return (
                <div key={currentKey}>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name={currentKey}
                            checked={typeof value === 'object' ? areAllChildrenSelected(value) : value}
                            onChange={(e) => handleCheckboxChange(e, currentKey)}
                            className="form-checkbox h-5 w-5 text-white"
                        />
                        <span className="text-white">{key}</span>
                    </label>
                    {typeof value === 'object' && (
                        <div className="ml-4">
                            {renderFilters(value, currentKey)}
                        </div>
                    )}
                </div>
            );            
        });
    };

    // Helper function to update the state of all child properties
    const updateNestedFilters = (filters, keys, value) => {
        if (keys.length === 0) {
            return value;
        }

        const [currentKey, ...restKeys] = keys;
        return {
            ...filters,
            [currentKey]: updateNestedFilters(filters[currentKey], restKeys, value),
        };
    };

    // Helper function to propagate selection down to all children
    const propagateChildren = (filter, value) => {
        if (typeof filter === 'object') {
            const updatedFilter = {};
            for (const key in filter) {
                updatedFilter[key] = propagateChildren(filter[key], value);
            }
            return updatedFilter;
        }
        return value;
    };

    const handleCheckboxChange = (event, key) => {
        const { checked } = event.target;
        const keys = key.split('.');

        setFilters((prev) => {
            const targetFilter = keys.reduce((acc, k) => acc[k], prev);
            const updatedFilter = propagateChildren(targetFilter, checked);
            return updateNestedFilters(prev, keys, updatedFilter);
        });
    };

    // Helper function to check if all children are selected
    const areAllChildrenSelected = (filter) => {
        if (typeof filter === 'object') {
            return Object.values(filter).every(areAllChildrenSelected);
        }
        return filter;
    };

    const handleRegister = () => {
        setAssistantFilters(assistName, filters);
        onClose();
    };

    return (
        <div className="absolute bottom-0 left-0 bg-black w-64 border border-gray-300 rounded-lg shadow-lg p-4 z-50">
            <h5 className="text-lg font-semibold mb-4 text-white">Choose Filters</h5>
            <div>{renderFilters(filters)}</div>
            <button
                onClick={onClose}
                className="mt-4 w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-300"
            >
                Close
            </button>
            <button
                onClick={handleRegister}
                className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
                Register
            </button>
        </div>
    );
}

export default SettingsPopUp;
