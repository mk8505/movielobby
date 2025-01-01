import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import Movie from '../models/Movie';

const adminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MzU2NjAxMzQsImV4cCI6MTc2NzE5NjEzNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJyb2xlIjoiYWRtaW4ifQ.IwJzYYFl0HJkSlRQaM5Ju88t8eLa_68AF9qMXTvxWtU';
const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MzU2NjAxMzQsImV4cCI6MTc2NzE5NjEzNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJyb2xlIjoidXNlciJ9.ejYAuneomlQaZJTRW-MtDHsGCmDQ2-p8VgHiRPg2UW0';

describe('Movie Lobby API Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/movielobby', {
    });
  });

  afterEach(async () => {
    await Movie.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // GET /movies
  it('should list all movies', async () => {
    await Movie.create({ title: 'Inception', genre: 'Sci-Fi', rating: 8.8, streamingLink: 'https://example.com/inception' });

    const res = await request(app).get('/movies').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe('Inception');
  });

  // POST /movies (Admin role required)
  it('should allow admin to add a movie', async () => {
    const movieData = { title: 'Avatar', genre: 'Adventure', rating: 8.0, streamingLink: 'https://example.com/avatar' };

    const res = await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(movieData);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Avatar');
  });

  it('should deny access to add a movie for non-admin users', async () => {
    const movieData = { title: 'Avatar', genre: 'Adventure', rating: 8.0, streamingLink: 'https://example.com/avatar' };

    const res = await request(app)
      .post('/movies')
      .set('Authorization', `Bearer ${userToken}`)
      .send(movieData);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Permission denied: Admin role required');
  });

  // PUT /movies/:id
  it('should allow admin to update movie details', async () => {
    const movie = await Movie.create({ title: 'Inception', genre: 'Sci-Fi', rating: 8.8, streamingLink: 'https://example.com/inception' });

    const updatedData = { title: 'Inception Updated', genre: 'Thriller', rating: 9.0 };
    const res = await request(app)
      .put(`/movies/${movie._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Inception Updated');
  });

  // DELETE /movies/:id
  it('should allow admin to delete a movie', async () => {
    const movie = await Movie.create({ title: 'Inception', genre: 'Sci-Fi', rating: 8.8, streamingLink: 'https://example.com/inception' });

    const res = await request(app)
      .delete(`/movies/${movie._id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Movie deleted successfully');
  });

  it('should deny access to delete a movie for non-admin users', async () => {
    const movie = await Movie.create({ title: 'Inception', genre: 'Sci-Fi', rating: 8.8, streamingLink: 'https://example.com/inception' });

    const res = await request(app)
      .delete(`/movies/${movie._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Permission denied: Admin role required');
  });
});
