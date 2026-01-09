"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MovieCard } from "@/components/dashboard/movie-card";
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
import { TrendingUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TIME_RANGES = [
  { key: "today", label: "Danas" },
  { key: "week", label: "Tjedan" },
  { key: "month", label: "Mjesec" },
  { key: "year", label: "Godina" },
  { key: "all", label: "Sve vrijeme" },
];

export default function Popular() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timeRange, setTimeRange] = useState(
    searchParams.get("range") || "all"
  );
  const { movies, loading, fetchMovies, deleteMovie } = useMovies();

  useEffect(() => {
    if (status === "authenticated") {
      fetchMovies();
    }
  }, [status]);

  useEffect(() => {
    // Update URL when time range changes
    const params = new URLSearchParams();
    if (timeRange !== "all") {
      params.set("range", timeRange);
    }
    const newUrl = `?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [timeRange, router]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  // Sort movies by simulated popularity score with time range consideration
  const getPopularityScore = (movie, range) => {
    const baseScore = parseInt(movie._id.slice(-4), 16) || Math.random() * 1000;

    // Simulate time-based popularity decay
    const timeMultiplier =
      {
        today: 1.5,
        week: 1.3,
        month: 1.1,
        year: 1.0,
        all: 1.0,
      }[range] || 1.0;

    // Add some randomness for time-based filtering simulation
    const timeRandomness = Math.random() * 0.5 + 0.75;

    return baseScore * timeMultiplier * timeRandomness;
  };

  const popularMovies = [...movies]
    .map((movie) => ({
      ...movie,
      popularityScore: getPopularityScore(movie, timeRange),
    }))
    .sort((a, b) => b.popularityScore - a.popularityScore);

  return (
    <div>
      <div className="mb-4">
        {/* Time Range Tabs */}
        <div className="flex flex-wrap gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.key}
              variant={timeRange === range.key ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange(range.key)}
              className={cn(
                "transition-all",
                timeRange === range.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted"
              )}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <Spinner className="h-8 w-8" />
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <>
          {popularMovies.length === 0 ? (
            <Empty className="w-fit mx-auto border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 p-8 rounded-md">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <TrendingUpIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                </EmptyMedia>
                <EmptyTitle className="text-base font-medium text-gray-900 dark:text-white">
                  Nema popularnih filmova
                </EmptyTitle>
                <EmptyDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Kliknite "Dohvati filmove" za početak
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {popularMovies.map((movie) => (
                <MovieCard
                  key={movie._id}
                  movie={movie}
                  onDelete={deleteMovie}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
