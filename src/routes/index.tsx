import { Home } from '../pages/Home';
import { Route, Routes } from 'react-router-dom';
import { Login } from '../pages/Login';
import Mobile from '../layouts/Mobile';

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Mobile />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};
