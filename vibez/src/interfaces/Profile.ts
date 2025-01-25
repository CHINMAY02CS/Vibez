export interface ProfileDetails {
  followers?: string[];
  following?: string[];
  _id: string;
  name: string;
  userName: string;
  email: string;
  Photo?: string;
}

export interface CommentDetails {
  comment: string;
  postedBy: {
    _id: string;
    name: string;
    Photo?: string;
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
