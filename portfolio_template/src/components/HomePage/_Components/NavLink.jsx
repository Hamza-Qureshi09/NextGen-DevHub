import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="block py-2 pl-3 pr-4 text-[#c7cfd5] sm:text-lg rounded md:p-0 hover:text-white font-Poppins md:bg-transparent border border-gray-600 md:border-none"
    >
      {title}
    </Link>
  );
};

export default NavLink;
