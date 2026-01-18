"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, Suspense } from "react";
import { MovieFilter } from "@/components/movie-filter";
import { MovieCard } from "@/components/movie-card";
import { useMovies } from "@/hooks/use-movies";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  SearchIcon,
  FileTextIcon,
  StarIcon,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Watched() {
  const { data: session, status } = useSession();
  const [currentFilter, setCurrentFilter] = useState({ type: "", value: "" });
  const {
    movies,
    loading,
    ratedMovies,
    fetchMovies,
    fetchAndSave,
    fetchRatedMovies,
    deleteMovie,
    deleteAll,
  } = useMovies();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      fetchRatedMovies();
    }
  }, [status]);

  useEffect(() => {
    if (!loading && ratedMovies.length > 0) {
      setAnnouncement(`Učitano ${ratedMovies.length} filmova`);
    }
  }, [ratedMovies, loading]);

  const handleSaveToggle = async () => {
    await fetchRatedMovies();
    await fetchMovies();
  };

  const handleRatingChange = async () => {
    await fetchRatedMovies();
    await fetchMovies();
  };

  // Create a set of rated movie IDs for quick lookup
  const ratedMovieIds = new Set(
    ratedMovies
      .filter((rm) => rm.rating && rm.rating > 0)
      .map((rm) => rm.movieId)
  );

  // Filter movies to show only rated ones
  const ratedMoviesList = movies.filter((movie) =>
    ratedMovieIds.has(movie._id)
  );

  // Create a map for user ratings and saved status
  const ratingsMap = {};
  const savedMap = {};
  ratedMovies.forEach((rm) => {
    if (rm.rating && rm.rating > 0) {
      ratingsMap[rm.movieId] = rm.rating;
      savedMap[rm.movieId] = rm.saved || false;
    }
  });

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Suspense fallback={null}>
            <MovieFilter
              fetchMovies={fetchMovies}
              onFilterApplied={setCurrentFilter}
              loading={loading}
            />
          </Suspense>

          <div className="flex gap-2 items-center justify-between w-full sm:w-auto flex-wrap sm:flex-nowrap">
            <Button
              onClick={fetchAndSave}
              disabled={loading}
              className="flex items-center gap-2 flex-1"
            >
              <Download className="size-4" />
              {loading ? "Učitavanje..." : "Dohvati filmove"}
            </Button>

            {movies.length > 0 && (
              <Button
                onClick={deleteAll}
                disabled={loading}
                variant="destructive"
                className="flex items-center gap-2 flex-1"
              >
                <Trash2 className="size-4" />
                Obriši sve
              </Button>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <Spinner className="size-8" />
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {currentFilter.type && currentFilter.value && (
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 dark:border-blue-800 dark:bg-blue-900/20">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                {ratedMoviesList.length === 0
                  ? "Nema rezultata za odabrani filter."
                  : `Pronađeno ${ratedMoviesList.length} ${
                      ratedMoviesList.length === 1 ? "rezultat" : "rezultata"
                    }`}
              </p>
            </div>
          )}
          {ratedMoviesList.length === 0 ? (
            <Empty className="w-fit mx-auto border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-8 rounded-md">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <StarIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </EmptyMedia>
                <EmptyTitle className="text-base font-medium text-gray-900 dark:text-white">
                  Nema ocijenjenih filmova
                </EmptyTitle>
                <EmptyDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Kliknite na zvjezdice da ocijenite filmove
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ratedMoviesList.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onDelete={deleteMovie}
                  isSaved={savedMap[movie._id] || false}
                  userRating={ratingsMap[movie._id] || 0}
                  onSaveToggle={handleSaveToggle}
                  onRatingChange={handleRatingChange}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
