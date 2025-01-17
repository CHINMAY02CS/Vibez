import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Post } from "@/Interfaces";
import axios from "axios";
import { Heart, Smile } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/get-all-posts",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        setAllPosts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  async function likePost(id: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/like",
        { postId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedPost = response.data;

      const newData = allPosts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setAllPosts(newData);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function unlikePost(id: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/unlike",
        { postId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedPost = response.data;

      const newData = allPosts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setAllPosts(newData);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {allPosts.length > 0 &&
        allPosts.map((post, index) => {
          return (
            <Card className="md:w-120" key={index}>
              <CardHeader className="p-4 border-b">
                <CardTitle className="flex items-center gap-x-4">
                  <img
                    src={"https://avatars.githubusercontent.com/u/98474924?v=4"}
                    alt=""
                    className="w-8 h-8 rounded-full cursor-pointer"
                  />
                  <p className="cursor-pointer">{post?.postedBy?.name}</p>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 m-0 h-80">
                <img className="h-80 w-120" src={post?.photo} />
              </CardContent>
              <CardFooter className="flex-col items-start p-4 gap-y-2">
                <div className="flex gap-x-1">
                  {post.likes.includes(userId) ? (
                    <Heart
                      className="w-6 h-6 font-normal text-red-600 cursor-pointer fill-red-600"
                      onClick={() => unlikePost(post._id)}
                    />
                  ) : (
                    <Heart className="w-6 h-6 font-normal cursor-pointer" onClick={() => likePost(post._id)} />
                  )}
                  <p className="mt-1.5 text-xs">{post?.likes ? post.likes.length : "0"} Likes</p>
                </div>
                {post?.body}
              </CardFooter>
              <div className="flex items-center w-full p-4 pt-0">
                <Smile className="w-6 h-6 mr-2 cursor-pointer" />
                <div className="flex items-center w-full space-x-2">
                  <Input type="email" placeholder="Add your comment . . ." className="border shadow-none" />
                  <Button type="submit" className="">
                    Comment
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
}
