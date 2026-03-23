
import type { IconType } from "react-icons";

export type Language = {
  id: number;
  name: string;
  alias:string,
  icon?: IconType;
  color?: string;
  boilerplate: string;
};


export type NavbarProp={
  authRequired?:boolean,
  shareRequired?:boolean,
  projectName?:string
}

export type ModalProps={
  setShowModals: (val: boolean) => void;
  create: (val:ProjectDetails)=> Promise<string | undefined>; 
}

export type Collaborators={
  userId:string;
  role:string
}

 // @ts-ignore
// enum ProjectRole  {
//    OWNER,
//   EDITOR,
//    VIEWER,
// }



export type ProjectDetails = {
  id?: string;
  name: string;
  description: string;
  language: Language;
  codeContent: string;
  collaborators?: Collaborators[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type DashboardProjects={
  id:string;
  name: string;
  language: Language;
  permission: string;
  ownerName: string,
  ownershipStatus:string;
  updatedAt: Date;

}

export interface RecentCardProps {
  projects: DashboardProjects[];
  onDelete?:(val:string)=>void
  onRename?:(id:string,val:string)=>void
}

export type DashboardOutlet={
  projects:DashboardProjects[],
  setProjects:(projects:DashboardProjects)=>void
  setShowModals:(val:boolean)=>void
  handleDelete:(val:string)=>void
  handleRename:(id:string,val:string)=>void
}


export type codeAreaProps = {
  projectObject: ProjectDetails;
  accessRole?: "OWNER" | "EDITOR" | "VIEWER";
};

export type AuthContextType = {
  session: string | null;
  login:(email:string)=>void;
  logout: () => void;
  userDetail:UserDetail | null;
};

export type MenuProps={
  setShowModals:(val:boolean)=>void
}
export type AvatarProps={
  name:string | undefined
  size?:number
  url:string
}

export type Invitation = {
  projectId: string;
  projectName: string;
  language:Language;
  permission:string;
  invitedBy:string;
};

export type UserDetail={
  id:string,
  name: string,
  email: string,
  avatarURL: string,
}

export type ChatMessage={
  id:string,
  projectId:string,
  senderId:string,
  senderName:string,
  content:string,
  createdAt:Date,
}