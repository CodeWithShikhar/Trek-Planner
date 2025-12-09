import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TrekListPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [treks, setTreks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ difficulty: '', location: '' });

  const fetchTreks = async (pageNum, f = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', String(pageNum));
      if (f.difficulty) params.append('difficulty', f.difficulty);
      if (f.location) params.append('location', f.location);

      const res = await api.get(`/treks?${params.toString()}`);
      setTreks(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load treks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreks(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTreks(1, filters);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trek?')) return;
    try {
      await api.delete(`/treks/${id}`);
      toast.success('Trek deleted');
      fetchTreks(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Trek Planner</h1>
        <div>
          <Link to="/treks/new">Add Trek</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <form className="filters" onSubmit={applyFilters}>
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters((f) => ({ ...f, difficulty: e.target.value }))}
        >
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="moderate">Moderate</option>
          <option value="hard">Hard</option>
        </select>
        <input
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="skeleton-list">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="trek-list">
          {treks.map((trek) => (
            <div key={trek._id} className="trek-card">
              {trek.images && trek.images.length > 0 && (
                <div className="trek-card-image">
                  <img src={trek.images[0]} alt={trek.name} />
                </div>
              )}
              <h3>{trek.name}</h3>
              <p>{trek.location}</p>
              <p>Difficulty: {trek.difficulty}</p>
              <p>Price: ${trek.price}</p>
              <div className="card-actions">
                <Link to={`/treks/${trek._id}/edit`}>Edit</Link>
                <button onClick={() => handleDelete(trek._id)}>Delete</button>
              </div>
            </div>
          ))}
          {treks.length === 0 && <p>No treks found.</p>}
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TrekListPage;
