import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// 우리가 만든 레이아웃 및 페이지 컴포넌트들을 모두 가져옵니다.
import Layout from "./components/layout/Layout";
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import ProfileCreationPage from "./pages/profile/ProfileCreationPage";

// Layout 컴포넌트로 자식 페이지들을 감싸주는 역할을 하는 컴포넌트
const AppLayout = () => (
  <Layout>
    {/* Outlet은 자식 경로의 컴포넌트가 렌더링될 자리를 의미. */}
    <Outlet />
  </Layout>
);

// 라우터 설정을 정의
const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/find-password",
        element: <FindPasswordPage />,
      },
      {
        path: "/profile/create", // ← 추가
        element: <ProfileCreationPage />,
      },
    ],
  },
]);

// 최종적으로 라우터 설정을 앱에 적용
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" reverseOrder={false} />{" "}
    </>
  );
}

export default App;
