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

  // PDF GENERATOR — uses only ASCII-safe characters for jsPDF compatibility
  const downloadTicket = (booking) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Parse DD-MM-YYYY date safely ---
    let dayName = "";
    if (booking.showDate) {
      const parts = booking.showDate.split("-");
      if (parts.length === 3) {
        const parsed = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (!isNaN(parsed.getTime())) {
          dayName = parsed.toLocaleDateString("en-IN", { weekday: "long" });
        }
      }
    }

    // --- Ticket border ---
    doc.setDrawColor(100, 50, 150); // purple
    doc.setLineWidth(1.5);
    doc.roundedRect(12, 10, pageWidth - 24, 140, 4, 4);

    // --- Header ---
    doc.setFillColor(100, 50, 150);
    doc.rect(12, 10, pageWidth - 24, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("CINEBOOK - Movie Ticket", pageWidth / 2, 23, { align: "center" });

    // --- Divider line ---
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, 38, pageWidth - 20, 38);

    // --- Body content ---
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 48;
    const lineGap = 12;

    const addField = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 22, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${value || "N/A"}`, 70, y);
      y += lineGap;
    };

    addField("Name", booking.user?.username);
    addField("Email", booking.user?.email);
    addField("Movie", booking.movie?.title);
    addField("Theater", booking.theater?.name);
    addField("Date", dayName ? `${booking.showDate} (${dayName})` : booking.showDate);
    addField("Show Time", booking.showTime);
    addField("Seats", booking.seats?.join(", "));

    // --- Total amount (highlighted) ---
    y += 4;
    doc.setFillColor(245, 240, 255);
    doc.roundedRect(20, y - 6, pageWidth - 40, 14, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(100, 50, 150);
    doc.text(`Total Paid: Rs. ${booking.amount}`, pageWidth / 2, y + 3, { align: "center" });

    // --- Footer ---
    y += 22;
    doc.setFontSize(10);
    doc.setTextColor(130, 130, 130);
    doc.setFont("helvetica", "italic");
    doc.text("Enjoy your show! - CineBook", pageWidth / 2, y, { align: "center" });

    doc.save(`CineBook-Ticket-${booking._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
        <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 animate-pulse">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      {/* PROFILE HEADER */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-200/30 dark:shadow-gray-900/50 p-6 mb-8 flex justify-between items-center border border-purple-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          👋 Hi, {user?.username}
        </h2>

        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* BOOKINGS */}
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">My Bookings</h3>

      {bookings.length === 0 ? (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center border border-purple-100 dark:border-gray-700 transition-colors duration-300">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            You have not booked any tickets yet 🎬
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-200/20 dark:shadow-gray-900/50 p-6 space-y-2 border border-purple-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200/40 dark:hover:shadow-purple-900/30"
            >
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                🎥 {booking.movie?.title}
              </h3>

              <p className="text-gray-700 dark:text-gray-300">
                👤 <strong>{booking.user.username}</strong> (
                {booking.user.email})
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                📍 <strong>Theater:</strong> {booking.theater?.name}
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                📅 <strong>Date:</strong> {booking.showDate} (
                {new Date(booking.showDate).toLocaleDateString("en-IN", {
                  weekday: "long",
                })}
                )
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                ⏰ <strong>Show Time:</strong> {booking.showTime}
              </p>

              <p className="text-gray-700 dark:text-gray-300">
                💺 <strong>Seats:</strong> {booking.seats.join(", ")}
              </p>

              <p className="text-lg font-bold text-purple-700 dark:text-purple-400">
                💰 Total Paid: ₹{booking.amount}
              </p>

              <button
                onClick={() => downloadTicket(booking)}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg"
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
