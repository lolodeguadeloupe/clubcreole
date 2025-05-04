import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
      <button
        onClick={() => navigate("/club-creole")}
        className="bg-[#FF6B6B] text-white px-4 py-2 rounded-lg hover:bg-[#FF5252] transition-colors"
      >
        Club créole
      </button>
    </div>
  );
};

export default Navbar; 