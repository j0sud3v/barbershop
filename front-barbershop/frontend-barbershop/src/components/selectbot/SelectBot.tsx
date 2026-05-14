import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SelectBotProps = {
  buttonValue: string;
  iconValue?: any;
  onClick: () => void;
};

const SelectBot = ({
  buttonValue,
  iconValue,
  onClick,
}: SelectBotProps) => {
  return (
    <div className="flex flex-col justify-center items-end gap-3">
      <button
        className="w-40 lg:w-50 text-center py-2 border text-lg flex gap-2 items-center justify-center rounded-sm ml-9 cursor-pointer"
        onClick={onClick}
      >
        {iconValue ? <FontAwesomeIcon icon={iconValue} /> : null}
        {buttonValue}
      </button>
    </div>
  );
};

export default SelectBot;
