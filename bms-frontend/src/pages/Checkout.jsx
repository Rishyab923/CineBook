import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSeat } from "../context/SeatContext";
import { createBooking } from "../apis";

const Checkout = () => {
  const { selectedSeats, clearSeats } = useSeat();
  const navigate = useNavigate();

  // ✅ ONLY phone & upi
  const [user, setUser] = useState({
    phone: "",
    upi: "",
  });

  const totalAmount = selectedSeats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );

  // ✅ Phone validation
  const isValidPhone = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handlePayment = async () => {
    // 🔴 Empty check
    if (!user.phone || !user.upi) {
      toast.error("Please enter mobile number and UPI ID");
      return;
    }

    // 🔴 Phone validation
    if (!isValidPhone(user.phone)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    // 🔴 Seat check
    if (selectedSeats.length === 0) {
      toast.error("Select at least one seat");
      return;
    }

    try {
      const firstSeat = selectedSeats[0];

      // ✅ FINAL PAYLOAD (user comes from JWT in backend)
      const payload = {
        phone: user.phone,
        upi: user.upi,

        movie: firstSeat.movieId,
        theater: firstSeat.theaterId,
        showId: firstSeat.showId,

        showDate: firstSeat.date,
        showTime: firstSeat.time,

        seats: selectedSeats.map(
          (seat) => `${seat.row}${seat.number}`
        ),

        amount: totalAmount,
      };

      await createBooking(payload);

      clearSeats();
      toast.success("🎉 Booking Successful!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error(error);
      toast.error("Booking failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Payment Details
        </h2>

        {/* MOBILE NUMBER */}
        <input
          placeholder="Mobile Number (10 digits)"
          className="w-full p-3 border rounded-xl"
          value={user.phone}
          onChange={(e) =>
            setUser({
              ...user,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
          maxLength={10}
        />

        {/* UPI ID */}
        <input
          placeholder="UPI ID (eg: name@upi)"
          className="w-full p-3 border rounded-xl"
          value={user.upi}
          onChange={(e) =>
            setUser({ ...user, upi: e.target.value })
          }
        />

        <button
          onClick={handlePayment}
          className="w-full py-3 bg-purple-700 text-white rounded-xl font-bold hover:bg-purple-800 transition"
        >
          Pay ₹{totalAmount}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
