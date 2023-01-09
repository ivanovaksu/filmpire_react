import { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useDispatch } from 'react-redux';

import { ColorModeContext } from '../utils/ToggleColorMode';
import { fetchToken } from '../utils';
import { selectGenreOrCategory, searchMovie } from '../features/currentGenreOrCategory';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();

  useEffect(() => {
    alanBtn({
      key: '281955e14eaa23ae30b38eb83590b77c2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, mode, genres, genreOrCategory, query }) => {
        switch (command) {
          case 'chooseGenre':
            const foundGenre = genres.find((g) => g.name.toLowerCase() === genreOrCategory.toLowerCase());

            if (foundGenre) {
              dispatch(selectGenreOrCategory(foundGenre.id));
            } else {
              const category = selectGenreOrCategory(genreOrCategory.startsWith('top') ? 'top_rated' : genreOrCategory);
              dispatch(category);
            }
            break;
          case 'changeMode':
            mode === 'light' ? setMode('light') : setMode('dark');
            break;
          case 'login':
            fetchToken();
            break;
          case 'logout':
            localStorage.clear();
            window.location.href = '/';
            break;
          case 'search':
            dispatch(searchMovie(query));
            break;
          default:
            break;
        }
      },
    });
  }, []);
};

export default useAlan;
