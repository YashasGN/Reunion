import React from 'react';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function FilterPanel({
    filters,
    selectedFilters,
    dateInputs,
    handleFilterChange,
    handleDateInputChange,
    handleRangeChange,
    clearFilters
}) {
    return (
        <div className="w-1/4 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            {Object.keys(filters).map(filterType => (
                <div key={filterType} className="mb-4">
                    <div className="font-semibold">{filterType.charAt(0).toUpperCase() + filterType.slice(1)}</div>
                    {filterType === "name" ? (
                        <input
                            type="text"
                            placeholder="Search by name"
                            onChange={(e) => handleFilterChange([{ value: e.target.value }], filterType)}
                            className="basic-single"
                        />
                    ) : filterType === "price" || filterType === "sale_price" ? (
                        <div>
                            <Slider
                                range
                                min={0}
                                max={1000}  // Adjust this range as needed
                                value={selectedFilters[filterType]}
                                onChange={(range) => handleRangeChange(range, filterType)}
                            />
                            <div>
                                ${selectedFilters[filterType][0]} - ${selectedFilters[filterType][1]}
                            </div>
                        </div>
                    ) : filterType === "createdAt" || filterType === "updatedAt" ? (
                        <div>
                            <input
                                type="text"
                                placeholder="Date (YYYY-MM-DD)"
                                value={dateInputs[filterType]}
                                onChange={(e) => handleDateInputChange(e, filterType)}
                                className="mb-2 p-2 border rounded w-full"
                            />
                        </div>
                    ) : (
                        <Select
                            isMulti
                            options={filters[filterType]}
                            onChange={(options) => handleFilterChange(options, filterType)}
                            className="basic-single"
                            classNamePrefix="select"
                        />
                    )}
                </div>
            ))}
            <div className="flex space-x-2">
                <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Clear
                </button>
            </div>
        </div>
    );
}

export default FilterPanel;
