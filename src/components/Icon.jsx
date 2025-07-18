import {
  FiSearch,
  FiX,
  FiStar,
  FiClock,
  FiUser,
  FiFilm,
  FiChevronLeft,
} from "react-icons/fi";

export const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    search: <FiSearch className={className} />,
    close: <FiX className={className} />,
    star: <FiStar className={className} />,
    clock: <FiClock className={className} />,
    user: <FiUser className={className} />,
    film: <FiFilm className={className} />,
    back: <FiChevronLeft className={className} />,
    // Add more icons as needed
  };

  return icons[name] || <FiFilm className={className} />;
};
