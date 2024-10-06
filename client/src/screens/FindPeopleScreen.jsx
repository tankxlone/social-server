import { FaRegUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useFindPeopleQuery, useFollowMutation } from "../slices/usersApiSlice";

const FindPeopleScreen = () => {
  const [follow] = useFollowMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo._id;
  const { data: users, isLoading } = useFindPeopleQuery(userId);

  const clickFollow = async (user) => {
    const followId = user._id;
    try {
      await follow({ followId });
      toast.success(`Following ${user.name}!`);

      // Show toast message for a duration, then reload the page
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Adjust the time (in milliseconds) as needed
    } catch (error) {
      toast.error("Failed to follow the user."); // Display an error toast message if follow action fails
    }
  };
  return (
    <>
      <div className=" max-w-full bg-white p-2 overflow-hidden h-full rounded-xl shadow-lg m-2 my-4">
        <h1 className="text-xl font-black">Suggested For you</h1>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : !users.length ? (
          <>
            <div className="flex items-center justify-center font-semibold p-2 mt-2">
              No users to follow
            </div>
          </>
        ) : (
          <div className=" flex md:flex-col gap-3 max-w-max  bg-white p-2 overflow-hidden h-full bg-clip-border">
            {users.map((user, i) => (
              <div
                key={i}
                className="rounded-md p-2 flex flex-col md:flex-row space-y-2 md:space-y-0  justify-between border border-gray-200 shadow items-center"
              >
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mt-2 rounded-full w-8 h-8">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <FaRegUserCircle className="w-full h-full" />
                    )}
                  </div>
                  <Link to={`/users/${user._id}`}>
                    <div className="text-sm md:pl-2 font-black hover:opacity-70">
                      {user.name.split(" ")[0]}
                    </div>
                  </Link>
                </div>

                <div
                  className="text-blue-500 hover:opacity-70 flex text-sm font-semibold px-2  hover:cursor-pointer"
                  onClick={() => clickFollow(user)}
                >
                  Follow
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FindPeopleScreen;
