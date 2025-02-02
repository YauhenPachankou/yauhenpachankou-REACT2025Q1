import React from 'react';

import Search from '../Search/Search';
import List from '../List/List';
import './Main.css';

export interface Hero {
  name: string;
  gender: string;
  hair_color: string;
  skin_color: string;
  height: string;
}

interface MainState {
  items: Hero[];
  loading: boolean;
  error: string | null;
}

class Main extends React.Component {
  state: MainState = {
    items: [],
    loading: false,
    error: null,
  };

  fetchData = async (searchTerm: string = '') => {
    const baseUrl = 'https://swapi.dev/api/people';
    this.setState({ loading: true, error: null });

    const url: string = searchTerm
      ? `${baseUrl}?page=1&search=${searchTerm}`
      : `${baseUrl}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      this.setState({ items: data.results, loading: false });
    } catch (error) {
      this.setState({ error: (error as Error).message, loading: false });
    }
  };

  componentDidMount() {
    const searchTerm: string = localStorage.getItem('searchTerm') || '';
    this.fetchData(searchTerm);
  }

  handleSearch = (searchTerm: string) => {
    this.fetchData(searchTerm);
  };

  throwError = () => {
    try {
      throw new Error('An error occurred on button click!');
    } catch (error) {
      this.setState({ error: (error as Error).message, loading: false });
    }
  };

  render() {
    const { items, loading, error } = this.state;

    if (error) {
      throw error;
    }

    return (
      <main className="main">
        <div className="main__search">
          <Search onSearch={this.handleSearch} />
        </div>

        {loading && <div className="main__loading">Loading...</div>}

        <List loading={loading} items={items} />

        <button className="main__error" onClick={this.throwError}>
          Throw error
        </button>
      </main>
    );
  }
}

export default Main;
