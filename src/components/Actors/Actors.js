import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Grid, Box, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

import { useGetActorsDetailsQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import useStyles from './styles';
import { MovieList, Pagination } from '..';

const Actors = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const classes = useStyles();

  const { data, isFetching, error } = useGetActorsDetailsQuery(id);
  const { data: moviesByActor } = useGetMoviesByActorIdQuery({ id, page });

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color="primary">
          Go back
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item lg={5} xl={4}>
        <img
          className={classes.image}
          src={`https://image.tmdb.org/t/p/w500/${data?.profile_path}`}
          alt={data?.name}
        />
      </Grid>
      <Grid item lg={7} xl={9} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h2" gutterBottom>
          {data?.name}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Born: {new Date(data?.birthday).toDateString()}
        </Typography>
        <Typography variant="body1" align="justify" paragraph>
          {data?.biography || 'Sorry, no biography yet...'}
        </Typography>
        <Box marginTop="2rem" display="flex" justifyContent="space-around">
          <Button target="_blank" variant="contained" color="primary" href={`https://www.imdb.com/name/${data?.imdb_id}`}>
            IMDB
          </Button>

          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} color="primary">
            Back
          </Button>
        </Box>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h2" gutterBottom align="center">
          Movies
        </Typography>
        {moviesByActor
          ? <MovieList movies={moviesByActor} numberOfMovies={12} />
          : <Box>Sorry, nothing was found.</Box>}
        <Pagination currentPage={page} setPage={setPage} totalPages={moviesByActor?.total_pages} />
      </Box>
    </Grid>
  );
};

export default Actors;
