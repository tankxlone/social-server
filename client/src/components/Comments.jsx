import { FaRegUserCircle, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDeleteCommentMutation } from "../slices/postsApiSlice";
import Loader from "./Loader";

const Comments = ({ post, isLoading, userId, refetch, toggleComments }) => {
  const [deleteComment] = useDeleteCommentMutation();

  const deleteCommentHandler = async (id) => {
    try {
      await deleteComment({
        _id: post._id,
        commentId: id,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error(error.message);
    }
  };

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    const timeFormatted = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });

    const dateFormatted = date.toLocaleDateString("en-US", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    });

    return `${timeFormatted}  ${dateFormatted}`;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {post.comments.map((comment, i) => (
            <div key={i} className="flex flex-col p-4">
              <div className="flex items-center">
                <div className="h-8 w-8 mr-2">
                  {comment.postedBy.imageUrl ? (
                    <img
                      src={comment.postedBy.imageUrl}
                      alt={comment.postedBy.name}
                      className="w-full h-full !rounded-full"
                    />
                  ) : (
                    <FaRegUserCircle className="w-full h-full" />
                  )}
                </div>
                <Link
                  to={"/users/" + comment.postedBy._id}
                  className="font-semibold"
                >
                  {comment.postedBy.name}
                </Link>
              </div>
              <div className="text-gray-700 flex flex-col my-2">
                <div className="space-x-2">
                  <p className="text-black text-sm font-semibold">
                    {comment.text}
                  </p>
                </div>

                <div className="flex items-center pt-1">
                  <p className="text-gray-500 text-xs font-semibold">
                    {formatTimestamp(comment.created)}
                  </p>
                  {userId === comment.postedBy._id && (
                    <button
                      onClick={() => deleteCommentHandler(comment._id)}
                      className="text-red-500 ml-2 text-sm"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default Comments;
