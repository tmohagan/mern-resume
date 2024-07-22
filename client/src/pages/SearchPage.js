// SearchPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { searchApi } from '../api';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchContent, setSearchContent] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const content = params.get('content') === 'true';
    const page = parseInt(params.get('page') || '1', 10);

    if (q) {
      setSearchQuery(q);
      setSearchContent(content);
      setCurrentPage(page);
      performSearch(q, content, page);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&content=${searchContent}&page=1`);
    }
  };

  const performSearch = async (query, includeContent, page) => {
    setIsLoading(true);
    setError(null);
    try {
        const response = await searchApi.get('/search', {
          params: {
            q: query,
            searchContent: includeContent,
            page: page
          }
    });
      setSearchResults(response.data.results);
      setTotalCount(response.data.totalCount);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Search</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </div>
        <div className="search-content-option">
          <input
            type="checkbox"
            id="search-content"
            checked={searchContent}
            onChange={(e) => setSearchContent(e.target.checked)}
          />
          <label htmlFor="search-content">Search through all content details</label>
        </div>
      </form>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {searchResults.length > 0 ? (
        <div className="search-results">
          <p>Found {totalCount} results</p>
          {searchResults.map((result) => (
            <div key={result.id} className="search-result">
              <h2>
                <Link to={`/${result.type}/${result.id}`}>
                  {result.title}
                </Link>
              </h2>
              <p>{result.summary}</p>
              <p>Type: {result.type}</p>
            </div>
          ))}
          <div className="pagination">
            {currentPage > 1 && (
              <Link to={`/search?q=${searchQuery}&content=${searchContent}&page=${currentPage - 1}`}>Previous</Link>
            )}
            <span>Page {currentPage} of {totalPages}</span>
            {currentPage < totalPages && (
              <Link to={`/search?q=${searchQuery}&content=${searchContent}&page=${currentPage + 1}`}>Next</Link>
            )}
          </div>
        </div>
      ) : (
        searchQuery && <p>No results found.</p>
      )}
    </div>
  );
}