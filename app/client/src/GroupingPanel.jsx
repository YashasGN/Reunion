import React from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const GroupingPanel = ({ filters, onGroupingChange, onApply, onClear, groupingCriteria }) => {
    return (
        <div className="w-1/4 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <div className="font-semibold mb-4">Group By</div>
            <Select
                isMulti
                options={Object.keys(filters).map(filterType => ({
                    value: filterType,
                    label: filterType.charAt(0).toUpperCase() + filterType.slice(1)
                }))}
                onChange={onGroupingChange}
                className="basic-single mb-4"
                classNamePrefix="select"
                defaultValue={groupingCriteria.map(criteria => ({ value: criteria, label: criteria.charAt(0).toUpperCase() + criteria.slice(1) }))}
            />
            <div className="flex justify-end">
                <button
                    onClick={onApply}
                    className="mr-2 px-4 py-2 border rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Apply
                </button>
                <button
                    onClick={onClear}
                    className="px-4 py-2 border rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Clear
                </button>
            </div>
        </div>
    );
};

export default GroupingPanel;
