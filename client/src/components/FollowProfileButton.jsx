import {
  useFollowMutation,
  useUnFollowMutation,
} from "../slices/usersApiSlice";
import Loader from "./Loader";

const FollowProfileButton = ({ following, setFollowing, id }) => {
  const [follow, { isLoading }] = useFollowMutation();
  const [unfollow, { isLoading: unfollowLoading }] = useUnFollowMutation();

  const unfollowClick = async () => {
    const unfollowId = id;
    await unfollow({ unfollowId });
    setFollowing(false);
  };

  const followClick = async () => {
    const followId = id;
    await follow({ followId });
    setFollowing(true);
  };

  return (
    <>
      {isLoading || unfollowLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {following ? (
            <button
              onClick={unfollowClick}
              className="bg-red-400 rounded-full py-2 px-4 text-md font-semibold  shadow"
            >
              Unfollow
            </button>
          ) : (
            <button
              onClick={followClick}
              className="bg-green-400 rounded-full py-2 px-4 text-md font-semibold  shadow"
            >
              Follow
            </button>
          )}
        </>
      )}
    </>
  );
};

export default FollowProfileButton;
