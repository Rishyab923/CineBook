import React, { useState } from "react";
import { getBookingsByEmail } from "../apis";
import { MdMovie } from "react-icons/md";
import { FaTicketAlt, FaSearch } from "react-icons/fa";

const MyBookings = () => {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email.trim()) {
      setError("Please enter your booking email");
      setBookings([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSearched(true);

      const res = await getBookingsByEmail(email.trim());
      const data = res?.data?.data || [];

      setBookings(data);

      if (data.length === 0) {
        setError("No bookings found for this email");
      }
    } catch (err) {
      setError("Unable to fetch bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white rounded-3xl p-8 shadow-2xl mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center flex items-center justify-center gap-3">
            <FaTicketAlt className="text-yellow-300 text-3xl" />
            My Movie Bookings
          </h1>
          <p className="text-center text-purple-200 mt-3 text-sm sm:text-base">
            Enter your email to view all your booked tickets
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter booking email"
              className="flex-1 p-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-700 text-white rounded-2xl font-semibold hover:bg-purple-800 active:scale-95 transition"
            >
              <FaSearch />
              Search
            </button>
          </div>

          {/* STATUS MESSAGES */}
          {loading && (
            <p className="text-center mt-6 text-purple-700 font-semibold animate-pulse">
              Fetching your bookings...
            </p>
          )}

          {error && (
            <p className="text-center mt-6 text-red-500 font-semibold">
              {error}
            </p>
          )}
        </div>

        {/* BOOKINGS LIST */}
        {!loading && searched && bookings.length > 0 && (
          <div className="space-y-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition"
              >
                {/* MOVIE HEADER */}
                <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white p-5 flex items-center gap-3">
                  <MdMovie className="text-3xl text-yellow-300" />
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {booking.movie?.title}
                  </h3>
                </div>

                {/* BODY */}
                <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm sm:text-base">
                  <p><b>Name:</b> {booking.user.name}</p>
                  <p><b>Email:</b> {booking.user.email}</p>
                  <p><b>Theater:</b> {booking.theater?.name}</p>
                  <p><b>Date:</b> {booking.showDate}</p>
                  <p><b>Show Time:</b> {booking.showTime}</p>
                  <p>
                    <b>Seats:</b>{" "}
                    <span className="font-semibold text-purple-700">
                      {booking.seats.join(", ")}
                    </span>
                  </p>
                </div>

                {/* FOOTER */}
                <div className="bg-gray-50 px-6 sm:px-8 py-4 flex justify-between items-center border-t">
                  <span className="text-gray-600 text-sm">
                    Enjoy your movie 🍿
                  </span>
                  <span className="text-xl font-extrabold text-purple-700">
                    ₹{booking.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
