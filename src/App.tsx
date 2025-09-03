import {
  createBrowserRouter,
  RouterProvider,
  type RouteObject,
} from 'react-router-dom';
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
import ReportDetailPage from './pages/report-page/report-detail';
import InquiryDetailPage from './pages/inquiry-page/inquiry-detail';
import SafetyCheckPage from './pages/safety-check-page';
import StatsPage from './pages/safety-check-page/stats-page';
import InquiryPage from './pages/inquiry-page';
import MyInquiriesPage from './pages/inquiry-page/my-inquiries';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const publictRoutes: RouteObject[] = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'splash', element: <SplashPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'find-password', element: <FindPasswordPage /> },
      { path: 'profile/create', element: <ProfileCreationPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'search-map', element: <SearchMapPage /> },
      { path: 'search-box', element: <SearchBoxPage /> },
      { path: 'search-detail/:placeId', element: <SearchDetailPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'report/:id', element: <ReportDetailPage /> },
      { path: 'inquiry/:id', element: <InquiryDetailPage /> },
    ],
  },
];

const protectedLayout: RouteObject[] = [
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { path: 'alarm', element: <AlarmPage /> },
      { path: 'write-review', element: <WriteReviewPage /> },
      { path: 'plan', element: <PlanPage /> },
      { path: 'plan/:planId', element: <PlanDetailPage /> },
      { path: 'community/new-post', element: <PostWritePage /> },
      { path: 'community/:postId', element: <PostDetailPage /> },
      { path: 'create-room', element: <CreateRoomPage /> },
      { path: 'room/:roomId', element: <RoomPage /> },
      { path: 'chat-room/:roomId', element: <ChatRoomPage /> },
      { path: 'profile/:userId', element: <UserProfilePage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'mypage/profile-edit', element: <ProfileEdit /> },
      { path: 'mypage/posts', element: <MyPosts /> },
      { path: 'mypage/plans', element: <MyPlans /> },
      { path: 'mypage/rooms', element: <MyRooms /> },
      { path: 'mypage/reviews', element: <MyReviews /> },
      { path: 'mypage/bookmarks', element: <MyBookmarks /> },
      { path: 'mypage/comments', element: <MyComments /> },
      { path: 'mypage/language', element: <LanguageSettings /> },
      { path: 'mypage/contact', element: <ContactUs /> },
      { path: 'mypage/terms', element: <TermsOfService /> },
      { path: 'mypage/privacy', element: <PrivacyPolicy /> },
      { path: 'report', element: <ReportPage /> },
      { path: 'report/my', element: <MyReportsPage /> },
      { path: 'inquiry', element: <InquiryPage /> },
      { path: 'inquiry/my', element: <MyInquiriesPage /> },
      { path: 'safety-check/stats', element: <StatsPage /> },
      { path: 'safety-check', element: <SafetyCheckPage /> },
    ],
  },
];

const router = createBrowserRouter([...publictRoutes, ...protectedLayout]);

// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  );
}

export default App;
