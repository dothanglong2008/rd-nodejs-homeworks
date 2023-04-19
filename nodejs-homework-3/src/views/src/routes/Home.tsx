import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import './Home.css';

const Home: FC = () => {

    return (
        <div className="Home">
            <Outlet />
        </div>
    );
}

export default Home;
