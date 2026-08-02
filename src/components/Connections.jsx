import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

function Connections() {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnection = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  if (!connections) return;
  if (connections.length === 0) return <div> NO Connection Found</div>;
  return (
    <div className="p-6">
      <h1 className="text-center mb-8 text-5xl font-serif">Connections</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {connections.map((user, index) => (
          <div
            key={index}
            className="card bg-base-300 w-80 h-[400px] shadow-xl rounded-2xl overflow-hidden  overflow-hidden
             transition-all duration-300 ease-in-out
             hover:scale-105 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
          >
            {/* Image */}
            <figure className="h-64 w-full overflow-hidden">
              <img
                src={user.photoUrl || "https://via.placeholder.com/400x300"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-full h-full object-cover object-top"
              />
            </figure>

            {/* Card Body */}
            <div className="card-body flex flex-col justify-between">
              <div>
                <h2 className="card-title text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>

                <p className="text-sm font-mono mb-2">
                  {user.age || "N/A"},{" "}
                  {user.gender
                    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                    : "N/A"}
                </p>

                <p className="text-gray-400 text-sm overflow-hidden">
                  {user.about || "No description available"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Connections;
