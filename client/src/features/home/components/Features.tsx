import { FiUsers } from 'react-icons/fi';
import { BsKeyboard } from 'react-icons/bs';
import { HiOutlineAcademicCap } from 'react-icons/hi';

export default function Features() {
  const features = [
    {
      id: 1,
      title: "Real-Time Team Collaboration",
      description:
        "Code together with your team or friends in real time, from anywhere. Instantly see changes, follow collaborators' cursors, and avoid merge conflicts with seamless live editing.",
      icon: <FiUsers className="text-4xl text-blue-300" />
    },
    {
      id: 2,
      title: "Live Coding Interviews",
      description:
        "Conduct technical interviews in a shared coding environment. Interviewers and candidates can solve problems collaboratively, review code instantly, and communicate effectively.",
      icon: <BsKeyboard className="text-4xl text-blue-300" />
    },
    {
      id: 3,
      title: "Remote Learning & Mentorship",
      description:
        "Empower virtual classrooms and mentorship with live code sharing. Instructors and learners can work on the same code, ask questions, and solve problems together in real time.",
      icon: <HiOutlineAcademicCap className="text-4xl text-blue-300" />
    }
  ];

  return (
    <main className=" min-h-screen  bg-gradient-to-br from-gray-900 via-zinc-900 to-neutral-900 py-8 text-white">
      <div className="flex flex-col items-center justify-center gap-y-20 max-w-7xl mx-auto mt-4 text-center">
        <div>
          <h2 className="text-2xl md:text-4xl mb-1 font-bold">
          Collaborate, Interview, and Learn—All in One Place
        </h2>
          <p className="text-gray-400 text-[17px] mb-8">A seamless coding experience for teams, interviews, and classrooms.</p>
           <div className="w-20 h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-blue-600  rounded-lg mx-auto  mb-12 hover:w-32 transition duration-500" />
        </div>
        
       
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  place-items-center gap-20 ">
          {features.map(({ id, title, description, icon }) => (
            <div
              key={id}
              className="bg-zinc-800 border border-white/10 rounded-2xl w-full max-w-sm p-5 hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out"
            >
              <div className="mb-3 flex items-center justify-center"><div className='bg-blue-500/10 rounded-full p-4'>{icon}</div></div>
              <h3 className="text-xl font-semibold text-center mb-2">{title}</h3>
              <p className="text-white/80 text-[15px] text-center tracking-wide leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
