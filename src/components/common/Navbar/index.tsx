import Navlink from './Navlink';
import Home from '../../../assets/home.svg?react';
import Search from '/src/assets/search.svg?react';
import Plus from '/src/assets/plus.svg?react';
import Community from '/src/assets/community.svg?react';
import My from '/src/assets/my.svg?react';

const Navbar = () => {
  return (
    <nav className="w-full flex justify-between px-12.5 py-3 z-100 bg-[#fffffd] rounded-t-2xl shadow-[0px_-2px_12px_0px_rgba(0,0,0,0.08)] pb-8">
      <Navlink to="/" Icon={Home} alt="홈" />
      <Navlink to="/search" Icon={Search} alt="탐색" />
      <Navlink to="/else" Icon={Plus} alt="더보기" />
      <Navlink to="/community" Icon={Community} alt="커뮤니티" />
      <Navlink to="/my" Icon={My} alt="마이" />
    </nav>
  );
};

export default Navbar;
