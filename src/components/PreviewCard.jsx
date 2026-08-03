import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";

function PreviewCard({ user, className = "" }) {
  const dispatch = useDispatch();

  const saveProfile = async () => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl,
          age: Number(user.age),
          gender: user.gender,
          about: user.about,
          skills: user.skills,
        },
        { withCredentials: true },
      );

      dispatch(addUser(res.data.data));
      toast.success("Profile saved successfully!", { position: "top-right", autoClose: 800 });
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to save profile", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!user) {
    return <div className="text-center mt-4 text-[#8A8FA3]">No user found</div>;
  }

  return (
    <div className={`w-full max-w-sm mx-auto h-full flex flex-col rounded-2xl bg-[#14161D] border border-[#2A2E3A] shadow-2xl shadow-black/40 overflow-hidden ${className}`}>
      <div className="px-4 py-2.5 flex items-center gap-1.5 border-b border-[#2A2E3A]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C7A]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#F5C242]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#00D6A3]/70" />
        <span className="ml-2 text-xs font-mono text-[#565B6B] truncate">preview.tsx</span>
      </div>

      <figure className="h-60 sm:h-72 w-full shrink-0 overflow-hidden bg-[#1C1F29]">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#565B6B] text-sm font-mono">
            no photo yet
          </div>
        )}
      </figure>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h2 className="text-xl font-semibold text-[#E7E9EE]">
          {user.firstName || "First"} {user.lastName || "Last"}
        </h2>

        <p className="text-sm text-[#8A8FA3] leading-relaxed">
          {user.about || "No description available"}
        </p>

        <div className="flex gap-4 text-sm text-[#8A8FA3]">
          <span><span className="font-medium text-[#E7E9EE]">Age</span> {user.age || "N/A"}</span>
          <span><span className="font-medium text-[#E7E9EE]">Gender</span> {user.gender || "N/A"}</span>
        </div>

        {user.skills && user.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="text-xs font-mono px-2 py-1 rounded-md bg-[#7C6CFF]/10 text-[#A79BFF] border border-[#7C6CFF]/20"
              >
                #{skill}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-[#565B6B] font-mono">no skills added</span>
        )}

        <button
          className="w-full mt-auto pt-2 py-2.5 rounded-lg bg-[#00D6A3] text-[#06231C] text-sm font-semibold hover:bg-[#00C296] active:scale-[0.98] transition-all"
          onClick={saveProfile}
        >
          Save profile
        </button>
      </div>
    </div>
  );
}

export default PreviewCard;