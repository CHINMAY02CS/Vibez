import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Post, User } from "@/Interfaces";
import { Bookmark, Heart, MessageCircle, UserCircle, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { CommentDetails } from "@/interfaces/Profile";
import { addCommentService, getAllPostsService, likePostService, unlikePostService } from "@/services/posts";
import LoadingScreen from "@/components/elements/LoadingScreen";
import clsx from "clsx";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
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
    <>
      <div className="flex flex-col items-center justify-center">
        {loadingData ? (
          <LoadingScreen />
        ) : (
          <>
            {allPosts.length > 0 ? (
              allPosts.map((post) => {
                return (
                  <>
                    <LensDemo
                      pathToImage={post?.photo}
                      post={post}
                      handleOpenPost={handleOpenPost}
                      handleLikePost={handleLikePost}
                    />
                  </>
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
    </>
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
          <X className="w-4 h-4 cursor-pointer hover:text-white" onClick={() => setPostDialog(false)} />{" "}
        </div>

        <div className="grid items-start gap-x-4">
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
                onSubmit={() => {
                  // addComment(comments[postId], postId)
                  console.log(comments);
                }}
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
  <div className="flex items-center text-white gap-x-1">
    <Heart
      className={`w-6 h-6 font-normal cursor-pointer ${isLiked ? "text-red-600 fill-red-600" : ""}`}
      onClick={onClick}
    />
    {totalLikes && <p className="mt-1.5 text-xs font-medium">{totalLikes || "0"}</p>}
  </div>
);

export const CommentButton = ({ onClick, totalComments }: { onClick: () => void; totalComments: string | number }) => (
  <div className="flex items-center text-white gap-x-1">
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
        // value={value}
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

import { Lens } from "@/components/ui/lens";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LensDemo({
  pathToImage,
  post,
  handleLikePost,
  handleOpenPost,
}: {
  pathToImage: string;
  post: Post;
  handleOpenPost: (postId: string) => void;
  handleLikePost: (postId: string, isLiked: boolean) => void;
}) {
  const [hovering, setHovering] = useState(false);
  const postOwner = post.postedBy;
  const postId = post._id;
  const filteredComments = post?.comments?.filter((comment: CommentDetails) => comment.comment);
  const isLiked = post?.likes?.includes(userId) || false;
  const navigate = useNavigate();

  return (
    <div>
      <div className="w-full relative rounded-3xl overflow-hidden max-w-xl mx-auto bg-gradient-to-r from-[#1D2235] to-[#121318] p-8 mt-0 my-6">
        <Rays />
        <Beams />
        <div className="relative z-10">
          <Lens hovering={hovering} setHovering={setHovering}>
            <img src={pathToImage} alt="image" className="rounded-2xl w-128 h-88" />
          </Lens>
          <motion.div
            animate={{
              filter: hovering ? "blur(2px)" : "blur(0px)",
            }}
            className="relative z-20 py-4"
          >
            <div className="flex items-center gap-x-2">
              <UserIconPic owner={postOwner} />
              <h2
                className="text-2xl font-bold text-left text-white cursor-pointer"
                onClick={() => navigate(`/user/${postOwner?._id}`)}
              >
                {postOwner.name}
              </h2>
            </div>
            <p className="mt-4 text-left text-neutral-200">{post.body}</p>
            <div className="flex items-end justify-end w-full gap-x-8">
              <LikeButton
                totalLikes={post?.likes?.length || "0"}
                isLiked={isLiked}
                onClick={() => handleLikePost(postId, isLiked)}
              />
              <CommentButton
                totalComments={filteredComments.length > 0 ? filteredComments.length : ""}
                onClick={() => handleOpenPost(postId)}
              />

              <Bookmark className="text-white cursor-pointer" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Sorry about this but it looks cool

const Beams = () => {
  return (
    <svg
      width="380"
      height="315"
      viewBox="0 0 380 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 w-full -translate-x-1/2 pointer-events-none left-1/2"
    >
      <g filter="url(#filter0_f_120_7473)">
        <circle cx="34" cy="52" r="114" fill="#6925E7" />
      </g>
      <g filter="url(#filter1_f_120_7473)">
        <circle cx="332" cy="24" r="102" fill="#8A4BFF" />
      </g>
      <g filter="url(#filter2_f_120_7473)">
        <circle cx="191" cy="53" r="102" fill="#802FE3" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7473"
          x="-192"
          y="-174"
          width="452"
          height="452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="56" result="effect1_foregroundBlur_120_7473" />
        </filter>
        <filter
          id="filter1_f_120_7473"
          x="70"
          y="-238"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur_120_7473" />
        </filter>
        <filter
          id="filter2_f_120_7473"
          x="-71"
          y="-209"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur_120_7473" />
        </filter>
      </defs>
    </svg>
  );
};

const Rays = ({ className }: { className?: string }) => {
  return (
    <svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute left-0 top-0  pointer-events-none z-[1]", className)}
    >
      <g filter="url(#filter0_f_120_7480)">
        <path
          d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z"
          fill="url(#paint0_linear_120_7480)"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.3" filter="url(#filter1_f_120_7480)">
        <path
          d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z"
          fill="url(#paint1_linear_120_7480)"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.86" filter="url(#filter2_f_120_7480)">
        <path
          d="M-100.647 -65.795L-69.7261 -92.654L194.786 157.229L139.51 197.068L-100.647 -65.795Z"
          fill="url(#paint2_linear_120_7480)"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.31" filter="url(#filter3_f_120_7480)">
        <path
          d="M163.917 -89.0982C173.189 -72.1354 80.9618 2.11525 34.7334 30.1553C-11.495 58.1954 -106.505 97.514 -115.777 80.5512C-125.048 63.5885 -45.0708 -3.23233 1.15763 -31.2724C47.386 -59.3124 154.645 -106.061 163.917 -89.0982Z"
          fill="#8A50FF"
        />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter4_f_120_7480)">
        <path d="M34.2031 13.2222L291.721 269.534" stroke="url(#paint3_linear_120_7480)" />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter5_f_120_7480)">
        <path d="M41 -40.9331L298.518 215.378" stroke="url(#paint4_linear_120_7480)" />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter6_f_120_7480)">
        <path d="M61.3691 3.8999L317.266 261.83" stroke="url(#paint5_linear_120_7480)" />
      </g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter7_f_120_7480)">
        <path d="M-1.46191 9.06348L129.458 145.868" stroke="url(#paint6_linear_120_7480)" strokeWidth="2" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7480"
          x="-49.4199"
          y="-102.729"
          width="304.212"
          height="296.803"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter1_f_120_7480"
          x="-115.54"
          y="-64.0903"
          width="300.326"
          height="293.822"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter2_f_120_7480"
          x="-111.647"
          y="-103.654"
          width="317.434"
          height="311.722"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5.5" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter3_f_120_7480"
          x="-212.518"
          y="-188.71"
          width="473.085"
          height="369.366"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="48" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter4_f_120_7480"
          x="25.8447"
          y="4.84521"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter5_f_120_7480"
          x="32.6416"
          y="-49.3101"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter6_f_120_7480"
          x="54.0078"
          y="-3.47461"
          width="270.619"
          height="272.68"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <filter
          id="filter7_f_120_7480"
          x="-9.2002"
          y="1.32812"
          width="146.396"
          height="152.275"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur_120_7480" />
        </filter>
        <linearGradient
          id="paint0_linear_120_7480"
          x1="-57.5042"
          y1="-134.741"
          x2="403.147"
          y2="351.523"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#B253FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_120_7480"
          x1="-122.154"
          y1="-103.098"
          x2="342.232"
          y2="379.765"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#9E53FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_120_7480"
          x1="-106.717"
          y1="-138.534"
          x2="359.545"
          y2="342.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#9D53FF" />
          <stop offset="0.781583" stopColor="#A953FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_120_7480"
          x1="72.701"
          y1="54.347"
          x2="217.209"
          y2="187.221"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_120_7480"
          x1="79.4978"
          y1="0.191681"
          x2="224.006"
          y2="133.065"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_120_7480"
          x1="79.6568"
          y1="21.8377"
          x2="234.515"
          y2="174.189"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B981FF" />
          <stop offset="1" stopColor="#CF81FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_120_7480"
          x1="16.119"
          y1="27.6966"
          x2="165.979"
          y2="184.983"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A981FF" />
          <stop offset="1" stopColor="#CB81FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

import React from "react";
