import axios from "axios";
import React from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../utils/feedSlice";

function UserCard({ user }) {
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeFeed(userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <div className="text-center text-[#8A8FA3]">No user</div>;

  return (
    <div className="w-full max-w-[22rem] sm:max-w-sm mx-auto">
      <div className="rounded-2xl bg-[#14161D] border border-[#2A2E3A] shadow-2xl shadow-black/40 overflow-hidden">
        {/* Terminal chrome */}
        <div className="px-4 py-2.5 flex items-center gap-1.5 border-b border-[#2A2E3A]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C7A]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#F5C242]/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00D6A3]/70" />
          <span className="ml-2 text-xs font-mono text-[#565B6B] truncate">
            profile/{(user.firstName || "user").toLowerCase()}.json
          </span>
        </div>

        <figure className="h-64 sm:h-72 w-full overflow-hidden bg-[#1C1F29]">
          <img
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="p-5 flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#E7E9EE]">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm font-mono text-[#8A8FA3] mt-0.5">
              {user.age ? `${user.age} · ` : ""}{user.gender || ""}
            </p>
          </div>

          {user.about && (
            <p className="text-sm text-[#8A8FA3] leading-relaxed line-clamp-4">{user.about}</p>
          )}

          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.skills.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs font-mono px-2 py-1 rounded-md bg-[#7C6CFF]/10 text-[#A79BFF] border border-[#7C6CFF]/20"
                >
                  #{skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => handleSendRequest("ignored", user._id)}
              className="flex-1 py-2.5 rounded-lg border border-[#2A2E3A] text-sm font-medium text-[#8A8FA3] hover:border-[#FF5C7A]/50 hover:text-[#FF5C7A] active:scale-[0.98] transition-all"
            >
              Ignore
            </button>
            <button
              onClick={() => handleSendRequest("interested", user._id)}
              className="flex-1 py-2.5 rounded-lg bg-[#00D6A3] text-[#06231C] text-sm font-semibold hover:bg-[#00C296] active:scale-[0.98] transition-all"
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;