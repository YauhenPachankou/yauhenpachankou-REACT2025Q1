import React, { useState, useEffect } from 'react';

import './Search.css';

interface SearchProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);

  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  return (
    <div className="search">
      <input
        className="search__input"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search your Star Wars' Hero"
      />
      <button className="search__button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Search;
