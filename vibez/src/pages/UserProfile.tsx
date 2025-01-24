import { Button } from "@/components/ui/button";
import { Post } from "@/Interfaces";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CommentDetails, initialProfileDetails, ProfileDetails } from "../interfaces/Profile";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Heart, Smile, UserCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function UserProfile() {
  const [userPosts, setUserPosts] = useState<{ user: ProfileDetails; posts: Post[] }>({
    user: initialProfileDetails,
    posts: [],
  });
  const [alertOpen, setAlertOpen] = useState(false);
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

  const [comments, setComments] = useState<{ [key: string]: string }>({});

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
      console.error(error, "Please try again");
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/unfollow",
        { followId: userId },
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
      console.error(error, "Please try again");
    }
  };

  const setPostInDialog = async (id: string) => {
    try {
      const post = userPosts.posts.find((p: Post) => p._id === id);
      if (post) {
        setOpenPost(post);

        setAlertOpen(true);
      } else {
        console.error("Post not found!");
      }
    } catch (error) {
      console.error(error, "Please try again");
    }
  };

  const [openPost, setOpenPost] = useState<Post>();

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

      const newData = userPosts.posts.map((post: Post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setUserPosts((prev) => ({ ...prev, posts: newData }));

      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }
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

      const newData = userPosts.posts.map((post: Post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setUserPosts((prev) => ({ ...prev, posts: newData }));

      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }
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

      const newData = userPosts.posts.map((post: Post) => {
        if (post._id === updatedPost._id) {
          return updatedPost;
        }
        return post;
      });

      setUserPosts((prev) => ({ ...prev, posts: newData }));

      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }

      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }
  const sameUser = params.id === JSON.parse(user)._id;
  return (
    <div>
      {completed ? (
        <>
          <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
            {userPosts?.user?.Photo ? (
              <img src={userPosts.user.Photo} alt="" className="w-40 h-40 rounded-full" />
            ) : (
              <UserCircle className="w-40 h-40 rounded-full cursor-pointer fill-white" />
            )}
            <div className="mt-2">
              <p className="text-3xl font-bold text-center lg:text-left">{userPosts?.user?.name}</p>
              <div className="flex items-center w-full mt-4 gap-x-4">
                <p className="text-lg font-semibold">{userPosts?.posts?.length} posts</p>
                <p className="text-lg font-semibold">{userPosts?.user?.followers?.length || 0} followers</p>
                <p className="text-lg font-semibold">{userPosts?.user?.following?.length || 0} following</p>
              </div>
              {!sameUser && (
                <>
                  {isFollow ? (
                    <Button className="mt-4 bg-yellow-500" onClick={() => unfollowUser(userPosts?.user?._id)}>
                      UnFollow
                    </Button>
                  ) : (
                    <Button className="mt-4 bg-blue-600" onClick={() => followUser(userPosts?.user?._id)}>
                      Follow
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
            {userPosts?.posts?.length > 0 &&
              userPosts?.posts?.map((post: Post) => {
                return (
                  <img
                    src={post?.photo}
                    alt="post pic"
                    className="duration-300 cursor-pointer max-w-40 max-h-40 hover:scale-105"
                    id={post._id}
                    onClick={() => setPostInDialog(post._id)}
                  />
                );
              })}
          </div>
          {openPost && (
            <PostDetails
              alertOpen={alertOpen}
              setAlertOpen={setAlertOpen}
              post={openPost}
              likePost={likePost}
              addComment={addComment}
              comments={comments}
              unlikePost={unlikePost}
              setComments={setComments}
            />
          )}
        </>
      ) : (
        <div>Loading . . .</div>
      )}
    </div>
  );
}

const PostDetails = ({
  alertOpen,
  setAlertOpen,
  post,
  likePost,
  addComment,
  comments,
  setComments,
  unlikePost,
}: {
  alertOpen: boolean;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  post: Post;
  comments: any;
  setComments: any;
  likePost: (id: string) => void;
  unlikePost: (id: string) => void;
  addComment: (text: string, id: string) => void;
}) => {
  const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;
  const navigate = useNavigate();

  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} key={post._id}>
      <AlertDialogContent className="px-3 py-0 rounded-lg max-h-176 lg:max-w-240 lg:max-h-none">
        <div className="flex items-end justify-end">
          <AlertDialogCancel className="p-0 m-0 border-none shadow-none max-w-max">
            <X className="w-4 h-4" />{" "}
          </AlertDialogCancel>
        </div>
        <div className="grid items-start lg:grid-cols-2 gap-x-4">
          <div className="flex items-center justify-between p-2 mb-2 -mt-4 border border-gray-200 rounded-sm lg:hidden">
            <div
              className="flex items-center gap-x-4"
              onClick={() => {
                navigate(`/user/${post?.postedBy?._id}`);
                setAlertOpen(false);
              }}
            >
              {post?.postedBy?.Photo ? (
                <img src={post.postedBy.Photo} alt="" className="w-8 h-8 rounded-full cursor-pointer" />
              ) : (
                <UserCircle className="w-8 h-8 rounded-full cursor-pointer" />
              )}
              <p className="cursor-pointer">{post?.postedBy?.name}</p>
            </div>
          </div>
          <img className="h-80 w-120" src={post?.photo} />
          {/* right card */}
          <div>
            <div className="items-center justify-between hidden p-2 mt-2 border border-gray-200 rounded-sm lg:flex lg:mt-0">
              <div
                className="flex items-center gap-x-4"
                onClick={() => {
                  navigate(`/user/${post?.postedBy?._id}`);
                  setAlertOpen(false);
                }}
              >
                {post?.postedBy?.Photo ? (
                  <img src={post.postedBy.Photo} alt="" className="w-8 h-8 rounded-full cursor-pointer" />
                ) : (
                  <UserCircle className="w-8 h-8 rounded-full cursor-pointer" />
                )}
                <p className="cursor-pointer">{post?.postedBy?.name}</p>
              </div>
            </div>
            {post?.comments?.length > 0 && (
              <div className="pb-2 mt-2 overflow-y-auto border border-gray-100 max-h-52 lg:max-h-76">
                {post.comments.map((comment: CommentDetails, index: number) => {
                  return (
                    <div className="flex items-center p-2 gap-x-4" id={String(index)} key={index}>
                      {comment?.postedBy?.Photo ? (
                        <img
                          src={comment.postedBy.Photo}
                          alt=""
                          className="w-8 h-8 rounded-full cursor-pointer"
                          onClick={() => {
                            navigate(`/user/${comment?.postedBy?._id}`);
                            setAlertOpen(false);
                          }}
                        />
                      ) : (
                        <UserCircle className="w-8 h-8 rounded-full cursor-pointer" />
                      )}
                      <div>
                        <p
                          className="text-sm font-bold cursor-pointer"
                          onClick={() => {
                            navigate(`/user/${comment?.postedBy?._id}`);
                            setAlertOpen(false);
                          }}
                        >
                          {comment?.postedBy?.name}
                        </p>
                        <p className="text-xs cursor-pointer">{comment.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex items-center w-full p-3 px-1 gap-x-4">
              <div className="flex items-center gap-x-1">
                {post?.likes?.includes(userId) ? (
                  <Heart
                    className="w-6 h-6 font-normal text-red-600 cursor-pointer fill-red-600"
                    onClick={() => unlikePost(post._id)}
                  />
                ) : (
                  <Heart className="w-6 h-6 font-normal cursor-pointer" onClick={() => likePost(post._id)} />
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
                  <Button type="submit" onClick={() => addComment(comments[post._id], post._id)} className="h-8">
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
  );
};
