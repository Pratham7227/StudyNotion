import { useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link, matchPath, useLocation } from "react-router-dom";

import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropdown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();

  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [isSliderVisible, setIsSliderVisible] = useState(false);
  const [isCatalogHovered, setIsCatalogHovered] = useState(false);
  const [isCatalogClicked, setIsCatalogClicked] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    })();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  const toggleNavbar = () => {
    setIsNavbarVisible((prev) => !prev);
    setIsSliderVisible((prev) => !prev);
  };

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between md:flex-row">
        {/* Logo */}
        <Link to="/" className="">
          <img
            src={logo}
            alt="Logo"
            width={160}
            height={32}
            loading="lazy"
            className=""
          />
        </Link>
        {/* Navigation links */}
        <nav className={`hidden md:block`}>
          <ul className="flex flex-row gap-y-4 gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li
                key={index}
                onMouseEnter={() => setIsCatalogHovered(link.title === "Catalog")}
                onMouseLeave={() => setIsCatalogHovered(false)}
                onClick={() => link.title === "Catalog" && setIsCatalogClicked(!isCatalogClicked)}
              >
                {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      {(isCatalogHovered || isCatalogClicked) && (
                        <div className="absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-100 transition-all duration-150 lg:w-[300px]">
                          <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : subLinks.length ? (
                            <>
                              {subLinks
                                ?.filter((subLink) => subLink?.courses?.length > 0)
                                ?.map((subLink, i) => (
                                  <Link
                                    to={`/catalog/${subLink.name
                                      .split(" ")
                                      .join("-")
                                      .toLowerCase()}`}
                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                    key={i}
                                  >
                                    <p>{subLink.name}</p>
                                  </Link>
                                ))}
                            </>
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login / Signup / Dashboard */}
        <div className="hidden md:flex justify-center gap-1 md:items-center md:gap-x-4">
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                Sign up
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        <button className="hamburger mr-4 md:hidden" onClick={toggleNavbar}>
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>

      {/* Slider */}
      {isSliderVisible && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-75">
          <div className="fixed right-0 top-0 h-full w-3/4 max-w-xs bg-richblack-800 p-4">
            <button
              className="text-2xl text-richblack-100 mb-4"
              onClick={toggleNavbar}
            >
              &times;
            </button>
            <ul className="flex flex-col gap-y-4 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li
                  key={index}
                  className="border-b border-richblack-700 pb-2"
                  onClick={() => link.title === "Catalog" && setIsCatalogClicked(!isCatalogClicked)}
                >
                  {link.title === "Catalog" ? (
                    <>
                      <div
                        className={`group relative flex cursor-pointer items-center gap-1 ${
                          matchRoute("/catalog/:catalogName")
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        <p>{link.title}</p>
                        <BsChevronDown />
                        {(isCatalogHovered || isCatalogClicked) && (
                          <div className="absolute left-0 top-full z-[1000] w-full bg-richblack-700 p-4 text-richblack-100">
                            {loading ? (
                              <p className="text-center">Loading...</p>
                            ) : subLinks.length ? (
                              <>
                                {subLinks
                                  ?.filter((subLink) => subLink?.courses?.length > 0)
                                  ?.map((subLink, i) => (
                                    <Link
                                      to={`/catalog/${subLink.name
                                        .split(" ")
                                        .join("-")
                                        .toLowerCase()}`}
                                      className="block rounded-lg bg-transparent py-2 pl-2 hover:bg-richblack-50"
                                      key={i}
                                      onClick={toggleNavbar}
                                    >
                                      <p>{subLink.name}</p>
                                    </Link>
                                  ))}
                              </>
                            ) : (
                              <p className="text-center">No Courses Found</p>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <Link to={link?.path} onClick={toggleNavbar}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
              {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative mt-4">
                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}
              {token === null && (
                <Link to="/login">
                  <button className="mt-4 rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 w-full">
                    Log in
                  </button>
                </Link>
              )}
              {token === null && (
                <Link to="/signup">
                  <button className="mt-4 rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 w-full">
                    Sign up
                  </button>
                </Link>
              )}
              {token !== null && <ProfileDropdown />}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
