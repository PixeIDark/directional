import { PATHS } from "../router/path.ts";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

function Header({ title, children }: HeaderProps) {
  const location = useLocation();
  console.log(location);

  return (
    <div className="mb-4 flex w-full items-center justify-between">
      <Link to={PATHS.HOME} className="flex items-center gap-1">
        <img src="/icon/home.svg" alt="home icon" className="w-8" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </Link>
      {children}
    </div>
  );
}

export default Header;
