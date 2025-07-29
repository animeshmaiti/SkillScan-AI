import { Link } from 'react-router';
import ScoreCircle from './ScoreCircle';
import React, { useEffect, useState } from 'react';
import { usePuterStore } from '~/lib/puter';

const ResumeCard = ({
  resume: { id, companyName, jobTitle, feedback, imagePath,resumePath },
  onDelete,
}: {
  resume: Resume;
  onDelete?: () => void;
}) => {
  const { fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');
  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
  }, [imagePath]);
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    // Delete files: main resume file and the image
    await fs.delete(resumePath);
    await fs.delete(imagePath);
    // Delete metadata from kv store
    await kv.del(`resume:${id}`);
    // Notify parent to refresh
    if (onDelete) onDelete();
  };
  return (
    <Link
      to={`/resume/${id}`}
      className="relative resume-card animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {companyName && (
            <h2 className="!text-black font-bold break-words">{companyName}</h2>
          )}
          {jobTitle && (
            <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
          )}
          {!companyName && !jobTitle && (
            <h2 className="!text-black font-bold">Resume</h2>
          )}
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback.overallScore} />
        </div>
        <button
          className="absolute top-2 right-2 p-1 rounded hover:bg-red-100 transition cursor-pointer"
          title="Delete Resume"
          onClick={handleDelete}
        >
          <img src="/icons/trash.svg" alt="Delete" className="w-6 h-6" />
        </button>
      </div>
      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
