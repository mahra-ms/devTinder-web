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
      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true, 
      });

      console.log(res.data);

      dispatch(addFeed(res.data.users));
    } catch (err) {
      console.error(
        "Feed error:",
        err.response?.status,
        err.response?.data
      );
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feed || feed.length === 0) {
    return <h1 className="text-center mt-10">No feed available</h1>;
  }

  return (
    <div>
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;