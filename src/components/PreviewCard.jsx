import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";

function PreviewCard({ user }) {
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
        {
          withCredentials: true,
        },
      );

      // Update Redux store
      dispatch(addUser(res.data.data));

      // Success Toast
      toast.success("Profile saved successfully!", {
        position: "top-right",
        autoClose: 800,
      });
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Failed to save profile", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (!user) {
    return <div className="text-center mt-4">No user found</div>;
  }

  return (
    <div className="mt-[-16px]">
      <div className="flex justify-center items-center p-4">
        <div className="card bg-base-300 w-104 shadow-xl rounded-2xl overflow-hidden">
          {/* Image */}
          <figure className="h-80 w-full overflow-hidden">
            <img
              src={user.photoUrl || "https://via.placeholder.com/400x300"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          </figure>

          {/* Card Body */}
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>

            <p className="text-gray-400">
              {user.about || "No description available"}
            </p>

            <div className="mt-2 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Age:</span> {user.age || "N/A"}
              </p>

              <p>
                <span className="font-semibold">Gender:</span>{" "}
                {user.gender || "N/A"}
              </p>

              <div>
                <span className="font-semibold">Skills:</span>

                <div className="flex flex-wrap gap-2 mt-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="badge badge-primary badge-outline px-3 py-3"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No skills added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="card-actions justify-between mt-4">
              <button
                className="btn btn-success btn-outline flex-1 mr-2"
                onClick={saveProfile}
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewCard;
