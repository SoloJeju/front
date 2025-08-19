import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import HomePage from './pages/home-page';
import MyPage from './pages/MyPage';
import SearchPage from './pages/search-page/index';
import SearchMapPage from './pages/search-page/search-map-page'
import SearchBoxPage from './pages/search-page/search-box-page';
import SearchDetailPage from './pages/search-page/search-detail-page';
import CommunityPage from './pages/community-page';
import PostDetailPage from './pages/community-page/post-detail-page';
import WriteReviewPage from './pages/plus-page/write-review-page';
import CreateRoomPage from './pages/plus-page/create-room-page';
import PlanPage from './pages/plus-page/plan-page';
import PlanDetailPage from './pages/plus-page/plan-detail-page';
import PostWritePage from './pages/community-page/post-write-page';
import RoomPage from './pages/room-page';
import ChatRoomPage from './pages/room-page/chat-room-page';
import UserProfilePage from './pages/profile-page/user-profile-page';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import ProfileCreationPage from './pages/profile/ProfileCreationPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* 스플래시 페이지 */}
        <Route path="/splash" element={<SplashPage />} />

        {/* Navbar가 없는 레이아웃 (로그인, 회원가입 등) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-password" element={<FindPasswordPage />} />
          <Route path="/profile/create" element={<ProfileCreationPage />} />
          <Route path="/write-review" element={<WriteReviewPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/plan/:planId" element={<PlanDetailPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="community/new-post" element={<PostWritePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/chat-room/:roomId" element={<ChatRoomPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        </Route>

        {/* Navbar가 있는 레이아웃 (메인 페이지들) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search-map" element={<SearchMapPage/>}/>
        <Route path="search-box" element={<SearchBoxPage />}/>
        <Route path="search-detail" element={<SearchDetailPage/>}/>
        <Route path="community" element={<CommunityPage />} />
          <Route path="community/:postId" element={<PostDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
