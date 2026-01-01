import React from "react";
import mainLogo from "../../assets/main-icon.png";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const Header = ({ showData, type }) => {
  const navigate = useNavigate();

  // Parse DD-MM-YYYY correctly
  const formattedDate =
    showData?.date
      ? dayjs(showData.date, "DD-MM-YYYY").format("D MMM YYYY")
      : "";

  return (
    <>
    <div className="border-b border-gray-200 shadow-sm bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          src={mainLogo}
          alt="booklyScreen"
          className="h-6 md:h-8 object-contain cursor-pointer"
        />

        {
          type === "checkout" ? (
            <div>
              <h2 classsName="font-bold text-gray-900 text-lg md:text-xl">Review your booking</h2>
            </div>
          ) : (
             <div className="text-center">
          <h2 className="font-bold text-lg md:text-xl">
            {showData?.movie?.title}
          </h2>

          <p className="text-xs text-gray-500 font-semibold">
            {formattedDate}
            {showData?.startTime && ` · ${showData.startTime} at `}
            {showData?.theater?.name &&
              `${showData.theater.name}, ${showData.theater.city}, ${showData.theater.state}`}
          </p>
        </div>

          )
        }

       

        <button className="bg-[#f84464] cursor-pointer text-white px-4 py-1.5 rounded text-sm">
          Sign in
        </button>
      </div>
    </div>
    {/* Show Timings */}
    {
      type !== "checkout" &&(
         <div className="bg-white pt-4">
  <div className="mx-auto px-6 pb-4 flex items-center gap-4 max-w-7xl">
    <div className="text-sm text-gray-700">
      <p className="text-xs text-gray-500 font-medium">
        {dayjs(showData?.date, "DD-MM-YYYY").format("ddd")}
      </p>

      <p className="text-sm font-semibold text-gray-700">
        {dayjs(showData?.date, "DD-MM-YYYY").format("DD MMM")}
      </p>
    </div>
  



    {/* Show Time Button */}
    <button className="border cursor-pointer rounded-[14px] px-8 py-3 text-sm border-black font-medium bg-gray-200 flex flex-col items-center">
      <span>{showData?.startTime}</span>
      <span className="text-[10px] text-gray-500 font-semibold">
        {showData?.audioType?.toUpperCase()}
      </span>
    </button>

  </div>
</div>

      )
    }

   
<hr className="my-2 border-gray-300 max-w-7x1 mx-auto" />


    </>
  );
};

export default Header;