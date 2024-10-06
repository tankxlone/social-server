import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import {
  useGetUserDetailsQuery,
  useProfileMutation,
} from "../slices/usersApiSlice";

const ProfileScreen = () => {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [about, setAbout] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const {
    data: user,
    isLoading,
    refetch,
  } = useGetUserDetailsQuery(userInfo._id);

  useEffect(() => {
    if (user) {
      setImageUrl(user.imageUrl);
      setName(userInfo.name);
      setEmail(userInfo.email);
      setAbout(userInfo.about);
    }
  }, [user, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("name", name);
    formData.append("email", email);
    formData.append("about", about);
    formData.append("password", password);
    formData.append("_id", userInfo._id);

    if (password !== confirmPassword) {
      toast.error("Password do not match");
    } else {
      try {
        const res = await updateProfile({
          formData,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
    refetch();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex font-semibold justify-between mx-auto w-2/5 items-center flex-col">
          <form
            onSubmit={submitHandler}
            className="my-4 flex flex-col space-y-6 w-full text-slate-500"
          >
            <div className="flex items-center justify-center md:mr-20 mb-16 ">
              <label className="flex items-center mt-2 hover:cursor-pointer w-max">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-full"
                  />
                ) : image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-full"
                  />
                ) : (
                  <FaRegUserCircle className="w-20 h-20 rounded-full" />
                )}
                <input
                  type="file"
                  id="icon-button-file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>

            <div className="my-2 block mb-2  text-gray-900">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>

            <div className="my-2 block mb-2  text-gray-900">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>

            <div className="my-2 block mb-2  text-gray-900">
              <label htmlFor="about">About</label>
              <textarea
                placeholder="Enter description"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none"
              />
            </div>

            <div className="my-2 block mb-2  text-gray-900">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>

            <div className="my-2 block mb-2  text-gray-900">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white w-max rounded-full px-4 py-2 mt-2"
              disabled={loadingUpdateProfile}
            >
              Update
            </button>
            {loadingUpdateProfile && (
              <div>
                <div className="flex items-center justify-center">
                  <Loader />
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default ProfileScreen;
