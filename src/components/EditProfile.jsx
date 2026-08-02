import React, { useState } from "react";
import PreviewCard from "./PreviewCard";

function EditProfile({ user, onSave }) {
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [skills, setSkills] = useState(
  Array.isArray(user?.skills)
    ? user.skills.join(", ")
    : user?.skills || ""
);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      return setError("First name and last name are required.");
    }

    if (age && (age < 1 || age > 120)) {
      return setError("Please enter a valid age.");
    }

    const updatedUser = {
      firstName,
      lastName,
      photoUrl,
      age: Number(age),
      gender,
      about,
      skills: skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);

      // Call parent function if provided
      if (onSave) {
        await onSave(updatedUser);
      }

      console.log("Profile saved:", updatedUser);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start gap-8 p-6">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 border border-base-300 rounded-2xl p-6 shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold text-center mb-2">Edit Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="fieldset">
              <label className="label">First Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <label className="label">Last Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </fieldset>
          </div>

          <div>
            <label className="label font-medium">Photo URL</label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://example.com/photo.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="label font-medium">Gender</label>
            <select
              className="select select-bordered w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="label font-medium">Age</label>
            <input
              type="number"
              min="1"
              max="120"
              className="input input-bordered w-full"
              placeholder="25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div>
            <label className="label font-medium">About</label>
            <textarea
              className="textarea textarea-bordered w-full h-28 resize-none"
              placeholder="Tell us something about yourself..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          <div>
            <label className="label font-medium">Skills</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="React, Node.js, MongoDB"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
      </div>

      {/* Live Preview */}
      <PreviewCard
        user={{
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        }}
      />
    </div>
  );
}

export default EditProfile;
