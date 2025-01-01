import { Request, Response } from 'express';
import Movie from '../models/Movie';
import { getCache, setCache, deleteCache } from '../utils/cache';

export const getMovies = async (req: Request, res: Response) => {
  const cacheKey = 'all-movies';
  const cachedMovies = getCache(cacheKey);
  if (cachedMovies) {
    return res.status(200).json(cachedMovies);
  }

  try {
    const movies = await Movie.find();
    setCache(cacheKey, movies);
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

export const searchMovies = async (req: Request, res: Response) => {
  const query = req.query.q as string;

  const cacheKey = `search-movies-${query}`;
  const cachedMovies = getCache(cacheKey);
  if (cachedMovies) {
    console.log('Returning cached search results');
    return res.status(200).json(cachedMovies);
  }

  try {
    const movies = await Movie.find({
      $or: [{ title: new RegExp(query, 'i') }, { genre: new RegExp(query, 'i') }],
    });
    setCache(cacheKey, movies)
    res.status(200).json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const addMovie = async (req: Request, res: Response) => {
  const { title, genre, rating, streamingLink } = req.body;
  try {
    const movie = new Movie({ title, genre, rating, streamingLink });
    await movie.save();
    deleteCache('all-movies');
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add movie' });
  }
};

export const updateMovie = async (req: Request, res: Response) => {
  const { title, genre, rating, streamingLink } = req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, genre, rating, streamingLink },
      { new: true }
    );
    deleteCache('all-movies');
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update movie' });
  }
};

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    deleteCache('all-movies');
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete movie' });
  }
};