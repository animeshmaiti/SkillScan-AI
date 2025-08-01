import Navbar from '~/components/Navbar';
import type { Route } from './+types/home';
import ResumeCard from '~/components/ResumeCard';
import { usePuterStore } from '~/lib/puter';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'SkillScan AI' },
    {
      name: 'description',
      content: 'Know your skills according to your resume and job requirements',
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const resumes = (await kv.list('resume:*', true)) as KVItem[];
        const parsedResumes = resumes?.map(
          (resume) => JSON.parse(resume.value) as Resume
        );
        setResumes(parsedResumes || []);
      } catch (error) {
        console.error('Failed to load resumes:', error);
      } finally {
        setLoadingResumes(false);
      }
    };
    loadResumes();
  }, [reloadFlag]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Application and Resume Ratings</h1>
          {resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {
          loadingResumes && (
            <div className='flex flex-col items-center justify-center'>
              <img src="/images/resume-scan-2.gif" className='w-[200px]' />
            </div>
          )
        }
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} onDelete={() => setReloadFlag((f) => !f)}/>
            ))}
          </div>
        )}
        {
          !loadingResumes && resumes?.length===0 && (
            <div className='flex flex-col items-center justify-center mt-10 gap-4'>
              <Link to='/upload' className='primary-button w-fit text-xl font-semibold'>
                Upload Resume
              </Link>
            </div>
          )
        }
      </section>
    </main>
  );
}
