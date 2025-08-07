import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import SearchPage from './pages/SearchPage';
import CommunityPage from './pages/CommunityPage';
import MyPage from './pages/MyPage';
import HomePage from './pages/home-page';
import WriteReviewPage from './pages/plus-page/write-review-page';
import CreateRoomPage from './pages/plus-page/create-room-page';
import PlanPage from './pages/plus-page/plan-page';

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path='search' element={<SearchPage />} />
        <Route path='community' element={<CommunityPage />} />
        <Route path='my' element={<MyPage />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/write-review" element={<WriteReviewPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/create-room" element={<CreateRoomPage />} />
      </Route>
    </Routes>
  );
}
