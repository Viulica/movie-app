'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ type: '', value: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies?action=fetch');
      const data = await response.json();
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch-and-save', count: 50 }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching and saving:', error);
      alert('Greška pri dohvaćanju podataka');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj podatak?')) return;

    try {
      const response = await fetch(`/api/movies?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchData();
        alert('Podatak je obrisan');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Greška pri brisanju');
    }
  };

  const applyFilter = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/movies?action=fetch', window.location.origin);
      if (filter.type && filter.value) {
        url.searchParams.append('filter', filter.type);
        url.searchParams.append('value', filter.value);
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error('Error filtering:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Učitavanje...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {session.user?.name}
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Actions */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button
            onClick={() => fetchAndSave()}
            disabled={loading}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Učitavanje...' : 'Dohvati filmove iz API-ja (TheMovieDB + OMDB)'}
          </button>

          {/* Filter */}
          <div className="flex gap-2">
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Filtriraj po...</option>
              <>
                <option value="title">Naslov</option>
                <option value="year">Godina</option>
                <option value="genre">Žanr</option>
                <option value="rating">Ocjena (min)</option>
                <option value="director">Redatelj</option>
                <option value="imdbRating">IMDb ocjena (min)</option>
              </>
            </select>
            <input
              type="text"
              value={filter.value}
              onChange={(e) => setFilter({ ...filter, value: e.target.value })}
              placeholder="Vrijednost..."
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={applyFilter}
              disabled={!filter.type || !filter.value || loading}
              className="rounded-lg bg-gray-500 px-4 py-2 text-white transition-colors hover:bg-gray-600 disabled:opacity-50"
            >
              Filtriraj
            </button>
            {(filter.type || filter.value) && (
              <button
                onClick={() => {
                  setFilter({ type: '', value: '' });
                  fetchData();
                }}
                className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400 dark:bg-gray-600 dark:text-white"
              >
                Resetiraj
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center text-lg text-gray-600 dark:text-gray-400">
            Učitavanje podataka...
          </div>
        )}

        {!loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.length === 0 ? (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-400">
                Nema filmova u bazi. Kliknite "Dohvati filmove iz API-ja" za početak.
              </div>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie._id}
                  className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                >
                  {movie.posterPath && (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                      alt={movie.title}
                      className="h-64 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      {movie.title}
                    </h3>
                    {movie.releaseDate && (
                      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(movie.releaseDate).getFullYear()}
                      </p>
                    )}
                    {movie.voteAverage && (
                      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        TMDB: ⭐ {movie.voteAverage.toFixed(1)}/10
                      </p>
                    )}
                    {movie.imdbRating && (
                      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
                        IMDb: ⭐ {movie.imdbRating}/10
                      </p>
                    )}
                    {movie.director && (
                      <p className="mb-1 text-xs text-gray-500 dark:text-gray-500">
                        Redatelj: {movie.director}
                      </p>
                    )}
                    {movie.genres && movie.genres.length > 0 && (
                      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        {movie.genres.join(', ')}
                      </p>
                    )}
                    <button
                      onClick={() => deleteItem(movie.tmdbId)}
                      className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white transition-colors hover:bg-red-600"
                    >
                      Obriši
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

