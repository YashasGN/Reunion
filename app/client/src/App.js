import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Fuse from 'fuse.js';  // Add this line
import "./app.css";
import Table from "./Table";
import Pagination from "./pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFilter, faTasks } from '@fortawesome/free-solid-svg-icons';
import GroupingPanel from './GroupingPanel';
import FilterPanel from './FilterPanel';
import ColumnPanel from './ColumnPanel';


function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState({
    id: true,
    name: true,
    category: true,
    subcategory: true,
    createdAt: true,
    updatedAt: true,
    price: true,
    sale_price: true,
  });
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showGroupingPanel, setShowGroupingPanel] = useState(false);
  const [filters, setFilters] = useState({
    name: [],
    category: [],
    subcategory: [],
    createdAt: [],
    updatedAt: [],
    price: [],
    sale_price: []
  });
  const [selectedFilters, setSelectedFilters] = useState({
    name: [],
    category: [],
    subcategory: [],
    createdAt: [],  // Adjusted to single date
    updatedAt: [],  // Adjusted to single date
    price: [0, 1000],  // Default range
    sale_price: [0, 1000]  // Default range
  });
  const [groupingCriteria, setGroupingCriteria] = useState([]);
  const [dateInputs, setDateInputs] = useState({
    createdAt: '',
    updatedAt: ''
  });

  const itemsPerPage = 10;

  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000?q=${query}`);
      setData(res.data);

      // Compute filter options
      const filterOptions = {
        name: new Set(),
        category: new Set(),
        subcategory: new Set(),
        createdAt: new Set(),
        updatedAt: new Set(),
        price: new Set(),
        sale_price: new Set()
      };

      res.data.forEach(item => {
        filterOptions.name.add(item.name);
        filterOptions.category.add(item.category);
        filterOptions.subcategory.add(item.subcategory);
        filterOptions.createdAt.add(new Date(item.createdAt).toLocaleDateString());
        filterOptions.updatedAt.add(new Date(item.updatedAt).toLocaleDateString());
        filterOptions.price.add(item.price);
        filterOptions.sale_price.add(item.sale_price);
      });

      setFilters({
        name: Array.from(filterOptions.name).map(value => ({ value, label: `${value} (${res.data.filter(item => item.name === value).length})` })),
        category: Array.from(filterOptions.category).map(value => ({ value, label: `${value} (${res.data.filter(item => item.category === value).length})` })),
        subcategory: Array.from(filterOptions.subcategory).map(value => ({ value, label: `${value} (${res.data.filter(item => item.subcategory === value).length})` })),
        createdAt: Array.from(filterOptions.createdAt).map(value => ({ value, label: `${value} (${res.data.filter(item => new Date(item.createdAt).toLocaleDateString() === value).length})` })),
        updatedAt: Array.from(filterOptions.updatedAt).map(value => ({ value, label: `${value} (${res.data.filter(item => new Date(item.updatedAt).toLocaleDateString() === value).length})` })),
        price: Array.from(filterOptions.price).map(value => ({ value, label: `${value} (${res.data.filter(item => item.price === value).length})` })),
        sale_price: Array.from(filterOptions.sale_price).map(value => ({ value, label: `${value} (${res.data.filter(item => item.sale_price === value).length})` }))
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initialize fuzzy search for name filtering
    const fuse = new Fuse(data, { keys: ['name'], includeScore: true });

    // Apply filters and fuzzy search
    const filtered = data
      .filter(item =>
        (!selectedFilters.name.length || fuse.search(selectedFilters.name.join(" ")).map(result => result.item.name).includes(item.name)) &&
        (!selectedFilters.category.length || selectedFilters.category.includes(item.category)) &&
        (!selectedFilters.subcategory.length || selectedFilters.subcategory.includes(item.subcategory)) &&
        (!selectedFilters.createdAt.length || selectedFilters.createdAt.includes(new Date(item.createdAt).toLocaleDateString())) &&
        (!selectedFilters.updatedAt.length || selectedFilters.updatedAt.includes(new Date(item.updatedAt).toLocaleDateString())) &&
        (item.price >= selectedFilters.price[0] && item.price <= selectedFilters.price[1]) &&
        (item.sale_price >= selectedFilters.sale_price[0] && item.sale_price <= selectedFilters.sale_price[1])
      );

    // Group data based on groupingCriteria
    let grouped = filtered;
    if (groupingCriteria.length) {
      grouped = filtered.reduce((acc, item) => {
        let groupKey = groupingCriteria.map(criteria => item[criteria]).join(" | ");
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(item);
        return acc;
      }, {});
    }

    setGroupedData(grouped);
    setFilteredData(filtered);
  }, [data, selectedFilters, groupingCriteria]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(groupedData) ? groupedData.slice(indexOfFirstItem, indexOfLastItem) : Object.values(groupedData).flat().slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleColumn = (column) => {
    setColumns(prevColumns => ({
      ...prevColumns,
      [column]: !prevColumns[column]
    }));
  };

  const handleFilterChange = (selectedOptions, filterType) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleDateInputChange = (e, filterType) => {
    const { value } = e.target;
    setDateInputs(prev => ({
      ...prev,
      [filterType]: value
    }));
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: [value]
    }));
  };

  const handleRangeChange = (range, filterType) => {
    setSelectedFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: range
    }));
  };

  const handleGroupingChange = (selectedOptions) => {
    setGroupingCriteria(selectedOptions.map(option => option.value));
  };

  const applyFilters = () => {
    setShowFilterPanel(false);
  };

  const clearFilters = () => {
    // Reset all filters
    setSelectedFilters({
      name: [],
      category: [],
      subcategory: [],
      createdAt: [],  // Adjusted to single date
      updatedAt: [],  // Adjusted to single date
      price: [0, 1000],
      sale_price: [0, 1000]
    });
    setDateInputs({
      createdAt: '',
      updatedAt: ''
    });
    setShowFilterPanel(false);
  };

  const applyGrouping = () => {
    setShowGroupingPanel(false);
  };

  const clearGrouping = () => {
    setGroupingCriteria([]);
    setShowGroupingPanel(false);
  };

  return (
    <div className="app">
      <div className="flex items-center mb-4">
        <input
          className="search"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
        <button
          onClick={() => setShowColumnPanel(!showColumnPanel)}
          className="ml-2 focus:outline-none p-2 border rounded-full hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faEye} size="lg" />
        </button>
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="ml-2 focus:outline-none p-2 border rounded-full hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faFilter} size="lg" />
        </button>
        <button
          onClick={() => setShowGroupingPanel(!showGroupingPanel)}
          className="ml-2 focus:outline-none p-2 border rounded-full hover:bg-gray-100"
        >
          <FontAwesomeIcon icon={faTasks} size="lg" />
        </button>
      </div>
      <div className="flex">
        {showColumnPanel && (
          <ColumnPanel
            columns={columns}
            toggleColumn={toggleColumn}
          />
        )}
        {showFilterPanel && (
          <FilterPanel
            filters={filters}
            selectedFilters={selectedFilters}
            dateInputs={dateInputs}
            handleFilterChange={handleFilterChange}
            handleDateInputChange={handleDateInputChange}
            handleRangeChange={handleRangeChange}
            clearFilters={clearFilters}
          />
        )}
        {showGroupingPanel && (
          <GroupingPanel
            filters={filters}
            onGroupingChange={handleGroupingChange}
            onApply={applyGrouping}
            onClear={clearGrouping}
            groupingCriteria={groupingCriteria}
          />
        )}
        <div className={showColumnPanel || showFilterPanel || showGroupingPanel ? "w-3/4" : "w-full"}>
          <Table data={currentItems} columns={columns} />
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={Array.isArray(groupedData) ? groupedData.length : Object.values(groupedData).flat().length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
