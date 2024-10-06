import { useSelector } from "react-redux";
import NewPost from "../components/NewPost";
import PostList from "../components/PostList";
import { useListNewsFeedQuery } from "../slices/postsApiSlice";

const NewsFeedScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: posts,
    isLoading,
    refetch,
  } = useListNewsFeedQuery(userInfo._id);

  return (
    <div className="w-full md:w-4/5">
      <NewPost />
      <PostList posts={posts} isLoading={isLoading} refetch={refetch} />
    </div>
  );
};

export default NewsFeedScreen;
