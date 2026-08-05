import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
function Connections() {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnection = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err.message);
    }
  };
  useEffect(() => {
    fetchConnection();
  }, []);
  if (!connections) return null;
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0D12] px-4 sm:px-6 py-8 sm:py-12">
      {" "}
      <div className="max-w-6xl mx-auto">
        {" "}
        <h1 className="text-center mb-8 sm:mb-10 text-3xl sm:text-4xl font-semibold text-[#E7E9EE]">
          {" "}
          Connections{" "}
        </h1>{" "}
        {connections.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-center py-16">
            {" "}
            <span className="font-mono text-3xl text-[#2A2E3A]">
              {"( )"}
            </span>{" "}
            <p className="text-[#8A8FA3] text-base">
              {" "}
              No connections yet — go say hi in the feed.{" "}
            </p>{" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {" "}
            {connections.map((user) => (
              <Link
                key={user._id}
                to={`/chat/${user._id}`}
                state={{
                  _id: user._id,
                  fullName: `${user.firstName} ${user.lastName}`,
                  photo: user.photoUrl,
                }}
                className="block"
              >
                {" "}
                <div className="rounded-2xl bg-[#14161D] border border-[#2A2E3A] shadow-xl shadow-black/30 overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#7C6CFF]/40 hover:shadow-[#7C6CFF]/10 cursor-pointer h-full">
                  {" "}
                  {/* Profile Image */}{" "}
                  <figure className="h-52 sm:h-56 w-full overflow-hidden bg-[#1C1F29]">
                    {" "}
                    <img
                      src={
                        user.photoUrl ||
                        "https://static.vecteezy.com/system/resources/previews/036/280/651/original/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg"
                      }
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover object-top"
                    />{" "}
                  </figure>{" "}
                  {/* User Info */}{" "}
                  <div className="p-4 flex flex-col gap-1.5">
                    {" "}
                    <h2 className="text-lg font-semibold text-[#E7E9EE] truncate">
                      {" "}
                      {user.firstName} {user.lastName}{" "}
                    </h2>{" "}
                    <p className="text-xs font-mono text-[#8A8FA3]">
                      {" "}
                      {user.age || "N/A"}{" "}
                      {user.gender
                        ? ` · ${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1)}`
                        : ""}{" "}
                    </p>{" "}
                    <p className="text-[#8A8FA3] text-sm line-clamp-2">
                      {" "}
                      {user.about || "No description available"}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </Link>
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
export default Connections;
