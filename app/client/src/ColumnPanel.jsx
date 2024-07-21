import React from 'react';

function ColumnPanel({ columns, toggleColumn }) {
    return (
        <div className="w-1/4 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            {Object.keys(columns).map(column => (
                <label key={column} className="flex items-center p-2 cursor-pointer hover:bg-gray-200">
                    <input
                        type="checkbox"
                        checked={columns[column]}
                        onChange={() => toggleColumn(column)}
                        className="mr-2"
                    />
                    {column}
                </label>
            ))}
        </div>
    );
}

export default ColumnPanel;
