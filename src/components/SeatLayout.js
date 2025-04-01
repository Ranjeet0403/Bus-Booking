import React, { useState } from 'react';

const SeatLayout = ({ onSeatSelect, maxSeats = 8 }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats] = useState(['B1', 'B3', 'B5', 'A3']); // In real app, this would come from API

  const rows = ['A', 'B'];
  const seatsPerRow = 18;

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(seatId)) {
      return; // Seat is already booked
    }

    setSelectedSeats(prev => {
      const newSeats = prev.includes(seatId)
        ? prev.filter(id => id !== seatId)
        : prev.length >= maxSeats
          ? prev // Don't add if max seats reached
          : [...prev, seatId].sort();

      if (prev.length >= maxSeats && !prev.includes(seatId)) {
        alert(`You can only select up to ${maxSeats} seats`);
      }

      // Call the parent's onSeatSelect with the new selection
      onSeatSelect(newSeats);
      return newSeats;
    });
  };

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Select Your Seats (Max {maxSeats})</h3>
      
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-gray-300 bg-white"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500"></div>
          <span>Selected</span>
        </div>
      </div>

      <div className="grid gap-8">
        {rows.map(row => (
          <div key={row} className="flex gap-4">
            <span className="w-6 text-center font-semibold">{row}</span>
            <div className="grid grid-cols-9 gap-2">
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                const status = getSeatStatus(seatId);
                return (
                  <button
                    key={seatId}
                    className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium
                      ${status === 'booked' ? 'bg-red-600 text-white cursor-not-allowed' :
                      status === 'selected' ? 'bg-green-500 text-white' :
                      'border-2 border-gray-300 hover:border-gray-400'}`}
                    onClick={() => handleSeatClick(seatId)}
                    disabled={status === 'booked'}
                  >
                    {seatId}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          Selected seats: {selectedSeats.join(', ') || 'None'}
        </p>
        <p className="text-sm text-gray-600">
          Total seats selected: {selectedSeats.length}
        </p>
      </div>
    </div>
  );
};

export default SeatLayout;
