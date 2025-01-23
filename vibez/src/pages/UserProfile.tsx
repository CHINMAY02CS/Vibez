import { Button } from "@/components/ui/button";
import { Post } from "@/Interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { initialProfileDetails, ProfileDetails } from "../interfaces/Profile";

export default function UserProfile() {
  const [userPosts, setUserPosts] = useState<{ user: ProfileDetails; posts: Post[] }>({
    user: initialProfileDetails,
    posts: [],
  });
  const [isFollow, setIsFollow] = useState(false);
  const [completed, setCompleted] = useState(false);
  const params = useParams();
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (user) {
          const response = await axios.get(`http://localhost:5000/user/${params.id}`);
          setUserPosts(response.data);
          setIsFollow(response.data?.user?.followers?.includes(JSON.parse(user)?._id));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserPosts().then(() => setCompleted(true));
  }, [params.id, isFollow]);

  const followUser = async (userId: string) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/follow",
        { followId: userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        },
      );

      console.log(response.data);
      setIsFollow(true);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/unfollow",
        { followId: userId + "s" },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        },
      );

      console.log(response.data);
      setIsFollow(false);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };

  return (
    <div>
      {completed ? (
        <>
          <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
            <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="w-40 h-40 rounded-full" />
            <div className="mt-2">
              <p className="text-3xl font-bold text-center lg:text-left">{userPosts?.user?.name}</p>
              <div className="flex items-center w-full mt-4 gap-x-4">
                <p className="text-lg font-semibold">{userPosts?.posts?.length} posts</p>
                <p className="text-lg font-semibold">{userPosts?.user?.followers?.length || 0} followers</p>
                <p className="text-lg font-semibold">{userPosts?.user?.following?.length || 0} following</p>
              </div>
              {isFollow ? (
                <Button className="mt-4 bg-yellow-500" onClick={() => unfollowUser(userPosts?.user?._id)}>
                  UnFollow
                </Button>
              ) : (
                <Button className="mt-4 bg-blue-600" onClick={() => followUser(userPosts?.user?._id)}>
                  Follow
                </Button>
              )}
            </div>
          </div>
          <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
            {userPosts?.posts?.length > 0 &&
              userPosts?.posts?.map((post: Post, index: number) => {
                return (
                  <div key={index}>
                    <img src={post?.photo} alt="" className="max-w-40 max-h-40" id={String(index)} />
                  </div>
                );
              })}
          </div>
        </>
      ) : (
        <div>Loading . . .</div>
      )}
    </div>
  );
}
