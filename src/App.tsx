import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/public-layout';
import SearchPage from './pages/SearchPage';
import MyPage from './pages/MyPage';
import HomePage from './pages/home-page';
import CommunityPage from './pages/community-page';
import PostDetailPage from './pages/community-page/post-detail-page';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="my" element={<MyPage />} />
      </Route>
      <Route path="community/:postId" element={<PostDetailPage />} />
    </Routes>
  );
}
