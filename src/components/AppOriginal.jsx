import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "7d40eb29";

function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const { movies, isLoading, error } = useMovies(query);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-gray-100">
      <div className="mx-auto max-w-7xl">
        <Navbar>
          <Logo />
          <Search query={query} setQuery={setQuery} />
          <NumResult movies={movies} />
        </Navbar>

        <Main>
          <Box>
            {isLoading && <Loader />}
            {!isLoading && !error && (
              <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
            )}
            {error && <ErrorMessage message={error} />}
          </Box>
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList
                  watched={watched}
                  onDeleteMovie={handleDeleteMovie}
                />
              </>
            )}
          </Box>
        </Main>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex animate-pulse gap-4">
          <div className="h-24 w-16 rounded-lg bg-gray-700"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-700"></div>
            <div className="h-4 w-1/2 rounded bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-red-900/50 p-6">
      <span className="text-2xl">⛔</span>
      <p className="text-lg">{message}</p>
    </div>
  );
}

function Navbar({ children }) {
  return (
    <nav className="mb-6 grid grid-cols-3 items-center rounded-xl bg-gradient-to-r from-purple-800 to-purple-600 p-4 shadow-lg">
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-4xl">🍿</span>
      <h1 className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-2xl font-bold text-transparent">
        PopcornDiary
      </h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="w-full max-w-xl rounded-full bg-purple-900/50 px-5 py-3 text-white shadow-lg transition-all placeholder:text-purple-300 focus:bg-purple-900/70 focus:outline-none focus:ring-2 focus:ring-purple-500"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResult({ movies }) {
  return (
    <p className="ml-44 text-lg text-purple-100">
      Found <span className="font-bold text-white">{movies.length}</span>{" "}
      results
    </p>
  );
}

function Main({ children }) {
  return (
    <main className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {children}
    </main>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-700/30 bg-gray-800/50 shadow-xl backdrop-blur-sm">
      <button
        className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full bg-gray-900/80 text-white transition-all hover:bg-gray-800"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="divide-y divide-gray-700/50">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li
      className="group flex cursor-pointer items-center gap-4 p-4 transition-all hover:bg-gray-700/30"
      onClick={() => onSelectMovie(movie.imdbID)}
    >
      <img
        className="h-24 w-16 rounded-lg object-cover"
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/400x600?text=No+Poster"
        }
        alt={`${movie.Title} poster`}
      />
      <div>
        <h3 className="text-lg font-medium transition-colors group-hover:text-purple-300">
          {movie.Title}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
          <span>📅 {movie.Year}</span>
        </div>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating],
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId,
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecision: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId],
  );

  useEffect(
    function () {
      if (title) document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title],
  );

  useKey("Escape", onCloseMovie);

  return (
    <div className="p-6">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header className="mb-8 flex flex-col gap-6 md:flex-row">
            <button
              className="absolute left-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-xl transition-transform hover:scale-105"
              onClick={onCloseMovie}
            >
              &larr;
            </button>
            <img
              className="h-96 w-full rounded-xl object-cover shadow-lg md:h-auto md:w-1/3"
              src={
                poster !== "N/A"
                  ? poster
                  : "https://via.placeholder.com/400x600?text=No+Poster"
              }
              alt={`Poster of ${title} movie`}
            />
            <div className="flex-1 rounded-xl bg-gray-800/50 p-6">
              <h2 className="mb-2 text-3xl font-bold">{title}</h2>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-purple-900/50 px-3 py-1 text-sm">
                  {released}
                </span>
                <span className="rounded-full bg-purple-900/50 px-3 py-1 text-sm">
                  {runtime}
                </span>
                <span className="rounded-full bg-purple-900/50 px-3 py-1 text-sm">
                  {genre}
                </span>
              </div>
              <div className="mb-4 flex items-center gap-2 text-xl">
                <span>⭐</span>
                <span className="font-bold">{imdbRating}</span>
                <span className="text-gray-400">IMDB Rating</span>
              </div>
            </div>
          </header>

          <section className="space-y-6">
            <div className="rounded-xl bg-gray-800/50 p-6">
              {!isWatched ? (
                <div className="space-y-6">
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="rounded-full bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:from-purple-700 hover:to-purple-600"
                      onClick={handleAdd}
                    >
                      + Add to Watchlist
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-lg">
                  You rated this movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Plot</h3>
              <p className="text-gray-300">{plot}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold">Starring</h3>
                <p className="text-gray-300">{actors}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold">Director</h3>
                <p className="text-gray-300">{director}</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="rounded-t-xl bg-gradient-to-r from-purple-900/50 to-purple-800/30 p-6">
      <h2 className="mb-4 text-xl font-bold">Your Watchlist</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon="📽️"
          label="Movies"
          value={watched.length}
          color="text-purple-300"
        />
        <StatCard
          icon="⭐"
          label="Avg Rating"
          value={avgImdbRating.toFixed(2)}
          color="text-yellow-400"
        />
        <StatCard
          icon="🌟"
          label="Your Avg"
          value={avgUserRating.toFixed(2)}
          color="text-yellow-300"
        />
        <StatCard
          icon="⏱️"
          label="Avg Runtime"
          value={`${Math.round(avgRuntime)} min`}
          color="text-blue-300"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="rounded-lg bg-gray-800/50 p-3">
      <div className={`text-2xl ${color}`}>{icon}</div>
      <h3 className="text-sm text-gray-400">{label}</h3>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteMovie }) {
  return (
    <ul className="divide-y divide-gray-700/30">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteMovie={onDeleteMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteMovie }) {
  return (
    <li className="group flex items-start gap-4 p-4 transition-all hover:bg-gray-700/20">
      <img
        className="h-24 w-16 rounded-lg object-cover"
        src={
          movie.poster !== "N/A"
            ? movie.poster
            : "https://via.placeholder.com/400x600?text=No+Poster"
        }
        alt={`${movie.title} poster`}
      />
      <div className="flex-1">
        <h3 className="font-medium">{movie.title}</h3>
        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{movie.imdbRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🌟</span>
            <span>{movie.userRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{movie.runtime} min</span>
          </div>
        </div>
      </div>
      <button
        className="p-2 text-red-400 transition-colors hover:text-red-300"
        onClick={() => onDeleteMovie(movie.imdbID)}
      >
        ✕
      </button>
    </li>
  );
}

export default App;
