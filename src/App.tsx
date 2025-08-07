import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/public-layout';
import SearchPage from './pages/SearchPage';
import CommunityPage from './pages/CommunityPage';
import MyPage from './pages/MyPage';
import HomePage from './pages/home-page';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path='search' element={<SearchPage />} />
        <Route path='community' element={<CommunityPage />} />
        <Route path='my' element={<MyPage />} />
      </Route>
    </Routes>
  );
}
