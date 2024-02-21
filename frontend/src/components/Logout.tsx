import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from "react-router-dom";


const SignOutComponent = () => {
    const signOut = useSignOut();
    const navigate = useNavigate();

    const handleSignOut = () => {
        signOut();
        navigate("/login");
    };

    return (
        <button onClick={handleSignOut}>Sign Out</button>
    );
};

export default SignOutComponent