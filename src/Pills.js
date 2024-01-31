import React from "react";

const Pills = ({ image, text, onClick }) => {
  return (
    <span className="h-[20px] flex items-center gap-[5px] bg-black text-white px-[10px] py-[5px] rounded-lg cursor-pointer" onClick={onClick}>
      <img className="h-[100%] src={image}" src={image} alt={text} />
      <span>{text} &times;</span>
    </span>
  );
};

export default Pills;
