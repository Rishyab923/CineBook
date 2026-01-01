import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings } from "../apis";
import jsPDF from "jspdf";

// 🔓 Decode JWT safely (no backend call)
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Profile() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const user = decodeToken(token);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await getMyBookings();
        setBookings(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 📄 PDF GENERATOR
  const downloadTicket = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("🎬 CineBook - Movie Ticket", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${booking.user.username}`, 20, 35);
    doc.text(`Email: ${booking.user.email}`, 20, 45);
    doc.text(`Movie: ${booking.movie?.title}`, 20, 60);
    doc.text(`Theater: ${booking.theater?.name}`, 20, 70);

    doc.text(
      `Date: ${booking.showDate} (${new Date(
        booking.showDate
      ).toLocaleDateString("en-IN", { weekday: "long" })})`,
      20,
      80
    );

    doc.text(`Show Time: ${booking.showTime}`, 20, 90);
    doc.text(`Seats: ${booking.seats.join(", ")}`, 20, 100);
    doc.text(`Total Paid: ₹${booking.amount}`, 20, 110);

    doc.text("Enjoy your show 🍿", 20, 130);

    doc.save(`ticket-${booking._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* PROFILE HEADER */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          👋 Hi, {user?.username}
        </h2>

        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* BOOKINGS */}
      <h3 className="text-xl font-bold mb-4">My Bookings</h3>

      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <p className="text-lg text-gray-600">
            You have not booked any tickets yet 🎬
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow p-6 space-y-2"
            >
              <h3 className="text-xl font-bold text-purple-700">
                🎥 {booking.movie?.title}
              </h3>

              <p>
                👤 <strong>{booking.user.username}</strong> (
                {booking.user.email})
              </p>

              <p>
                📍 <strong>Theater:</strong> {booking.theater?.name}
              </p>

              <p>
                📅 <strong>Date:</strong> {booking.showDate} (
                {new Date(booking.showDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                })}
                )
              </p>

              <p>
                ⏰ <strong>Show Time:</strong> {booking.showTime}
              </p>

              <p>
                💺 <strong>Seats:</strong> {booking.seats.join(", ")}
              </p>

              <p className="text-lg font-bold">
                💰 Total Paid: ₹{booking.amount}
              </p>

              <button
                onClick={() => downloadTicket(booking)}
                className="mt-3 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
              >
                📄 Download Ticket (PDF)
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
