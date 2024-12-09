import Image from "next/image";
import userImg from "../assets/user.png";

function UserMessage({ message, index }) {
  return (
    <li key={index} className="self-end">
      <div className="flex justify-end align-items-end gap-3">
        <div className="py-2 pl-3 pr-6 bg-white rounded-2 shadow-sm w-50 " style={{borderRight: "7px solid #02040F"}}>

          <p className="" style={{color: "#292929CC"}}>{message.body}</p>
          {message.isDeleted && (
              <p className="text-red-500">This message has been deleted</p>
          )}
        </div>
        
        <Image src={userImg} alt="User" width={40} height={40} style={{objectFit: "contain"}}/>
      </div>
    </li>
  );
}

export default UserMessage;