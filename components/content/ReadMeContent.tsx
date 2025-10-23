"use client";

import React from "react";

const ReadMeContent: React.FC = () => (
  <div className="font-mono text-sm whitespace-pre-wrap select-text text-gray-900 bg-gray-50 p-4 border-2 border-gray-400 shadow-inner rounded-sm">
    <div>{`README.TXT
==========

Hi there! 👋 I'm Naresh Ram
---------------------------

💫 ABOUT ME
- 🔭 Currently working on MERN Stack applications
- 👯 Open to collaborating on MERN Stack projects
- 🤝 Looking for help with Flutter
- 🌱 Currently learning GoLang
- 💬 Ask me about Next.js

🌍 SOCIALS
- LinkedIn: https://linkedin.com/in/nareshram1
- Instagram: https://instagram.com/Nareshram1
- GitHub: https://github.com/Nareshram1

💻 TECH STACK
==============
Languages:
- C, C++, Java, JavaScript, TypeScript, GoLang, Python

Frontend:
- HTML5, CSS3, React, Next.js, React Native, Bootstrap, MUI, DaisyUI

Backend:
- Node.js, Express.js, FastAPI, Flask

Databases:
- PostgreSQL, MongoDB, Redis, Supabase, Firebase

Tools & Platforms:
- Docker, Git, GitHub, Jira, Render, Vercel, Netlify, Google Cloud, Anaconda

📊 GITHUB STATS
==============`}</div>

    <div className="flex flex-col items-start space-y-3 mt-2">
      {[
        "https://github-readme-stats.vercel.app/api?username=Nareshram1&theme=radical&hide_border=false&include_all_commits=true&count_private=true",
        "https://github-readme-streak-stats.herokuapp.com/?user=Nareshram1&theme=radical&hide_border=false",
        "https://github-readme-stats.vercel.app/api/top-langs/?username=Nareshram1&theme=radical&hide_border=false&include_all_commits=true&count_private=true&layout=compact",
        "https://github-profile-trophy.vercel.app/?username=Nareshram1&theme=radical&no-frame=true&no-bg=true&margin-w=4",
      ].map((src, i) => (
        <div
          key={i}
          className="border-2 border-gray-500 bg-gray-200 p-1 shadow-[2px_2px_0_#888] rounded-sm w-full max-w-md"
        >
          <img
            src={src}
            alt="GitHub Stat"
            className="w-full object-contain mix-blend-multiply"
          />
        </div>
      ))}
    </div>

    <div className="mt-3">{`TOP CONTRIBUTED REPOS
=====================`}</div>

    <div className="border-2 border-gray-500 bg-gray-200 p-1 shadow-[2px_2px_0_#888] rounded-sm w-full max-w-md mt-1">
      <img
        src="https://github-contributor-stats.vercel.app/api?username=Nareshram1&limit=5&theme=dark&combine_all_yearly_contributions=true"
        alt="Top Contributed Repos"
        className="w-full object-contain mix-blend-multiply"
      />
    </div>


    <div className="mt-4">{`
Naresh Ram,
Location: Tamil Nadu, India
Favorite OS: Windows 98 (of course!)
`}</div>
  </div>
);

export default ReadMeContent;
