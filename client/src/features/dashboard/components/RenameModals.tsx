// import Input from "../../../components/ui/Input.tsx";
// import Button from "../../../components/ui/Button.tsx";
// import { BiRename } from "react-icons/bi";
// import { useAuth } from "../../auth/context/useAuth.tsx";
// import axios from "axios";
// import { useState, type FormEvent } from "react";
//
// type RenameModalsProp = {
//   setOpen: (val: boolean) => void;
//   id: string | undefined;
//   onRename: (id: string, name: string) => void;
// };
//
// export default function RenameModals({
//   setOpen,
//   id,
//   onRename,
// }: RenameModalsProp) {
//   const { session } = useAuth();
//   const accessToken = session// 🔐 JWT
//
//   const [loading, setLoading] = useState(false);
//
//   async function renameProject(e: FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//
//     if (!id || !accessToken) return;
//
//     const formData = new FormData(e.currentTarget);
//     const name = formData.get("name")?.toString().trim();
//
//     if (!name) return;
//
//     try {
//       setLoading(true);
//
//       await axios.put(
//         `https://codevspace-aqhw.onrender.com/api/projects/${id}`,
//         { projectName: name },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`, // 🔐 REQUIRED
//           },
//         }
//       );
//
//       onRename(id, name);
//       console.log("✅ Project renamed");
//     } catch (err) {
//       console.error("❌ Rename failed:", err);
//     } finally {
//       setLoading(false);
//       setOpen(false);
//     }
//   }
//
//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
//       {/* Modal Container */}
//       <div className="bg-[#1a1a1a] rounded-xl p-6 w-[90%] max-w-md relative shadow-lg">
//         {/* Close Button */}
//         <button
//           onClick={() => setOpen(false)}
//           className="absolute top-3 right-3 text-white text-lg hover:text-red-400"
//           aria-label="Close modal"
//         >
//           ×
//         </button>
//
//         {/* Form */}
//         <form onSubmit={renameProject} className="space-y-4">
//           <label htmlFor="name" className="block text-white font-medium">
//             Enter New Project Name
//           </label>
//
//           <Input
//             id="name"
//             name="name"
//             type="text"
//             placeholder="New project name"
//           />
//
//           <Button
//             disabled={loading}
//             type="submit"
//             className="w-full h-8 flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
//             ) : (
//               <>
//                 <BiRename size={16} />
//                 Rename
//               </>
//             )}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
