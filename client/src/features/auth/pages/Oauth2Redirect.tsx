import {useEffect} from "react";
import {useNavigate,useLocation} from "react-router-dom";
import {useAuth} from "../context/useAuth.tsx"

export default function Oauth2Redirect(){
    const navigate = useNavigate();
    const location = useLocation();
    const {login}=useAuth();

    const urlParams = new URLSearchParams(location.search);
    const token=urlParams.get('token');
    const error=urlParams.get('error');

    useEffect(() => {
        if(token){
            login(token);
            navigate("/dashboard",{replace:true});
        }else if(error){
            console.error("OAuth2 Error:", error);
            navigate("/login?error=oauth2_failed", { replace: true });
        }else{
            navigate("/login",{replace:true});
        }
    }, [navigate,location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-semibold">Authenticating...</h2>
            </div>
        </div>
    );

}