import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';

import Search from '../Search/Search';
import List from '../List/List';
import Pagination from '../Pagination/Pagination';
import useLocalStorage from '../../hooks/useLocalStorage';
import './Main.css';

export interface Hero {
  name: string;
  gender: string;
  hair_color: string;
  skin_color: string;
  height: string;
  url: string;
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
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const detailsId = searchParams.get('detailsId') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [state, setState] = useState<MainState>({
    items: [],
    loading: false,
    error: null,
    totalItems: 0,
  });

  const fetchData = useCallback(async (searchParams: URLSearchParams) => {
    const detailsId = searchParams.get('detailsId');
    console.log(detailsId);
    if (detailsId) return;

    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    const searchTerm = searchParams.get('search') || '';
    const page = searchTerm ? 1 : parseInt(searchParams.get('page') || '1', 10);

    try {
      const response = await fetch(
        `https://swapi.dev/api/people?page=${page}&search=${searchTerm}`
      );
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
  }, []);

  useEffect(() => {
    fetchData(searchParams);
  }, [fetchData, searchParams]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchTerm(searchTerm);

      setSearchParams((prev) => {
        return { ...prev, search: searchTerm };
      });
    },
    [setSearchTerm, setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        return { ...prev, page: newPage.toString() };
      });
    },
    [setSearchParams]
  );

  const handleItemClick = useCallback(
    (itemId: string) => {
      setSearchParams((prev) => {
        return { ...prev, detailsId: itemId };
      });
    },
    [setSearchParams]
  );

  const handleCloseDetails = useCallback(() => {
    if (detailsId) {
      setSearchParams((prev) => {
        prev.delete('detailsId');
        return prev;
      });
    }
  }, [setSearchParams, detailsId]);

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
      <div className="main__left" onClick={handleCloseDetails}>
        <div className="main__search">
          <Search onSearch={handleSearch} initialValue={searchTerm} />
        </div>

        {loading && <div className="main__loading">Loading...</div>}

        <List
          loading={loading}
          items={items}
          onItemClick={handleItemClick}
          selectedItemId={detailsId}
        />

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
      </div>

      {detailsId && (
        <div className="main__right">
          <Outlet context={{ onClose: handleCloseDetails }} />
        </div>
      )}
    </main>
  );
};

export default Main;
