import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="md:w-120">
        <CardHeader className="p-2 border-b">
          <CardTitle className="flex items-center gap-x-4">
            <img
              src="https://avatars.githubusercontent.com/u/98474924?v=4"
              alt=""
              className="w-8 h-8 rounded-full cursor-pointer"
            />
            <p>Create your new post</p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-0 m-0 h-100">
          {selectedImage ? (
            <img className="object-contain w-auto h-full max-h-full pt-3" src={selectedImage} alt="Selected preview" />
          ) : (
            <p className="text-gray-500">Select the image you want to upload</p>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start p-4 gap-y-2">
          <Input type="file" name="image" className="cursor-pointer bg-slate-200" onChange={handleImageChange} />
        </CardFooter>

        <div className="flex items-center w-full p-4 pt-0">
          <div className="flex items-center w-full mt-2 space-x-2">
            <div className="grid w-full gap-2">
              <Textarea placeholder="Add caption here . . ." />
              <Button>Share</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
