import { useState } from 'react';
import Navlink from './Navlink';
import Home from '../../../assets/home.svg?react';
import Search from '/src/assets/search.svg?react';
import Plus from '/src/assets/plus.svg?react';
import Community from '/src/assets/community.svg?react';
import My from '/src/assets/my.svg?react';
import Modal from '../../Plus/Modal';
import { useGetUnreadMessages } from '../../../hooks/mypage/useGetUnreadMessages';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: unreadMessagesData } = useGetUnreadMessages();

  const handlePlusClick = () => {
    setIsModalOpen(true);
  };

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] flex justify-between px-12.5 py-3 z-100 bg-[#fffffd] rounded-t-2xl shadow-[0px_-2px_12px_0px_rgba(0,0,0,0.08)] pb-8">
      <Navlink to="/" Icon={Home} alt="홈" />
      <Navlink to="/search" Icon={Search} alt="탐색" />
      <button onClick={handlePlusClick} className="cursor-pointer">
        <Plus className="w-10 h-10" aria-label="더보기" />
      </button>
      <Navlink to="/community" Icon={Community} alt="커뮤니티" />
      <div className="relative">
        <Navlink to="/mypage" Icon={My} alt="마이" />
        {unreadMessagesData?.result && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </div>
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </nav>
  );
};

export default Navbar;
