import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/homePage';
import { ToastContainer } from 'react-toastify';
import {  useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import VerifiyEmail from '../../features/users/VerifiyEmail';


function App() {
  const location = useLocation();
  const {commonStore, userStore, notificationStore} = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
      notificationStore.createHubConnection();

    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore, notificationStore]);

  if(!commonStore.appLoaded) return <LoadingComponent content='Loading app...'/>

  return (
    <>
      <ScrollRestoration />
      <ModalContainer />
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <GoogleOAuthProvider clientId="1095663278820-v51je89q0k2r9cvs0uevt7o4hq7rm3mu.apps.googleusercontent.com">
        {location.pathname === "/verify-email" ? (
          <VerifiyEmail />
        ) : location.pathname === "/" ? (
          <HomePage />
        ) : (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Outlet />
            </Container>
          </>
        )}
      </GoogleOAuthProvider>
    </>
  );
}

export default observer(App);
   