import { useState } from "react";
import { FaRegCommentDots, FaRegUserCircle, FaTrash } from "react-icons/fa";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { IoMdSend } from "react-icons/io";
import { Link } from "react-router-dom";
import ReactTextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import {
  useCommentPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
} from "../slices/postsApiSlice";
import { useGetUserDetailsQuery } from "../slices/usersApiSlice";
import Comments from "./Comments";
import Loader from "./Loader";

const Post = ({ post, userId, refetch }) => {
  const [likePost] = useLikePostMutation();
  const [UnlikePost] = useUnlikePostMutation();
  const [showComments, setShowComments] = useState(false);

  const checkLike = post && post.likes.includes(userId);

  const toggleComments = () => setShowComments(!showComments);

  const clickLike = async () => {
    try {
      if (!checkLike) {
        await likePost({
          _id: post._id,
          userId,
        }).unwrap();
      } else {
        await UnlikePost({
          _id: post._id,
          userId,
        }).unwrap();
      }
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const [deletePost, { isLoading: deleteLoading }] = useDeletePostMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        await deletePost(id);
      } catch (err) {
        console.error(err?.data?.message || err.error);
      }
    }
    toast.success("Post deleted successfully");
    refetch();
  };

  const { data: user, isLoading } = useGetUserDetailsQuery(userId);
  const [commentPost] = useCommentPostMutation();

  const [text, setText] = useState("");

  const addComment = async (event) => {
    try {
      event.preventDefault();
      await commentPost({
        _id: post._id,
        comment: {
          text,
        },
        userId,
      }).unwrap();
      refetch();
      setText("");
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className=" bg-white text-black bg-clip-border shadow-lg rounded-xl px-4 py-2 m-2 my-4">
          <div className=" text-black font-medium items-center my-2 w-full">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex space-x-3">
                <div className="h-12 w-12 rounded-full">
                  {post.postedBy.imageUrl ? (
                    <img
                      src={post.postedBy.imageUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full "
                    />
                  ) : (
                    <FaRegUserCircle className="w-full h-full rounded-full" />
                  )}
                </div>
                <div className="pt-1">
                  <h4 className="text-xl font-bold hover:opacity-75">
                    <Link to={`/users/${post.postedBy._id}`}>
                      {post.postedBy.name}
                    </Link>
                  </h4>
                </div>
              </div>

              {deleteLoading ? (
                <Loader />
              ) : (
                <div>
                  <button
                    onClick={() => deleteHandler(post._id)}
                    className="text-red-500"
                  >
                    {post.postedBy._id === userId && <FaTrash />}
                  </button>
                </div>
              )}
            </div>

            {post.image && (
              <div className="mt-4 overflow-hidden w-full h-full  text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
                <img
                  className="object-fill w-full h-full"
                  src={post.imageUrl}
                  alt={post.text}
                />
              </div>
            )}
            <p className="mt-4 font-semibold">{post.text}</p>

            <div className="flex items-center space-x-6 my-2">
              <div className="flex items-center space-x-2">
                <button onClick={clickLike} className="text-red-500">
                  {checkLike ? (
                    <FcLike size={24} />
                  ) : (
                    <FcLikePlaceholder size={24} />
                  )}
                </button>
                <span className="font-semibold">{post.likes.length}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="text-red-500 transition"
                  onClick={toggleComments}
                >
                  <FaRegCommentDots size={24} />
                </button>
                <span className="font-semibold">{post.comments.length}</span>
              </div>
            </div>

            {showComments && (
              <div className="rounded-xl shadow-lg bg-clip-border">
                <Comments
                  post={post}
                  userId={userId}
                  refetch={refetch}
                  isLoading={isLoading}
                />
              </div>
            )}

            <div className="flex text-black font-medium items-center my-4 w-full">
              <div className="h-9 w-10 rounded-full">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className=" h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <FaRegUserCircle className="h-full w-full rounded-full" />
                )}
              </div>
              <div className="relative w-full ml-2">
                <ReactTextareaAutosize
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your comment"
                  className="w-full font-semibold text-sm py-4 px-6 text-black rounded-full bg-gray-100 border-none  p-2.5 focus:outline-none resize-none appearance-none overflow-hidden"
                />
                <p className=" absolute top-4 right-4 " onClick={addComment}>
                  <IoMdSend className="w-5 h-5 text-blue-500 cursor-pointer" />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Post;
