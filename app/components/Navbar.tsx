import { Link } from 'react-router';
import { usePuterStore } from '~/lib/puter';

const Navbar = () => {
  const { auth } = usePuterStore();
  return (
    <nav className="navbar">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">SkillScan AI</p>
      </Link>
      <div className='flex items-center gap-4'>
        <Link to="/upload" className="primary-button hover:primary-gradient-hover w-fit">
          Upload resume
        </Link>
        <button className="secondary-button hover:secondary-gradient-hover w-fit" onClick={() => auth.signOut()}>
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
