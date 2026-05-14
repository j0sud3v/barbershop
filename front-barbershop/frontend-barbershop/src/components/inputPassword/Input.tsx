import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type InputProps = {
  width?: string;
  placeholder: string;
  type: React.HTMLInputTypeAttribute;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

const Input = ({

  placeholder,
  type,
  onChange,
  value,
}: InputProps) => {
  const [passHidden, setPassHidden] = useState<boolean>(type === "password");

  return (
    <div className="relative w-fit flex items-center bg-white text-white">
      <input
        type={type === "password" ? (passHidden ? "password" : "text") : type}
        className="bg-[rgb(0,0,0)]/70 focus:outline-0  p-2 placeholder:text-extralight w-62.5 sm:w-70 lg:w-75"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
      {type === "password" && (
        <FontAwesomeIcon
          className="text-white absolute right-1 cursor-pointer"
          icon={passHidden ? faEyeSlash : faEye}
          onClick={() => setPassHidden((prev) => !prev)}
        />
      )}
    </div>
  );
};

export default Input;
