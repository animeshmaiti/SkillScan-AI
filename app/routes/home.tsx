import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { useState } from "react";
import { resumes } from "../../constants";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "SkillScan AI" },
    { name: "description", content: "Know your skills according to your resume and job requirements" },
  ];
}

export default function Home() {
  // const [resumes,setResumes]=useState<Resume[]>([]);
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track Your Application and Resume Ratings</h1>
        <h2>Review your submissions and check AI-powered feedback.</h2>
      </div>
      {
        resumes.length > 0 && (
          <div className="resumes-section">
            {
              resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))
            }
          </div>
        )
      }
    </section>
  </main>;
}
