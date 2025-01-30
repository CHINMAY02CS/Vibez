import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Post, User } from "@/Interfaces";
import { Bookmark, Heart, MessageCircle, UserCircle, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { CommentDetails } from "@/interfaces/Profile";
import { addCommentService, getAllPostsService, likePostService, unlikePostService } from "@/services/posts";
import LoadingScreen from "@/components/elements/LoadingScreen";
import clsx from "clsx";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState<boolean | null>(true);
  const [postDialog, setPostDialog] = useState(false);
  const [activePost, setActivePost] = useState<null | Post>(null);

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
      setLoadingData(false);
    } catch (err) {
      console.error(err);
    }
  };

  async function handleLikePost(id: string, isLiked: boolean) {
    try {
      const updatedPost = isLiked ? await unlikePostService(id) : await likePostService(id);
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

  const handleOpenPost = async (postId: string) => {
    try {
      const post = await allPosts.find((p: Post) => p._id === postId);
      if (post) {
        setActivePost(post);
        setPostDialog(true);
      } else {
        console.error("Post not found!");
      }
    } catch (error) {
      console.error(error, "Please try again");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-y-6">
      {loadingData ? (
        <LoadingScreen />
      ) : (
        <>
          {allPosts.length > 0 ? (
            allPosts.map((post) => {
              const postId = post?._id;
              const postOwner = post?.postedBy;
              const isLiked = post?.likes?.includes(userId) || false;
              const filteredComments = post?.comments?.filter((comment: CommentDetails) => comment.comment);
              return (
                <Card className="pb-4 border-none md:w-144 rounded-xl" key={post._id}>
                  {/* User pic and name */}
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-x-4">
                      <UserIconPic owner={postOwner} />
                      <p className="cursor-pointer" onClick={() => navigate(`/user/${postOwner?._id}`)}>
                        {postOwner?.name}
                      </p>
                    </CardTitle>
                  </CardHeader>
                  {/* Post Card */}
                  <CardContent className="flex items-center justify-center p-0 m-0 h-80">
                    <img className="mx-4 rounded-lg h-80 w-144" src={post?.photo} alt="postedPic" />
                  </CardContent>
                  <CardFooter className="flex-col items-start w-full p-4 gap-y-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-x-4">
                        <LikeButton
                          totalLikes={post?.likes?.length || "0"}
                          isLiked={isLiked}
                          onClick={() => handleLikePost(postId, isLiked)}
                        />
                        <CommentButton
                          totalComments={filteredComments.length > 0 ? filteredComments.length : ""}
                          onClick={() => handleOpenPost(postId)}
                        />
                      </div>
                      <Bookmark className="cursor-pointer" />
                    </div>
                    <div className="flex items-center mt-2 text-sm gap-x-2">
                      <p className="font-semibold cursor-pointer" onClick={() => navigate(`/user/${postOwner?._id}`)}>
                        {postOwner?.name}
                      </p>
                      <p>{post?.body}</p>
                    </div>
                    {/* <p
                      onClick={() => handleOpenPost(postId)}
                      className="text-xs text-gray-700 cursor-pointer hover:underline"
                    >
                      {post.comments?.length > 0 ? `View all ${filteredComments.length} comments` : null}
                    </p> */}
                  </CardFooter>
                  {/* <CommentInput
                    className="p-3 pt-0 mb-2"
                    value={comments[postId] || ""}
                    onChange={(e) =>
                      setComments((prev) => ({
                        ...prev,
                        [postId]: e.target.value,
                      }))
                    }
                    onSubmit={() => addComment(comments[postId], postId)}
                  /> */}
                </Card>
              );
            })
          ) : (
            <div className="mt-6 font-medium">No Posts to display</div>
          )}
        </>
      )}
      {activePost && (
        <PostDetailsDialog
          post={activePost}
          setPostDialog={setPostDialog}
          postDialog={postDialog}
          handleLikePost={handleLikePost}
          addComment={addComment}
          setComments={setComments}
        />
      )}
    </div>
  );
}

const PostDetailsDialog = ({
  post,
  handleLikePost,
  addComment,
  setComments,
  postDialog,
  setPostDialog,
}: {
  post: Post;
  handleLikePost: (id: string, isLiked: boolean) => void;
  addComment: (text: string, id: string) => void;
  setComments: Dispatch<SetStateAction<{ [key: string]: string }>>;
  postDialog: boolean;
  setPostDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const postOwner = post.postedBy;
  const postId = String(post._id);
  const comments = post.comments;
  const navigate = useNavigate();
  const filteredComments = post?.comments?.filter((comment: CommentDetails) => comment.comment);
  const isLiked = post?.likes?.includes(userId) || false;

  return (
    <AlertDialog open={postDialog} onOpenChange={setPostDialog}>
      <AlertDialogContent className="gap-0 px-3 py-0 text-gray-400 border-none bg-gray-950 rounded-2xl md:w-136 lg:max-h-none">
        <div className="flex items-center justify-between py-4">
          <p className="w-full text-sm font-semibold text-center">Comments</p>
          {/* <AlertDialogCancel className="p-0 m-0 border-none shadow-none max-w-max"> */}
          <X className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => setPostDialog(false)} />{" "}
          {/* </AlertDialogCancel> */}
        </div>

        <div className="grid items-start gap-x-4">
          {/* <img className="h-80 w-120" src={post?.photo} /> */}
          <div>
            <div className="flex flex-col pb-2 mt-2 overflow-y-auto gap-y-3 lg:mt-0 max-h-90 md:max-h-144">
              {post.comments.length > 0 &&
                filteredComments.map((comment: CommentDetails, index) => {
                  const commentOwner = comment?.postedBy;
                  return (
                    <div className="flex items-center p-2 gap-x-4" key={index}>
                      <UserIconPic owner={commentOwner} />
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
            <div className="flex items-center w-full p-3 px-1 border-t border-t-gray-600 gap-x-4">
              <LikeButton
                totalLikes={post?.likes?.length || "0"}
                isLiked={isLiked}
                onClick={() => handleLikePost(postId, isLiked)}
              />
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
        <AlertDialogFooter className="hidden" />
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const UserIconPic = ({ owner }: { owner: User }) => {
  const navigate = useNavigate();
  return owner?.Photo ? (
    <img
      alt="image"
      src={owner?.Photo || ""}
      className={userPicClass}
      onClick={() => navigate(`/user/${owner?._id}`)}
    />
  ) : (
    <UserCircle className={userPicClass} onClick={() => navigate(`/user/${owner?._id}`)} />
  );
};

export const LikeButton = ({
  isLiked,
  onClick,
  totalLikes,
}: {
  isLiked: boolean;
  onClick: () => void;
  totalLikes: string | number;
}) => (
  <div className="flex items-center gap-x-1">
    <Heart
      className={`w-6 h-6 font-normal cursor-pointer ${isLiked ? "text-red-600 fill-red-600" : ""}`}
      onClick={onClick}
    />
    {totalLikes && <p className="mt-1.5 text-xs font-medium">{totalLikes || "0"}</p>}
  </div>
);

export const CommentButton = ({ onClick, totalComments }: { onClick: () => void; totalComments: string | number }) => (
  <div className="flex items-center gap-x-1">
    <MessageCircle className="w-6 h-6 cursor-pointer" onClick={onClick} />
    {totalComments && <p className="mt-1.5 text-xs font-medium">{totalComments || "0"}</p>}
  </div>
);

const CommentInput = ({
  value,
  onSubmit,
  onChange,
  className,
}: {
  value: string;
  onSubmit: () => void;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={clsx("flex items-center w-full space-x-2", className)}>
      <Input
        type="text"
        placeholder="Add your comment . . ."
        value={value}
        className="h-8 border-none shadow-none placeholder:text-gray-400 focus-visible:ring-0 placeholder:text-xs"
        onChange={onChange}
      />
      <Button type="submit" onClick={onSubmit} className="h-8 text-gray-400">
        Add
      </Button>
    </div>
  );
};

const userPicClass = "w-8 h-8 rounded-full cursor-pointer";
const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;
