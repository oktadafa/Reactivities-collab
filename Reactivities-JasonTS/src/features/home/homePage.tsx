import { NavLink } from 'react-router-dom'
import { useStore } from '../../app/store/store';
import LoginForm from '../users/LoginForm';
import { observer } from 'mobx-react-lite';
import RegisterForm from '../users/RegisterForm';

export default observer(function HomePage() {
  const { modalStore, userStore: {IsLoggedIn, user} } = useStore();
  return (
    <div className="w-screen h-screen bg-blue-500 flex justify-center items-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-white mb-5">Reactivities</p>
        {IsLoggedIn ? (
          <>
            <p className="text-white text-2xl font-bold mb-3">
            welcome {user?.userName}
            </p>
            <NavLink
              to={"/activities"}
              className="py-2 px-4 text-xl text-white border-2 border-white hover:bg-white hover:text-blue-500 font-bold rounded-md"
            >
              Go To Activities
            </NavLink>
          </>
        ) : (
          <div className="flex justify-evenly">
            <button
              onClick={() => modalStore.openModal(<LoginForm />)}
              className="py-2 px-4 text-xl text-white border-2 border-white hover:bg-white hover:text-blue-500 font-bold rounded-md"
            >
              Login
            </button>

            <button className="py-2 px-4 text-xl text-white border-2 border-white hover:bg-white hover:text-blue-500 font-bold rounded-md" onClick={() => modalStore.openModal(<RegisterForm/>)}>
              Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
}); 