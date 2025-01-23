import { Post } from "@/Interfaces";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserProfile() {
  const [myPosts, setMyPosts] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${params.id}`);
        setMyPosts(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserPosts();
  }, [params.id]);

  return (
    <>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="w-40 h-40 rounded-full" />
        <div className="mt-2">
          <p className="text-3xl font-bold text-center lg:text-left">{myPosts?.user?.name}</p>
          <div className="flex items-center w-full mt-4 gap-x-4">
            <p className="text-lg font-semibold">{myPosts?.posts?.length} posts</p>
            <p className="text-lg font-semibold">40 followers</p>
            <p className="text-lg font-semibold">40 following</p>
          </div>
        </div>
      </div>
      <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
        {myPosts?.posts?.length > 0 &&
          myPosts?.posts?.map((post: Post, index: number) => {
            return (
              <div key={index}>
                <img src={post?.photo} alt="" className="max-w-40 max-h-40" id={String(index)} />
              </div>
            );
          })}
      </div>
    </>
  );
}
