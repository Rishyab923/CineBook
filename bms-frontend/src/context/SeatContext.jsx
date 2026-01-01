import React, { createContext, useContext, useState } from "react";

const SeatContext = createContext();

export const SeatProvider = ({ children }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    const exists = selectedSeats.find((s) => s.id === seat.id);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const clearSeats = () => setSelectedSeats([]);

  return (
    <SeatContext.Provider value={{ selectedSeats, toggleSeat, clearSeats }}>
      {children}
    </SeatContext.Provider>
  );
};

export const useSeat = () => useContext(SeatContext);