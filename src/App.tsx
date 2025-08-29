import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './layouts/public-layout';
import ProtectedLayout from './layouts/protected-layout';
import HomePage from './pages/home-page';
import SearchPage from './pages/search-page/index';
import SearchMapPage from './pages/search-page/search-map-page';
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
import CartPage from './pages/search-page/cart-page';

import SplashPage from './pages/SplashPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import FindPasswordPage from './pages/auth/FindPasswordPage';
import ProfileCreationPage from './pages/profile/ProfileCreationPage';
import AlarmPage from './pages/alarm-page';
import MyPage from './pages/my-page/Index';
import ProfileEdit from './pages/my-page/ProfileEdit';
import MyPosts from './pages/my-page/MyPosts';
import MyPlans from './pages/my-page/MyPlans';
import MyRooms from './pages/my-page/MyRooms';
import MyReviews from './pages/my-page/MyReviews';
import MyBookmarks from './pages/my-page/MyBookmarks';
import MyComments from './pages/my-page/MyComments';
import LanguageSettings from './pages/my-page/LanguageSetting';
import ContactUs from './pages/my-page/ContactUs';
import TermsOfService from './pages/my-page/TermsOfService';
import PrivacyPolicy from './pages/my-page/PrivacyPolicy';
import ReportPage from './pages/report-page';
import MyReportsPage from './pages/report-page/my-reports';
import InquiryPage from './pages/inquiry-page';
import MyInquiriesPage from './pages/inquiry-page/my-inquiries';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* 스플래시 페이지 */}
        <Route path="/splash" element={<SplashPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/write-review" element={<WriteReviewPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/plan/:planId" element={<PlanDetailPage />} />
          <Route path="/create-room" element={<CreateRoomPage />} />
          <Route path="community/new-post" element={<PostWritePage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/chat-room/:roomId" element={<ChatRoomPage />} />
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/alarm" element={<AlarmPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage/profile-edit" element={<ProfileEdit />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route path="/" element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/find-password" element={<FindPasswordPage />} />
          <Route path="/profile/create" element={<ProfileCreationPage />} />
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="search-map" element={<SearchMapPage />} />
          <Route path="search-box" element={<SearchBoxPage />} />
          <Route path="search-detail/:placeId" element={<SearchDetailPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="community/:postId" element={<PostDetailPage />} />
          <Route path="my" element={<MyPage />} />
          <Route path="mypage/posts" element={<MyPosts />} />
          <Route path="mypage/plans" element={<MyPlans />} />
          <Route path="mypage/rooms" element={<MyRooms />} />
          <Route path="mypage/reviews" element={<MyReviews />} />
          <Route path="mypage/bookmarks" element={<MyBookmarks />} />
          <Route path="mypage/comments" element={<MyComments />} />
          <Route path="mypage/language" element={<LanguageSettings />} />
          <Route path="mypage/contact" element={<ContactUs />} />
          <Route path="mypage/terms" element={<TermsOfService />} />
          <Route path="mypage/privacy" element={<PrivacyPolicy />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/my" element={<MyReportsPage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/inquiry/my" element={<MyInquiriesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
