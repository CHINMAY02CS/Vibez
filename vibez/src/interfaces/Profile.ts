export interface ProfileDetails {
  followers: string[];
  following: string[];
  _id: string;
  name: string;
  userName: string;
  email: string;
}

export interface CommentDetails {
  comment: string;
  postedBy: {
    _id: string;
    name: string;
  };
  _id: string;
}

export const initialProfileDetails: ProfileDetails = {
  followers: [],
  following: [],
  _id: "",
  name: "",
  userName: "",
  email: "",
};
