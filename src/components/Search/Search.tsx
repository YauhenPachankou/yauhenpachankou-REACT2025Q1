import React from 'react';

import './Search.css';

interface SearchProps {
  onSearch: (term: string) => void;
}

class Search extends React.Component<SearchProps> {
  state = {
    searchTerm: localStorage.getItem('searchTerm') || '',
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleSearch = () => {
    const searchTerm = this.state.searchTerm.trim();
    this.props.onSearch(searchTerm);
    localStorage.setItem('searchTerm', searchTerm);
  };

  render() {
    return (
      <div className="search">
        <input
          className="search__input"
          type="text"
          value={this.state.searchTerm}
          onChange={this.handleInputChange}
          placeholder="Search your Star Wars' Hero"
        />
        <button className="search__button" onClick={this.handleSearch}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
