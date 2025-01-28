import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Post } from "@/Interfaces";
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
import { addCommentService, getAllPostsService, likePostService, unlikePostService } from "@/services/posts";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  function updatePostsData(updatedPost: Post) {
    const newData = allPosts.map((post) => {
      if (post._id === updatedPost._id) {
        return updatedPost;
      }
      return post;
    });
    setAllPosts(newData);
  }

  const fetchPosts = async () => {
    try {
      const posts = await getAllPostsService();
      setAllPosts(posts);
    } catch (err) {
      console.error(err);
    }
  };

  async function likePost(id: string) {
    try {
      const updatedPost = await likePostService(id);
      updatePostsData(updatedPost);
    } catch (error) {
      console.error(error);
    }
  }

  async function unlikePost(id: string) {
    try {
      const updatedPost = await unlikePostService(id);
      updatePostsData(updatedPost);
    } catch (error) {
      console.error(error);
    }
  }

  async function addComment(text: string, id: string) {
    try {
      const updatedPost = await addCommentService(text, id);
      updatePostsData(updatedPost);
      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {allPosts.length > 0 &&
        allPosts.map((post) => {
          const postId = post?._id;
          const postOwner = post?.postedBy;
          const isLiked = post?.likes?.includes(userId) || false;
          const filteredComments = post?.comments?.filter((comment: CommentDetails) => comment.comment);
          return (
            <Card className="md:w-120" key={post._id}>
              {/* User pic and name */}
              <CardHeader className="p-4 border-b">
                <CardTitle className="flex items-center gap-x-4">
                  <UserIconPic
                    path={postOwner?._id}
                    src={postOwner?.Photo || ""}
                    showImage={postOwner?.Photo ? true : false}
                  />
                  <p className="cursor-pointer" onClick={() => navigate(`/user/${postOwner?._id}`)}>
                    {postOwner?.name}
                  </p>
                </CardTitle>
              </CardHeader>
              {/* Post Card */}
              <CardContent className="p-0 m-0 h-80">
                <img className="h-80 w-120" src={post?.photo} alt="postedPic" />
              </CardContent>
              <CardFooter className="flex-col items-start p-4 gap-y-2">
                <LikeButton
                  totalLikes={post?.likes?.length || "0"}
                  showLabel
                  isLiked={isLiked}
                  onClick={() => (isLiked ? unlikePost(postId) : likePost(postId))}
                />
                {post?.body}
                {/* Post details dialog */}
                <AlertDialog>
                  <AlertDialogTrigger className="text-xs text-gray-500 hover:underline">
                    {post.comments?.length > 0 ? `View all ${filteredComments.length} comments` : null}
                  </AlertDialogTrigger>
                  <AlertDialogContent className="px-3 py-0 rounded-lg max-h-176 lg:max-w-240 lg:max-h-none">
                    <div className="flex items-end justify-end">
                      <AlertDialogCancel className="p-0 m-0 border-none shadow-none max-w-max">
                        <X className="w-4 h-4" />{" "}
                      </AlertDialogCancel>
                    </div>
                    <div className="flex items-center p-2 -mt-6 border border-gray-200 rounded-sm gap-x-4">
                      <UserIconPic
                        showImage={postOwner?.Photo ? true : false}
                        src={post.postedBy.Photo || ""}
                        path={postOwner?._id}
                      />
                      <p className="cursor-pointer" onClick={() => navigate(`/user/${postOwner?._id}`)}>
                        {postOwner?.name}
                      </p>
                    </div>
                    <div className="grid items-start lg:grid-cols-2 gap-x-4">
                      <img className="h-80 w-120" src={post?.photo} />
                      {/* right card */}
                      <div>
                        <div className="pb-2 mt-2 overflow-y-auto border border-gray-100 lg:mt-0 max-h-52 lg:max-h-76">
                          {post.comments.length > 0 &&
                            filteredComments.map((comment: CommentDetails, index) => {
                              const commentOwner = comment?.postedBy;
                              return (
                                <div className="flex items-center p-2 gap-x-4" key={index}>
                                  <UserIconPic
                                    showImage={commentOwner?.Photo ? true : false}
                                    src={comment.postedBy.Photo || ""}
                                    path={commentOwner?._id}
                                  />
                                  <div>
                                    <p
                                      className="text-sm font-bold cursor-pointer"
                                      onClick={() => navigate(`/user/${commentOwner?._id}`)}
                                    >
                                      {commentOwner?.name}
                                    </p>
                                    <p className="text-xs cursor-pointer">{comment.comment}</p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className="flex items-center w-full p-3 px-1 gap-x-4">
                          <div className="flex items-center gap-x-1">
                            <LikeButton
                              totalLikes={post?.likes?.length || "0"}
                              isLiked={isLiked}
                              onClick={() => (isLiked ? unlikePost(postId) : likePost(postId))}
                            />
                            {/* <p className="mt-1.5 text-xs">{post?.likes ? post.likes.length : "0"}</p> */}
                          </div>
                          <div className="flex items-center w-full">
                            <Smile className="w-4 h-4 mr-2 cursor-pointer" />
                            <CommentInput
                              value={comments[postId] || ""}
                              onChange={(e) =>
                                setComments((prev) => ({
                                  ...prev,
                                  [postId]: e.target.value,
                                }))
                              }
                              onSubmit={() => addComment(comments[postId], postId)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <AlertDialogFooter className="hidden" />
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
              <div className="flex items-center w-full p-4 pt-0">
                <Smile className="w-6 h-6 mr-2 cursor-pointer" />
                <CommentInput
                  value={comments[postId] || ""}
                  onChange={(e) =>
                    setComments((prev) => ({
                      ...prev,
                      [postId]: e.target.value,
                    }))
                  }
                  onSubmit={() => addComment(comments[postId], postId)}
                />
              </div>
            </Card>
          );
        })}
    </div>
  );
}

const UserIconPic = ({ showImage, src, path }: { showImage: boolean; src: string; path: string }) => {
  const navigate = useNavigate();
  return (
    <>
      {showImage ? (
        <img src={src} alt="" className={userPicClass} onClick={() => navigate(`/user/${path}`)} />
      ) : (
        <UserCircle className={userPicClass} onClick={() => navigate(`/user/${path}`)} />
      )}
    </>
  );
};

const LikeButton = ({
  isLiked,
  onClick,
  totalLikes,
  showLabel,
}: {
  isLiked: boolean;
  showLabel?: boolean;
  onClick: () => void;
  totalLikes: string | number;
}) => (
  <div className="flex items-center gap-x-1">
    <Heart
      className={`w-6 h-6 font-normal cursor-pointer ${isLiked ? "text-red-600 fill-red-600" : ""}`}
      onClick={onClick}
    />
    {totalLikes && (
      <p className="mt-1.5 text-xs">
        {totalLikes || "0"} {showLabel && "Likes"}
      </p>
    )}
  </div>
);

const CommentInput = ({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}) => (
  <div className="flex items-center w-full space-x-2">
    <Input
      type="text"
      placeholder="Add your comment . . ."
      value={value}
      className="h-8 border shadow-none placeholder:text-xs"
      onChange={onChange}
    />
    <Button type="submit" onClick={onSubmit} className="h-8">
      Comment
    </Button>
  </div>
);

const userPicClass = "w-8 h-8 rounded-full cursor-pointer";
