import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Trash, X, UserCircle, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Post } from "@/Interfaces";
import { CommentDetails, initialProfileDetails, ProfileDetails } from "@/interfaces/Profile";

export default function Profile() {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails>(initialProfileDetails);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [openProfilePicDialog, setOpenProfilePicDialog] = useState(false);
  const [openPost, setOpenPost] = useState<Post>();
  const [fetch, setFetch] = useState(false);
  const [loadingData, setLoadingData] = useState<boolean | null>(true);

  const fetchUserPosts = async () => {
    try {
      const userPostsAll = await fetchUserPostsService();
      const selfPostsAll = await fetchSelfPostsService();
      setProfileDetails(userPostsAll?.user);
      setMyPosts(selfPostsAll);
      setLoadingData(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [fetch]);

  async function addComment(text: string, id: string) {
    try {
      const updatedPost = await commentPostService(id, text);

      updatePostsData(updatedPost);
      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }
      setComments((prev) => ({ ...prev, [id]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }

  const setPostInDialog = async (id: string) => {
    try {
      const post = myPosts.find((p: Post) => p._id === id);
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

  const userName = JSON.parse(localStorage.getItem("user") ?? "").name;

  function updatePostsData(updatedPost: Post) {
    const newData = myPosts.map((post) => {
      if (post._id === updatedPost._id) {
        return updatedPost;
      }
      return post;
    });
    setMyPosts(newData);
  }

  async function deletePost(postId: string) {
    try {
      const updatedPost = await deletePostService(postId);
      updatePostsData(updatedPost);
      setAlertOpen(false);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }

  async function handleLikePost(id: string, isLiked: boolean) {
    try {
      const updatedPost = isLiked ? await unlikePostService(id) : await likePostService(id);
      updatePostsData(updatedPost);
      if (openPost?._id === id) {
        setOpenPost(updatedPost);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return loadingData ? (
    <LoadingScreen />
  ) : (
    <>
      <div className="flex flex-col items-center justify-center text-white lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
        <div>
          {profileDetails.Photo ? (
            <img src={profileDetails?.Photo} alt="profile pic" className="w-40 h-40 rounded-full cursor-pointer" />
          ) : (
            <UserCircle className="w-40 h-40 rounded-full cursor-pointer fill-white" />
          )}
          <div className="flex justify-end -mt-6">
            <Pencil className="hover:cursor-pointer" onClick={() => setOpenProfilePicDialog(true)} />
          </div>
        </div>

        <div className="mt-2">
          <p className="text-3xl font-bold text-center lg:text-left">{userName}</p>
          <div className="flex items-center w-full mt-4 text-lg font-semibold gap-x-4">
            <p>{myPosts.length} posts</p>
            <p>{profileDetails?.followers?.length || 0} followers</p>
            <p>{profileDetails?.following?.length || 0} following</p>
          </div>
        </div>
      </div>
      <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
        {myPosts.length > 0 &&
          myPosts.map((post: Post) => {
            return (
              <div key={post._id}>
                <img
                  src={post?.photo}
                  alt="postPic"
                  className="duration-300 cursor-pointer max-w-40 max-h-40 hover:scale-105"
                  id={post._id}
                  onClick={() => setPostInDialog(post._id)}
                />
              </div>
            );
          })}
      </div>
      {openPost && (
        <PostDetails
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          post={openPost}
          deletePost={deletePost}
          addComment={addComment}
          comments={comments}
          setComments={setComments}
          handleLikePost={handleLikePost}
        />
      )}
      <ProfilePicDialog
        openProfilePicDialog={openProfilePicDialog}
        setOpenProfilePicDialog={setOpenProfilePicDialog}
        setFetch={setFetch}
        profileDetails={profileDetails}
      />
    </>
  );
}

const PostDetails = ({
  alertOpen,
  setAlertOpen,
  post,
  deletePost,
  addComment,
  comments,
  setComments,
  handleLikePost,
}: {
  alertOpen: boolean;
  setAlertOpen: Dispatch<SetStateAction<boolean>>;
  post: Post;
  deletePost: (postId: string) => void;
  comments: { [key: string]: string };
  setComments: Dispatch<SetStateAction<{ [key: string]: string }>>;
  handleLikePost: (id: string, isLiked: boolean) => void;
  addComment: (text: string, id: string) => void;
}) => {
  const userId = JSON.parse(localStorage.getItem("user") ?? "")._id;
  const navigate = useNavigate();
  const postOwner = post?.postedBy;
  const filteredComments = post?.comments?.filter((comment: CommentDetails) => comment.comment);

  function showUser(path: string) {
    navigate(`/user/${path}`);
    setAlertOpen(false);
  }
  return (
    <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} key={post._id}>
      <AlertDialogContent className="gap-0 px-3 py-0 rounded-lg max-h-176 lg:max-w-240 lg:max-h-none">
        <div className="flex items-end justify-end">
          <AlertDialogCancel className="p-0 m-0 border-none shadow-none max-w-max">
            <X className="w-4 h-4" />{" "}
          </AlertDialogCancel>
        </div>
        <div className="flex items-center justify-between p-2 mb-2 -mt-2 border border-gray-200 rounded-sm lg:mt-0">
          <div
            className="flex items-center gap-x-2"
            onClick={() => {
              navigate(`/user/${postOwner?._id}`);
              setAlertOpen(false);
            }}
          >
            <UserIconPic owner={postOwner} />
            <p className="cursor-pointer">{postOwner?.name}</p>
          </div>
          <Trash onClick={() => deletePost(post._id)} className="cursor-pointer hover:text-red-600" />
        </div>
        <div className="grid items-start lg:grid-cols-2 gap-x-4">
          <img className="cursor-pointer h-80 w-120" src={post?.photo} />
          {/* right card */}
          <div>
            {post?.comments?.length > 0 && (
              <div className="pb-2 mt-2 overflow-y-auto border border-gray-100 lg:mt-0 max-h-52 lg:max-h-76">
                {filteredComments.map((comment: CommentDetails, index: number) => {
                  const commentOwner = comment?.postedBy;
                  return (
                    <div className="flex items-center p-2 gap-x-4" id={String(index)} key={index}>
                      {commentOwner?.Photo ? (
                        <img
                          src={commentOwner?.Photo}
                          alt=""
                          className="w-8 h-8 rounded-full cursor-pointer"
                          onClick={() => showUser(commentOwner?._id)}
                        />
                      ) : (
                        <UserCircle
                          className="w-8 h-8 rounded-full cursor-pointer"
                          onClick={() => showUser(commentOwner?._id)}
                        />
                      )}
                      <div>
                        <p className="text-sm font-bold cursor-pointer" onClick={() => showUser(commentOwner?._id)}>
                          {commentOwner?.name}
                        </p>
                        <p className="text-xs">{comment.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex items-center w-full p-3 px-1 gap-x-4">
              <LikeButton
                totalLikes={post?.likes?.length || "0"}
                isLiked={post?.likes?.includes(userId) || false}
                onClick={() => handleLikePost(post._id, post?.likes?.includes(userId) || false)}
              />
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
                  Comment
                </Button>
              </div>{" "}
            </div>
          </div>
        </div>
        <AlertDialogFooter></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { likePostService, unlikePostService } from "@/services/posts";
import { LikeButton, UserIconPic } from "./Home";
import {
  commentPostService,
  deletePostService,
  fetchSelfPostsService,
  fetchUserPostsService,
  removeProfilePicService,
  uploadProfilePicService,
} from "@/services/profile";
import LoadingScreen from "@/components/elements/LoadingScreen";

const ProfilePicDialog = ({
  openProfilePicDialog,
  setOpenProfilePicDialog,
  setFetch,
  profileDetails,
}: {
  openProfilePicDialog: boolean;
  setOpenProfilePicDialog: Dispatch<SetStateAction<boolean>>;
  setFetch: Dispatch<SetStateAction<boolean>>;
  profileDetails: ProfileDetails;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | any>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [saveProfilePic, setSaveProfilePic] = useState(false);
  const [uploadPic, setUploadPic] = useState(false);
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPhoto(imageUrl);
      setSelectedImage(file);
      setSaveProfilePic(true);
    }
  }

  function sendImageOnCloudinary() {
    const data = new FormData();
    data.append("file", selectedImage);
    data.append("upload_preset", "vibez-app");
    data.append("clound_name", "chinmaycloud ");
    fetch("https://api.cloudinary.com/v1_1/chinmaycloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => setImageUrl(data.url))
      .catch((err) => console.log(err));
  }

  async function savePic() {
    try {
      const data = await uploadProfilePicService(imageUrl);
      if (data) {
        setOpenProfilePicDialog(false);
        setSelectedImage(null);
        setPhoto(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetch((prev) => !prev);
    }
  }

  async function removePic() {
    try {
      const data = await removeProfilePicService();
      if (data) {
        setOpenProfilePicDialog(false);
        setSelectedImage(null);
        setPhoto(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetch((prev) => !prev);
    }
  }

  useEffect(() => {
    if (selectedImage && uploadPic) {
      sendImageOnCloudinary();
    }
  }, [selectedImage, uploadPic]);

  useEffect(() => {
    if (imageUrl && uploadPic) {
      savePic();
    }
  }, [imageUrl, uploadPic]);

  return (
    <AlertDialog open={openProfilePicDialog} onOpenChange={setOpenProfilePicDialog}>
      <AlertDialogTrigger asChild className="hidden"></AlertDialogTrigger>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Profile Pic</AlertDialogTitle>
        </AlertDialogHeader>
        <CardContent className="flex items-center justify-center p-0 m-0 h-100">
          {photo ? (
            <img className="object-contain w-auto h-full max-h-full pt-3" src={photo} alt="Selected preview" />
          ) : (
            <>
              {profileDetails.Photo ? (
                <img
                  className="object-contain w-auto h-full max-h-full pt-3"
                  src={profileDetails.Photo}
                  alt="Selected preview"
                />
              ) : (
                <p className="text-gray-500">Select the image you want to upload</p>
              )}
            </>
          )}
        </CardContent>
        {saveProfilePic ? (
          <Button onClick={() => setUploadPic(true)}>Save</Button>
        ) : (
          <>
            <Label
              htmlFor="fileInput"
              className="px-4 py-3 text-center text-white bg-blue-600 rounded cursor-pointer h-9 hover:bg-blue-600"
            >
              Add a New Profile Pic
            </Label>
            <Input type="file" name="image" id="fileInput" className="hidden" onChange={handleImageChange} />
          </>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setFetch((prev) => !prev);
              setPhoto(null);
              setSelectedImage(null);
              setSaveProfilePic(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <Button onClick={removePic}>Remove Profile Pic</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
