import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';

import './Main.css';
import List from '../List/List';
import Search from '../Search/Search';
import Pagination from '../Pagination/Pagination';
import useLocalStorage from '../../hooks/useLocalStorage';

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
  totalItems: number;
}

const ITEMS_PER_PAGE = 10;

const Main: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [state, setState] = useState<MainState>({
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
  });

  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');

  const fetchData = useCallback(
    async (searchTerm: string = '', page: number = 1) => {
      const baseUrl = 'https://swapi.dev/api/people';
      setState((prevState) => ({ ...prevState, loading: true, error: null }));

      const url: string = searchTerm
        ? `${baseUrl}?search=${searchTerm}`
        : `${baseUrl}?page=${page}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setState({
          items: data.results,
          loading: false,
          error: null,
          totalItems: data.count,
        });
      } catch (error) {
        setState({
          items: [],
          loading: false,
          error: (error as Error).message,
          totalItems: 0,
        });
      }
    },
    []
  );

  useEffect(() => {
    fetchData(searchTerm, page);
  }, [fetchData, searchTerm, page]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);
    },
    [setSearchTerm]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams({ page: newPage.toString() });
    },
    [setSearchParams]
  );

  const throwError = () => {
    try {
      throw new Error('An error occurred on button click!');
    } catch (error) {
      setState({ ...state, error: (error as Error).message, loading: false });
    }
  };

  const { items, loading, error, totalItems } = state;

  if (error) {
    throw error;
  }

  return (
    <main className="main">
      <div className="main__search">
        <Search onSearch={handleSearch} initialValue={searchTerm} />
      </div>

      {loading && <div className="main__loading">Loading...</div>}

      <List loading={loading} items={items} />

      {!loading && totalItems > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={page}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}

      <button className="main__error" onClick={throwError}>
        Throw error
      </button>
    </main>
  );
};

export default Main;
