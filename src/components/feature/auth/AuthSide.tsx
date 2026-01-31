const AuthSide = () => {
  return (
    <div className="h-full bg-primary relative overflow-hidden">
      {/* <MyImage
        height={800}
        imageSrc="https://i.ibb.co/0jyQcPKV/16640.jpg"
        width={800}
      /> */}
      <div className="absolute bottom-48 right-24">
        <div className="w-40 h-40 absolute top-10  bg-white opacity-15  rounded-full" />
        <div className="w-28 h-28 absolute -left-10   bg-white opacity-15  rounded-full" />
      </div>
    </div>
  );
};

export default AuthSide;
