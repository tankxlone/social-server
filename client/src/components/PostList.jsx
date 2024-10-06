import { useSelector } from "react-redux";
import Loader from "./Loader";
import Post from "./Post";

const PostList = ({ posts = [], isLoading, refetch }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col">
      {isLoading ? (
        <>
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-2 mx-2 bg-clip-border">
          {posts.length === 0 ? (
            <p className="flex items-center text-xl font-semibold justify-center">
              Nothing to show
            </p>
          ) : (
            posts.map((item, i) => (
              <Post
                post={item}
                key={i}
                userId={userInfo._id}
                refetch={refetch}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PostList;
