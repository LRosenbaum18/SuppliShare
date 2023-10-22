import React, { useState } from 'react';
import TextField from '../TextField/TextField';
import Button from '../Button/Button';
import './SearchBar.css';

function SearchSVGIcon(props) {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g id="Inner Plugin Iframe">
                <path id="Vector" d="M10.1709 5.51582C10.9026 5.32004 11.6795 5.20833 12.5001 5.20833C16.414 5.20833 19.3376 7.75042 21.0757 9.83265C22.3801 11.3952 22.3799 13.6051 21.0755 15.1676C20.8757 15.407 20.6602 15.6525 20.4292 15.8995M13.0209 9.41821C14.3295 9.63775 15.3624 10.6705 15.5818 11.9792M3.12507 3.125L21.8751 21.875M11.9792 15.5818C10.8499 15.3923 9.92595 14.5971 9.5529 13.5417M4.53042 9.14398C4.31479 9.37629 4.11279 9.60702 3.92467 9.83236C2.6203 11.3949 2.6201 13.6048 3.92443 15.1674C5.66261 17.2496 8.58614 19.7917 12.5001 19.7917C13.3356 19.7917 14.1259 19.6758 14.8692 19.4733" stroke="#666666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </g>
        </svg>
    );
}

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="searchbar-container">
            <TextField
                placeholder="Search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <Button onClick={handleSearch} type="primary">
                <SearchSVGIcon />
            </Button>
        </div>
    );
}

export default SearchBar;
