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
      await axios.post(BASE_URL + "/request/review/" + status + "/" + _id, {}, { withCredentials: true });
      dispatch(addRequests(requests.filter((request) => request._id !== _id)));
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
        dispatch(addRequests(data.data || []));
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    };
    fetchRequests();
  }, [dispatch]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0D12] px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center mb-8 sm:mb-10 text-3xl sm:text-4xl font-semibold text-[#E7E9EE]">
          Requests
        </h1>

        {requests.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-center py-16">
            <span className="font-mono text-3xl text-[#2A2E3A]">{"[ ]"}</span>
            <p className="text-[#8A8FA3] text-base">No pending requests right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {requests.map((request) => {
              const user = request.fromUserId;
              return (
                <div
                  key={request._id}
                  className="rounded-2xl bg-[#14161D] border border-[#2A2E3A] shadow-xl shadow-black/30 overflow-hidden flex flex-col"
                >
                  <figure className="h-56 sm:h-64 w-full overflow-hidden bg-[#1C1F29]">
                    <img
                      src={user?.photoUrl || "/default-avatar.png"}
                      alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                      className="w-full h-full object-cover"
                    />
                  </figure>

                  <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-[#E7E9EE] truncate">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-[#8A8FA3] text-xs mt-1.5 line-clamp-3">
                        {user?.about || "No description available."}
                      </p>

                      <div className="mt-3 flex gap-3 text-xs text-[#8A8FA3]">
                        <span>{user?.age || "N/A"}</span>
                        <span>{user?.gender || "N/A"}</span>
                      </div>

                      {user?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {user.skills.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#7C6CFF]/10 text-[#A79BFF] border border-[#7C6CFF]/20"
                            >
                              #{skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2.5 mt-1">
                      <button
                        onClick={() => reviewRequest("rejected", request._id)}
                        className="flex-1 py-2 rounded-lg border border-[#2A2E3A] text-xs font-medium text-[#8A8FA3] hover:border-[#FF5C7A]/50 hover:text-[#FF5C7A] active:scale-[0.98] transition-all"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => reviewRequest("accepted", request._id)}
                        className="flex-1 py-2 rounded-lg bg-[#00D6A3] text-[#06231C] text-xs font-semibold hover:bg-[#00C296] active:scale-[0.98] transition-all"
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
    </div>
  );
}

export default Requests;