import { Router } from 'express';
import {
  getMovies,
  searchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController';
import { isAdmin } from '../middleware/adminMiddleware';

const router:any = Router();
router.get('/movies', getMovies);
router.get('/search', searchMovies);
router.post('/movies',isAdmin,addMovie);
router.put('/movies/:id',isAdmin,updateMovie);
router.delete('/movies/:id',isAdmin,deleteMovie);
3
export default router;
