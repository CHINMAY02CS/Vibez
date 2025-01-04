export default function Profile() {
  return (
    <>
      <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between lg:w-1/2 lg:max-w-128 lg:mx-auto lg:gap-x-8">
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="w-40 h-40 rounded-full" />
        <div className="mt-2">
          <p className="text-3xl font-bold text-center lg:text-left">Chinmay Singh</p>
          <div className="flex items-center w-full mt-4 gap-x-4">
            <p className="text-lg font-semibold">40 posts</p>
            <p className="text-lg font-semibold">40 followers</p>
            <p className="text-lg font-semibold">40 following</p>
          </div>
        </div>
      </div>
      <div className="grid items-center justify-center grid-cols-2 gap-4 px-6 pt-4 mx-auto mt-16 border-t-2 md:max-w-max lg:grid-cols-4 lg:min-w-160">
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
        <img src="https://avatars.githubusercontent.com/u/98474924?v=4" alt="" className="max-w-40 max-h-40" />
      </div>
    </>
  );
}
