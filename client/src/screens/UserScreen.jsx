import { useEffect, useState } from "react";
import { FaEdit, FaRegUserCircle, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import FollowGrid from "../components/FollowGrid";
import FollowProfileButton from "../components/FollowProfileButton";
import Loader from "../components/Loader";
import PostList from "../components/PostList";
import { logout } from "../slices/authSlice";
import { useListByUserQuery } from "../slices/postsApiSlice";
import {
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useLogoutMutation,
} from "../slices/usersApiSlice";

const UserScreen = () => {
  const { id: userId } = useParams();

  const [following, setFollowing] = useState(false);

  const [selected, setSelected] = useState("followers");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const { data: user, isLoading } = useGetUserDetailsQuery(userId);

  const {
    data: posts,
    isLoading: postIsLoading,
    refetch: postsRefetch,
  } = useListByUserQuery(userId);

  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        await deleteUser(id);
        await logoutApiCall().unwrap();
        dispatch(logout());
      } catch (err) {
        console.error(err?.data?.message || err.error);
      }
    }
  };

  useEffect(() => {
    const checkFollow = () => {
      if (user && user.followers && userInfo && userInfo._id) {
        const match = user.followers.some((follower) => {
          return follower._id === userInfo._id;
        });
        setFollowing(match);
      }
    };

    checkFollow();
  }, [user, userInfo]);

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full">
            <div className="bg-white m-2 rounded-xl shadow-lg p-4 bg-clip-border">
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <ul>
                <li className="flex items-center mb-4">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <FaRegUserCircle className="w-10 h-10" />
                  )}
                  <div className="ml-4 truncate">
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                  {user.email === userInfo.email ? (
                    <div className="ml-auto flex items-center">
                      <button className="p-2 text-blue-500 hover:text-blue-700">
                        <Link to="/profile">
                          <FaEdit />
                        </Link>
                      </button>
                      <button onClick={() => deleteHandler(user._id)}>
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <div className="ml-auto flex items-center">
                      <FollowProfileButton
                        following={following}
                        id={userId}
                        setFollowing={setFollowing}
                      />
                    </div>
                  )}
                </li>
                <hr className="my-4" />
                <li>
                  <p className=" text-base text-gray-500 font-semibold">
                    {user.about}
                  </p>
                  <p className="text-md font-semibold">
                    Joined:{" "}
                    {new Date(user.createdAt).toISOString().split("T")[0]}
                  </p>
                </li>
              </ul>
            </div>

            <hr className="my-4" />

            <div className=" bg-white p-4 m-2 rounded-xl bg-clip-border shadow-lg ">
              <div className="flex space-x-2 p-3  border-gray-300 mb-2 rounded-lg text-base font-bold justify-around">
                <button
                  className={
                    selected === "followers"
                      ? "px-5 py-1 rounded-xl bg-gray-200 shadow-lg bg-clip-border"
                      : "hover:opacity-75"
                  }
                  onClick={() => setSelected("followers")}
                >
                  Followers
                </button>
                <button
                  className={
                    selected === "following"
                      ? "px-5 py-1 rounded-xl bg-gray-200 shadow-lg bg-clip-border"
                      : "hover:opacity-75"
                  }
                  onClick={() => setSelected("following")}
                >
                  Following
                </button>
                <button
                  className={
                    selected === "posts"
                      ? "px-5 py-1 rounded-xl bg-gray-200 shadow-lg bg-clip-border"
                      : "hover:opacity-75"
                  }
                  onClick={() => setSelected("posts")}
                >
                  Posts
                </button>
              </div>
              {selected === "followers" && (
                <div>
                  <FollowGrid people={user.followers} />
                </div>
              )}
              {selected === "following" && (
                <div>
                  <FollowGrid people={user.following} />
                </div>
              )}
              {selected === "posts" && (
                <div>
                  <PostList
                    posts={posts}
                    isLoading={postIsLoading}
                    refetch={postsRefetch}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserScreen;
