import { useSelector } from "react-redux";
import FindPeopleScreen from "./FindPeopleScreen.jsx";
import LoginScreen from "./LoginScreen.jsx";
import NewsFeedScreen from "./NewsfeedScreen.jsx";

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {userInfo ? (
        <div className="flex flex-col md:flex-row w-full h-full">
          <NewsFeedScreen />
          <FindPeopleScreen />
        </div>
      ) : (
        <>
          <LoginScreen />
        </>
      )}
    </>
  );
};

export default HomeScreen;
