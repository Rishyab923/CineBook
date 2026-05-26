import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSeat } from "../context/SeatContext";
import { useQuery } from "@tanstack/react-query";
import { getShowById } from "../apis";
import Header from "../components/seat-layout/Header";
import Footer from "../components/seat-layout/Footer";
import screenImg from "../assets/screen.png";

/* ---------------- Seat Button ---------------- */
const Seat = ({
  seat,
  row,
  price,
  toggleSeat,
  selectedSeats,
  bookedSeats,
  showData,
}) => {
  const seatId = `${row}${seat.number}`;

  const isSelected = selectedSeats.some((s) => s.id === seatId);
  const isBooked = bookedSeats.includes(seatId);

  return (
    <button
      disabled={isBooked}
      onClick={() => {
        if (isBooked) {
          alert("This seat is already booked ❌");
          return;
        }

        toggleSeat({
          id: seatId,
          row,
          number: seat.number,
          price,

          movieId: showData.movie._id,
          showId: showData._id,
          theaterId: showData.theater._id,

          movieName: showData.movie.title,
          theater: showData.theater.name,
          date: showData.date,
          time: showData.startTime,
        });
      }}
      className={`w-10 h-10 m-[3px] rounded-xl border text-sm font-semibold transition-all duration-300
        ${
          isBooked
            ? "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700 opacity-60"
            : "bg-[#1b1b2d] border-[#3a3a5a] text-gray-200 hover:border-purple-500 hover:bg-purple-500/20 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20"
        }

        ${
          isSelected
            ? "bg-gradient-to-br from-purple-600 to-pink-500 text-white border-purple-400 scale-110 shadow-xl shadow-purple-500/40"
            : ""
        }
      `}
      title={isBooked ? "Seat already booked" : "Available"}
    >
      {isBooked ? "✕" : seat.number}
    </button>
  );
};

/* ---------------- Seat Layout Page ---------------- */
const SeatLayout = () => {
  const { showId, state } = useParams();
  const navigate = useNavigate();
  const { selectedSeats, toggleSeat } = useSeat();

  const { data: showData, isLoading } = useQuery({
    queryKey: ["show", showId],
    queryFn: async () => (await getShowById(showId)).data,
    enabled: !!showId,
  });

  /* ✅ BOOKED SEATS */
  const bookedSeats = [];
  showData?.seatLayout.forEach((row) => {
    row.seats.forEach((seat) => {
      if (seat.status === "BOOKED") {
        bookedSeats.push(`${row.row}${seat.number}`);
      }
    });
  });

  /* ✅ GROUP BY CATEGORY */
  const groupedSeats = {};
  showData?.seatLayout.forEach((rowObj) => {
    const category = rowObj.category;
    const price = showData.priceMap[category];

    if (!groupedSeats[category]) {
      groupedSeats[category] = {
        price,
        rows: [],
      };
    }

    groupedSeats[category].rows.push(rowObj);
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#070B14] text-purple-400 text-lg animate-pulse">
        Loading seats...
      </div>
    );
  }

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert("Select at least one seat!");
      return;
    }

    navigate(`/shows/${showId}/${state}/checkout`);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#070B14] text-white relative">
      {/* Background Glow Effects */}
      <div className="absolute top-[-150px] left-[-100px] w-[350px] h-[350px] bg-purple-600/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[320px] bg-pink-500/20 blur-[140px] rounded-full"></div>

      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-20">
        <Header showData={showData} />
      </div>

      {/* Seat Layout */}
      <div className="relative z-10 max-w-7xl mx-auto mt-[210px] px-6 pb-8 h-[calc(100vh-320px)] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col items-center">
          {Object.entries(groupedSeats).map(
            ([category, { price, rows }]) => (
              <div
                key={category}
                className="mb-14 w-full text-center bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
              >
                {/* Category */}
                <h2 className="font-bold text-2xl mb-6 tracking-wide">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {category}
                  </span>

                  <span className="text-gray-400 text-lg ml-2">
                    • ₹{price}
                  </span>
                </h2>

                {/* Rows */}
                {rows.map((rowObj) => (
                  <div
                    key={rowObj.row}
                    className="flex items-center justify-center mb-3"
                  >
                    {/* Row Label */}
                    <div className="w-8 mr-4 text-sm font-bold text-purple-300">
                      {rowObj.row}
                    </div>

                    {/* Seats */}
                    <div className="flex gap-[2px] flex-wrap justify-center">
                      {rowObj.seats.map((seat) => (
                        <Seat
                          key={seat.number}
                          seat={seat}
                          row={rowObj.row}
                          price={price}
                          toggleSeat={toggleSeat}
                          selectedSeats={selectedSeats}
                          bookedSeats={bookedSeats}
                          showData={showData}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* Screen */}
        <div className="flex justify-center mt-10 mb-8 relative">
          <div className="absolute bottom-0 w-[420px] h-16 bg-cyan-400/20 blur-3xl rounded-full"></div>

          <img
            src={screenImg}
            alt="Screen"
            className="w-[420px] opacity-90 drop-shadow-[0_0_35px_rgba(34,211,238,0.45)]"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[100px] bg-[#0f172a]/90 backdrop-blur-2xl border-t border-white/10 px-8 py-4 flex justify-between items-center z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
        <div>
          <p className="text-sm text-gray-400">Selected Seats</p>

          <h2 className="text-2xl font-bold text-white">
            {selectedSeats.length}
          </h2>
        </div>

        <button
          onClick={handleProceed}
          className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 px-8 py-3 rounded-2xl text-white font-bold text-lg shadow-2xl shadow-purple-500/30 hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300"
        >
          Proceed →
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default SeatLayout;