import useSignOut from "react-auth-kit/hooks/useSignOut";

const SignOutComponent = () => {
  const signOut = useSignOut();

  const handleSignOut = () => {
    signOut();
    window.location.reload();
  };

  return (
    <button
      type="button"
      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      onClick={handleSignOut}
    >
      <span className="sr-only">Sign out</span>
      Sign out
    </button>
  );
};

export default SignOutComponent;
