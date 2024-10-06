import { FaRegUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const FollowGrid = ({ people }) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 w-full">
        {people.map((person, i) => (
          <div
            key={i}
            className="w-full flex justify-between space-x-2 p-2 items-center bg-clip-border rounded-xl shadow-lg"
          >
            <div className="flex items-center space-x-2 m-0">
              <div className="w-12 h-12">
                {person.imageUrl ? (
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="w-full h-full !rounded-full"
                  />
                ) : (
                  <FaRegUserCircle className="w-full h-full !rounded-full" />
                )}
              </div>

              <p className="text-base text-black font-semibold">
                {person.name}
              </p>
            </div>

            <Link to={"/users/" + person._id}>
              <div className="m-2">
                <p className="text-sm  py-2 px-5 rounded-lg bg-blue-400 hover:opacity-75 text-white font-semibold">
                  View
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowGrid;
