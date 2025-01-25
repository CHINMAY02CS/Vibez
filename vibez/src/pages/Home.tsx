import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Post } from "@/Interfaces";
import axios from "axios";
import { Heart, Smile, UserCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { CommentDetails } from "@/interfaces/Profile";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

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

      const newData = allPosts.map((post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setAllPosts(newData);
      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error add comment:", error);
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
                  {post?.postedBy?.Photo ? (
                    <img
                      src={post.postedBy.Photo}
                      alt=""
                      className="w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => navigate(`/user/${post?.postedBy?._id}`)}
                    />
                  ) : (
                    <UserCircle
                      className="w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => navigate(`/user/${post?.postedBy?._id}`)}
                    />
                  )}
                  <p className="cursor-pointer" onClick={() => navigate(`/user/${post?.postedBy?._id}`)}>
                    {post?.postedBy?.name}
                  </p>
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
                <AlertDialog>
                  <AlertDialogTrigger className="text-xs text-gray-500 hover:underline">
                    {post.comments?.length > 0 ? `View all ${post.comments.length} comments` : null}
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
                          {post.postedBy.Photo ? (
                            <img
                              src={post.postedBy.Photo}
                              alt="profile pic"
                              className="w-8 h-8 rounded-full cursor-pointer"
                              onClick={() => navigate(`/user/${post?.postedBy?._id}`)}
                            />
                          ) : (
                            <UserCircle
                              className="w-8 h-8 rounded-full cursor-pointer"
                              onClick={() => navigate(`/user/${post?.postedBy?._id}`)}
                            />
                          )}
                          <p className="cursor-pointer" onClick={() => navigate(`/user/${post?.postedBy?._id}`)}>
                            {post?.postedBy?.name}
                          </p>
                        </div>
                        <div className="pb-2 mt-2 overflow-y-auto border border-gray-100 max-h-52 lg:max-h-76">
                          {post.comments.length > 0 &&
                            post.comments.map((comment: CommentDetails, index) => {
                              return (
                                <div className="flex items-center p-2 gap-x-4" key={index}>
                                  {comment?.postedBy?.Photo ? (
                                    <img
                                      src={comment.postedBy.Photo}
                                      alt=""
                                      className="w-8 h-8 rounded-full cursor-pointer"
                                      onClick={() => navigate(`/user/${comment?.postedBy?._id}`)}
                                    />
                                  ) : (
                                    <UserCircle
                                      className="w-8 h-8 rounded-full cursor-pointer"
                                      onClick={() => navigate(`/user/${comment?.postedBy?._id}`)}
                                    />
                                  )}
                                  <div>
                                    <p
                                      className="text-sm font-bold cursor-pointer"
                                      onClick={() => navigate(`/user/${comment?.postedBy?._id}`)}
                                    >
                                      {comment?.postedBy?.name}
                                    </p>
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
              </CardFooter>
              <div className="flex items-center w-full p-4 pt-0">
                <Smile className="w-6 h-6 mr-2 cursor-pointer" />
                <div className="flex items-center w-full space-x-2">
                  <Input
                    type="text"
                    placeholder="Add your comment . . ."
                    value={comments[post._id] || ""}
                    className="border shadow-none"
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                  />
                  <Button type="submit" onClick={() => addComment(comments[post._id], post._id)}>
                    Comment
                  </Button>{" "}
                </div>
              </div>
            </Card>
          );
        })}
    </div>
  );
}
