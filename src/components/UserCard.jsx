import React from "react";

function UserCard({ user }) {
  console.log(user, "data from card");

  if (!user) return <div>No user</div>;

  return (
    <div className="flex justify-center items-center p-4">
      <div className="card bg-base-300 w-104 shadow-xl rounded-2xl overflow-hidden">
        {/* Image */}
        <figure className="h-80 w-full overflow-hidden">
          <img
            src={user.photoUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        </figure>

        {/* Card Body */}
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>

          {/* About */}
          <p className="text-gray-400">{user.about}</p>

          {/* Extra Info */}
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <span className="font-semibold">Age:</span> {user.age}
            </p>

            <p>
              <span className="font-semibold">Gender:</span> {user.gender}
            </p>

            <div>
              <span className="font-semibold">Skills:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="badge badge-primary badge-outline px-3 py-3"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="card-actions justify-between mt-4">
            <button className="btn btn-error btn-outline flex-1 mr-2">
              Ignore
            </button>

            <button className="btn btn-success flex-1 ml-2">
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;