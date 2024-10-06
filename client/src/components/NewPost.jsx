import { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { LuPencilLine } from "react-icons/lu";
import { MdOutlineInsertPhoto } from "react-icons/md";
import { useSelector } from "react-redux";
import ReactTextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import { useCreatePostMutation } from "../slices/postsApiSlice";
import { useGetUserDetailsQuery } from "../slices/usersApiSlice";
import Loader from "./Loader";

const NewPost = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: user, isLoading: userLoading } = useGetUserDetailsQuery(
    userInfo._id
  );

  const [createPost, { isLoading: postLoading }] = useCreatePostMutation();

  const clickPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("text", text);
    formData.append("postedBy", userInfo._id);
    formData.append("id", userInfo._id);

    try {
      await createPost({
        formData,
      }).unwrap();

      toast.success("Post created successfully");
      setImage("");
      setText("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      {userLoading ? (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className=" bg-white shadow-lg rounded-xl bg-clip-border px-4 py-2 m-2 my-4">
          <div className="flex flex-col items-center space-x-2 mt-2 w-full">
            {image ? (
              <div className="relative max-w-full rounded-lg shadow max-h-full p-2">
                <img
                  alt="profile"
                  className="w-full h-full object-contain rounded-lg"
                  fill
                  src={URL.createObjectURL(image)}
                />
              </div>
            ) : null}

            <div className="flex items-center space-x-2 mt-2 w-full">
              <div className="h-7 w-8 rounded-full">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className=" h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <FaRegUserCircle className="h-full w-full rounded-full" />
                )}
              </div>

              <div className="w-full">
                <ReactTextareaAutosize
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full resize-none appearance-none overflow-hidden  focus:outline-none text-sm font-semibold text-black rounded-full  bg-gray-100 shadow outline-gray-400 p-2.5 "
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between my-2">
            <div className="pl-10">
              <label className="flex items-center mt-2 hover:cursor-pointer w-max">
                <MdOutlineInsertPhoto className="w-6 h-6 text-green-500" />
                <span className="pl-2 text-sm font-bold text-black hover:opacity-75">
                  Photo
                </span>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  id="icon-button-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>

            {postLoading ? (
              <Loader />
            ) : (
              <div>
                <button
                  className="flex items-center space-x-3 mt-2 disabled:text-gray-500 text-blue-500 hover:cursor-pointer hover:opacity-80"
                  disabled={text === ""}
                  onClick={clickPost}
                >
                  <div className=" rounded-full text-blue-500">
                    <LuPencilLine />
                  </div>
                  <p className=" text-sm font-bold">Create Post</p>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NewPost;
