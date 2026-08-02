import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";

function Requests() {
  const requests = useSelector((store) => store.requests || []);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );

      // Remove the reviewed request from the store so it disappears from the UI immediately
      dispatch(addRequests(requests.filter((request) => request._id !== _id)));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/user/requests/received`,
          { withCredentials: true }
        );

        dispatch(addRequests(data.data || []));
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };

    fetchRequests();
  }, [dispatch]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-center mb-10 text-5xl font-serif font-bold">
        Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-400 text-2xl font-serif">
          No requests found
        </p>
      ) : (
        <div
          className={
            requests.length === 1 || requests.length === 2
              ? "flex flex-wrap justify-center gap-6"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {requests.map((request) => {
            const user = request.fromUserId;

            return (
              <div
                key={request._id}
                className={`card bg-base-300 h-[520px] shadow-xl rounded-2xl overflow-hidden ${
                  requests.length === 1 || requests.length === 2
                    ? "w-full max-w-sm"
                    : "w-full"
                }`}
              >
                {/* Image */}
                <figure className="h-72 w-full flex-shrink-0 overflow-hidden">
                  <img
                    src={user?.photoUrl || "/default-avatar.png"}
                    alt={`${user?.firstName || "User"} ${
                      user?.lastName || ""
                    }`}
                    className="w-full h-full object-cover "
                  />
                </figure>

                {/* Card Body */}
                <div className="card-body flex flex-col justify-between p-4">
                  <div>
                    <h2 className="card-title text-lg font-bold truncate">
                      {user?.firstName} {user?.lastName}
                    </h2>

                    <p className="text-gray-400 text-xs mt-2 line-clamp-3 ">
                      {user?.about || "No description available."}
                    </p>

                    {/* Extra Info */}
                    <div className="mt-3 space-y-1 text-xs">
                      <p>
                        <span className="font-semibold">Age:</span> {user?.age || "N/A"}
                      </p>

                      <p>
                        <span className="font-semibold">Gender:</span> {user?.gender || "N/A"}
                      </p>

                      <div>
                        <span className="font-semibold">Skills:</span>

                        <div className="flex flex-wrap gap-1.5 mt-1.5 max-h-16 overflow-hidden">
                          {user?.skills?.length > 0 ? (
                            user.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="badge badge-primary badge-outline px-2 py-1.5 text-xs"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-xs">No skills added</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="card-actions justify-between mt-2">
                    <button
                      onClick={() => reviewRequest("rejected", request._id)}
                      className="btn btn-sm btn-error btn-outline flex-1"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => reviewRequest("accepted", request._id)}
                      className="btn btn-sm btn-success flex-1"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default Requests;