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
    Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || "",
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
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      setLoading(true);
      if (onSave) await onSave(updatedUser);
      console.log("Profile saved:", updatedUser);
    } catch (err) {
      setError(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClasses =
    "w-full rounded-lg bg-[#1C1F29] border border-[#2A2E3A] px-3.5 py-2.5 text-sm text-[#E7E9EE] placeholder:text-[#565B6B] outline-none focus:border-[#7C6CFF] focus:ring-1 focus:ring-[#7C6CFF] transition-colors";
  const labelClasses = "block text-xs font-medium text-[#8A8FA3] mb-1.5";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0D12] px-4 py-8 sm:py-2">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-1">
        <div className="w-full h-full flex flex-col">
          <p className="text-xs font-mono text-[#565B6B] mb-2 text-center lg:text-left">edit</p>
          <form
            onSubmit={handleSubmit}
            className="bg-[#14161D] border border-[#2A2E3A] rounded-2xl p-5 sm:p-7 shadow-2xl shadow-black/40 space-y-4 flex-1 flex flex-col"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#E7E9EE]">Edit profile</h2>
              <p className="text-sm text-[#8A8FA3] mt-1">Keep it current — it's the first thing people see.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>First name</label>
                <input
                  type="text"
                  className={fieldClasses}
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Last name</label>
                <input
                  type="text"
                  className={fieldClasses}
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Photo URL</label>
              <input
                type="url"
                className={fieldClasses}
                placeholder="https://example.com/photo.jpg"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Gender</label>
                <select
                  className={fieldClasses}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  className={fieldClasses}
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>About</label>
              <textarea
                className={`${fieldClasses} h-28 resize-none`}
                placeholder="Tell us something about yourself..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div>
              <label className={labelClasses}>Skills</label>
              <input
                type="text"
                className={fieldClasses}
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
              <p className="text-xs text-[#565B6B] mt-1.5">Comma-separated — shows up as tags on your card.</p>
            </div>

            {error && (
              <p className="text-[#FF5C7A] text-sm bg-[#FF5C7A]/10 border border-[#FF5C7A]/20 rounded-lg py-2 px-3">
                {error}
              </p>
            )}

          </form>
        </div>

        {/* Live Preview */}
        <div className="w-full h-full flex flex-col">
          <p className="text-xs font-mono text-[#565B6B] mb-2 text-center lg:text-left">live preview</p>
          <PreviewCard
            className="flex-1"
            user={{
              firstName,
              lastName,
              photoUrl,
              age,
              gender,
              about,
              skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditProfile;