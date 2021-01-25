import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import { loginInRoutes, loginOutRoutes } from 'src/routes';
import { ToastContainer } from 'react-toastify';
import Client from 'src/Apollo/Client';
import { ApolloProvider } from '@apollo/react-hooks';
import './components/i18n'
const App = () => {
  const loginInRouting = useRoutes(loginInRoutes);
  const loginOutRouting = useRoutes(loginOutRoutes);
  let loginToken = localStorage.getItem('userInfo')

  return (
    <Suspense fallback="loading">
    <ApolloProvider client={Client}>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            {loginToken === null ? loginOutRouting : null}
            {loginToken !== null ? loginInRouting : null}
        </ThemeProvider>
        <ToastContainer style={{fontSize:"14px",width:"360px"}} position="top-center" />
    </ApolloProvider>
  </Suspense>
  );
};

export default App;
