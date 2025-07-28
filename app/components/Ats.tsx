import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const Ats:React.FC<ATSProps> = ({score,suggestions}) => {
  return (
    <div>Ats</div>
  )
}

export default Ats