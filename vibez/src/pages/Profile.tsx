import axios from "axios";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Heart, Smile, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Post } from "@/Interfaces";

export default function Profile() {
  const [myPosts, setMyPosts] = useState([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    axios
      .get(
        "http://localhost:5000/get-my-posts",

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
            "Content-Type": "application/json",
          },
        },
      )
      .then((res) => {
        console.log(res, "fetch");
        setMyPosts(res.data);
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

      const newData = myPosts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setMyPosts(newData);
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

      const newData = myPosts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setMyPosts(newData);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function addComment(text: string, id: string) {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        console.error("Authorization token not found!");
        return;
      }

      const response = await axios.put(
        "http://localhost:5000/comment",
        {
          text: text,
          postId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedPost = response.data;

      const newData = myPosts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });
      toast({
        title: "Comment added successfully",
        variant: "success",
      });
      setMyPosts(newData);
      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error add comment:", error);
    }
  }

  const userName = JSON.parse(localStorage.getItem("user") ?? "").name;
  const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;

  console.log(myPosts, "myposts");
  return (
    <>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="w-40 h-40 rounded-full" />
        <div className="mt-2">
          <p className="text-3xl font-bold text-center lg:text-left">{userName}</p>
          <div className="flex items-center w-full mt-4 gap-x-4">
            <p className="text-lg font-semibold">40 posts</p>
            <p className="text-lg font-semibold">40 followers</p>
            <p className="text-lg font-semibold">40 following</p>
          </div>
        </div>
      </div>
      <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
        {myPosts.length > 0 &&
          myPosts.map((post: Post, index) => {
            return (
              <>
                <AlertDialog>
                  <AlertDialogTrigger className="text-xs text-gray-500 hover:underline">
                    <img src={post?.photo} alt="" className="max-w-40 max-h-40" id={String(index)} />
                  </AlertDialogTrigger>
                  <AlertDialogContent className="px-3 py-0 rounded-lg max-h-176 lg:max-w-240 lg:max-h-none">
                    <div className="flex items-end justify-end">
                      <AlertDialogCancel className="p-0 m-0 border-none shadow-none max-w-max">
                        <X className="w-4 h-4" />{" "}
                      </AlertDialogCancel>
                    </div>
                    <div className="grid items-start lg:grid-cols-2 gap-x-4">
                      <img className="h-80 w-120" src={post?.photo} />
                      {/* right card */}
                      <div>
                        <div className="flex items-center p-2 border border-gray-200 rounded-sm gap-x-4">
                          <img
                            src={"https://avatars.githubusercontent.com/u/98474924?v=4"}
                            alt=""
                            className="w-8 h-8 rounded-full cursor-pointer"
                          />
                          <p className="cursor-pointer">{post?.postedBy?.name}</p>
                        </div>
                        <div className="pb-2 mt-2 overflow-y-auto border border-gray-100 max-h-52 lg:max-h-76">
                          {post.comments.length > 0 &&
                            post.comments.map((comment) => {
                              console.log(comment, "comment mapped");
                              return (
                                <div className="flex items-center p-2 gap-x-4">
                                  <img src={""} alt="" className="w-8 h-8 rounded-full cursor-pointer" />
                                  <div>
                                    <p className="text-sm font-bold cursor-pointer">{comment?.postedBy?.name}</p>
                                    <p className="text-xs cursor-pointer">{comment.comment}</p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="flex items-center w-full p-3 px-1 gap-x-4">
                          <div className="flex items-center gap-x-1">
                            {post.likes.includes(userId) ? (
                              <Heart
                                className="w-6 h-6 font-normal text-red-600 cursor-pointer fill-red-600"
                                onClick={() => unlikePost(post._id)}
                              />
                            ) : (
                              <Heart
                                className="w-6 h-6 font-normal cursor-pointer"
                                onClick={() => likePost(post._id)}
                              />
                            )}
                            <p className="mt-1.5 text-xs">{post?.likes ? post.likes.length : "0"}</p>
                          </div>
                          <div className="flex items-center w-full">
                            <Smile className="w-4 h-4 mr-2 cursor-pointer" />
                            <div className="flex items-center w-full space-x-2">
                              <Input
                                type="text"
                                placeholder="Add your comment . . ."
                                value={comments[post._id] || ""}
                                className="h-8 border shadow-none placeholder:text-xs"
                                onChange={(e) =>
                                  setComments((prev) => ({
                                    ...prev,
                                    [post._id]: e.target.value,
                                  }))
                                }
                              />
                              <Button
                                type="submit"
                                onClick={() => addComment(comments[post._id], post._id)}
                                className="h-8"
                              >
                                Add
                              </Button>
                            </div>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            );
          })}
      </div>
    </>
  );
}
