import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from "react-router-dom";



const Home = () => {
    const navigate = useNavigate();
  
    const SignOutComponent = () => {
        const signOut = useSignOut();
        signOut();
        navigate("/login");
    }
    
    return (
        <button onClick={SignOutComponent}>Sign Out</button>
    )
    
}

export default Home