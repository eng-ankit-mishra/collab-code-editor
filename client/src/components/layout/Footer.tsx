import { FaGithub } from "react-icons/fa";


export default function Footer(){
  return(
    <footer className="w-full bg-gray-950 flex items-center justify-between px-6 text-gray-400 border-t border-t-white/5">
        <span className="text-center py-2 text-sm  text-gray-400 tracking-wide">
         Copyright © 2025 CoDevSpace
        </span>
  <a
    href="https://github.com/eng-ankit-mishra/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 hover:text-white"
  >
    <FaGithub size={16} />
    Follow on GitHub
  </a>


        <a href="mailto:developer.ankitmishra@gmail.com" className="text-center py-2 text-sm   text-gray-400 tracking-wide cursor-pointer">
          contact@ankitmishra.pro
        </a>
      </footer>
  )
}
