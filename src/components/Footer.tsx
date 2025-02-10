import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-black py-4 font-['Netflix_Sans','Helvetica_Neue',Helvetica,Arial,sans-serif]">
      <div className="container mx-auto px-4 text-center">
        <p className="text-[#666666] text-[13px] font-light">
          <Link to="/legal" className="hover:text-gray-400 transition-colors">
            CinePlay does not host any files, it only links to 3rd party services.
          </Link>
        </p>
        <p className="text-[#999999] text-[13px] mt-1 font-light">
          © 2025 CinePlay. Made with ❤ by the CinePlay team
        </p>
      </div>
    </footer>
  );
};

export default Footer; 