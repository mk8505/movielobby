import Movie from '../models/Movie';

describe('Movie Model Unit Tests', () => {
  it('should create a movie instance with correct fields', () => {
    const movieData = {
      title: 'Inception',
      genre: 'Sci-Fi',
      rating: 8.8,
      streamingLink: 'https://example.com/inception',
    };

    const movie = new Movie(movieData);

    expect(movie.title).toBe(movieData.title);
    expect(movie.genre).toBe(movieData.genre);
    expect(movie.rating).toBe(movieData.rating);
    expect(movie.streamingLink).toBe(movieData.streamingLink);
  });
});
