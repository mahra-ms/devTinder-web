import React from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

function Profile() {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <div className="min-h-[calc(100vh-64px)] bg-[#0B0D12]">
        <EditProfile user={user} />
      </div>
    )
  );
}

export default Profile;