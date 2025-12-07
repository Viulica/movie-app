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
      fetchMovies();
    }
  }, [status]);

  const fetchMovies = async (filterType = null, filterValue = null) => {
    setLoading(true);
    try {
      let url = '/api/movies?action=fetch';
      if (filterType && filterValue) {
        url += `&filter=${filterType}&value=${encodeURIComponent(filterValue)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter.type && filter.value) {
      fetchMovies(filter.type, filter.value);
    } else {
      fetchMovies();
    }
  };

  const resetFilter = () => {
    setFilter({ type: '', value: '' });
    fetchMovies();
  };

  const fetchAndSave = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'fetch-and-save' }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchMovies();
        alert(data.message);
      }
    } catch (error) {
      console.error('Error fetching and saving:', error);
      alert('Greška pri dohvaćanju podataka');
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    if (!confirm('Jeste li sigurni da želite obrisati ovaj film?')) return;

    try {
      const response = await fetch(`/api/movies?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchMovies();
        alert('Film je obrisan');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Greška pri brisanju');
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
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Filmovi
          </h1>
          <div className="flex items-center gap-3">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="h-8 w-8 rounded-full"
              />
            )}
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {session.user?.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {session.user?.email}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Odjavi se
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchAndSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Učitavanje...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Dohvati filmove
                </>
              )}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              10 iz TMDB + 10 iz OMDB
            </span>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Filtriraj po...</option>
                <option value="title">Naslov</option>
                <option value="year">Godina (točna)</option>
                <option value="yearMin">Godina (min)</option>
                <option value="rating">Ocjena (min)</option>
                <option value="genre">Žanr</option>
                <option value="source">Izvor (TMDB/OMDB)</option>
              </select>
              <input
                type="text"
                value={filter.value}
                onChange={(e) => setFilter({ ...filter, value: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && applyFilter()}
                placeholder="Vrijednost..."
                className="flex-1 min-w-[200px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
              />
              <button
                onClick={applyFilter}
                disabled={!filter.type || !filter.value || loading}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Filtriraj
              </button>
              {(filter.type || filter.value) && (
                <button
                  onClick={resetFilter}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  Resetiraj
                </button>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-gray-900 dark:border-gray-600 dark:border-r-white"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Učitavanje podataka...</p>
            </div>
          </div>
        )}

        {!loading && (
          <>
            {(filter.type && filter.value) && (
              <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-300">
                  {movies.length === 0 
                    ? 'Nema rezultata za odabrani filter.'
                    : `Pronađeno ${movies.length} ${movies.length === 1 ? 'rezultat' : 'rezultata'}`
                  }
                </p>
              </div>
            )}
            {movies.length === 0 && !filter.type && !filter.value ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="mt-4 text-base font-medium text-gray-900 dark:text-white">Nema filmova u bazi</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kliknite "Dohvati filmove" za početak</p>
              </div>
            ) : movies.length === 0 && (filter.type || filter.value) ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
                <svg className="h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="mt-4 text-base font-medium text-gray-900 dark:text-white">Nema rezultata</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pokušajte s drugim filterom</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="relative h-56 w-full">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-700">
                          <span className="text-sm text-gray-400 dark:text-gray-500">No Poster</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${
                          movie.source === 'TMDB' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {movie.source}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900 dark:text-white">
                        {movie.title}
                      </h3>
                      <div className="mb-3 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <span>{movie.year}</span>
                        </div>
                        {movie.rating > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-yellow-500">★</span>
                            <span>{movie.rating.toFixed(1)}/10</span>
                          </div>
                        )}
                        {movie.genre && (
                          <div className="line-clamp-1 text-xs">
                            {movie.genre}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMovie(movie._id)}
                        className="w-full rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
