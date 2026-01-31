// import logo from "../../assets/logo.png";
import logo from "../../assets/scotlogo.png";

const Logo = ({


  className
}: {

  size?: "sm" | "md" | "lg";
   className?:string
}) => {
  // Define size classes


  return (
    <div className={className} >


      <img
        alt="Company logo"
        src={logo}
        className={`object-contain  ${className}`}
      />

    </div>
  );
};

export default Logo;
