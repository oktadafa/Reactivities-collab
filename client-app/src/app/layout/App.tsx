import {  useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import Navbar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/homePage';
import { ToastContainer } from 'react-toastify';

function App() {
const {activityStore} = useStore()
const location = useLocation()
useEffect(() => {
  if (activityStore.activityREgistry.size <= 1) {
    activityStore.loadingActivies();
  }
},[activityStore.loadActivity, activityStore.activityREgistry.size])


if(activityStore.loadingInitial) return <LoadingComponent content='App Loading..'/>

  return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
    {location.pathname == "/" ?<HomePage/> :
      (
        <>
      <Navbar/>
      <Container style={{marginTop:"7em"}}>
       <Outlet/>
    </Container>
        </>
      )
      }
    </> 
  )
}


export default observer(App) 
