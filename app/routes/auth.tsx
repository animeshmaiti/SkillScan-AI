import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';

export const meta = () => [
  { title: 'SkillScan AI | Authentication' },
  {
    name: 'description',
    content: 'Login or register to access SkillScan AI features.',
  },
];
const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next]);
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Please log in or register to continue</h2>
          </div>
          {isLoading ? (
            <button className="auth-button animate-pulse">
              Signing you in...
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button 
                  className="auth-button" 
                  onClick={() => {
                    auth.signOut();
                    navigate('/');
                   }}
                >
                  <p>Log Out</p>
                </button>
              ) : (
                <button className="auth-button" onClick={auth.signIn}>Log In</button>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Auth;
