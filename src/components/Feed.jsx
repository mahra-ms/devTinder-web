import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
      dispatch(addFeed(res.data.users));
    } catch (err) {
      console.error("Feed error:", err.response?.status, err.response?.data);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed || feed.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="font-mono text-3xl text-[#2A2E3A]">{"{ }"}</span>
        <h1 className="text-lg font-medium text-[#E7E9EE]">No one new to show right now</h1>
        <p className="text-sm text-[#8A8FA3]">Check back later for more devs to connect with.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 sm:py-12">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;