import { useClickAway } from "@uidotdev/usehooks";
import { useState } from "react";
import { FaBars, FaHome } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/usersApiSlice";

const Header = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
      toggleMenu();
    } catch (error) {
      console.error(error);
    }
  };

  const ref = useClickAway(() => {
    setMenuVisible(false);
  });

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <header>
      <nav className="bg-gray-900 font-semibold">
        <div className="flex items-center justify-between p-4">
          <div>
            <Link to="/" className=" text-2xl flex items-center">
              <FaHome className="mr-3 h-6 text-white" />
            </Link>
          </div>
          <div className="hidden md:block">
            {userInfo ? (
              <>
                <Link
                  to={"/users/" + userInfo._id}
                  className="text-gray-300 hover:bg-gray-700 rounded-md  px-3 py-2"
                >
                  {userInfo.name}
                </Link>
                <Link
                  className="text-gray-300 hover:bg-gray-700 rounded-md  px-3 py-2"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-gray-300 hover:bg-gray-700 rounded-md  px-3 py-2"
                >
                  SIGN UP
                </Link>
                <Link
                  to="/login"
                  className="text-gray-300 hover:bg-gray-700 rounded-md  px-3 py-2"
                >
                  SIGN IN
                </Link>
              </>
            )}
          </div>
          <div ref={ref} className=" md:hidden relative ml-3">
            <button
              className="md:hidden text-gray-300 hover:bg-gray-700 rounded-md  px-3 py-2"
              onClick={toggleMenu}
            >
              <FaBars />
            </button>

            {menuVisible && (
              <div className="md:hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userInfo ? (
                  <>
                    <Link
                      to={"/users/" + userInfo._id}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md "
                      onClick={toggleMenu}
                    >
                      {userInfo.name}
                    </Link>
                    <Link
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md "
                      onClick={logoutHandler}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md "
                      onClick={toggleMenu}
                    >
                      SIGN UP
                    </Link>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md "
                      onClick={toggleMenu}
                    >
                      SIGN IN
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
