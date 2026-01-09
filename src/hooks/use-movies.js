import { useState } from "react";
import { toast } from "sonner";

export function useMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async (filterType = null, filterValue = null) => {
    setLoading(true);
    try {
      let url = "/api/movies?action=fetch";
      if (filterType && filterValue) {
        url += `&filter=${filterType}&value=${encodeURIComponent(filterValue)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAndSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fetch-and-save" }),
      });
      const data = await response.json();
      if (data.success) {
        await fetchMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Error fetching and saving:", error);
      toast.error("Greška pri dohvaćanju podataka");
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`/api/movies?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        await fetchMovies();
        toast.success("Film je obrisan");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Greška pri brisanju");
    }
  };

  return {
    movies,
    loading,
    fetchMovies,
    fetchAndSave,
    deleteMovie,
  };
}
