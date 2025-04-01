import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { returnUrl: '/my-bookings' } });
      return;
    }

    const userBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const filteredBookings = userBookings.filter(booking => booking.userEmail === userEmail);
    setBookings(filteredBookings);
  }, [isLoggedIn, navigate, userEmail]);

  const viewInvoice = (booking) => {
    navigate('/invoice', { state: booking });
  };

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    // Update bookings in localStorage
    const allBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    const updatedBookings = allBookings.map(booking => {
      if (booking.invoiceNumber === selectedBooking.invoiceNumber) {
        return {
          ...booking,
          status: 'cancelled',
          cancellationReason: cancelReason,
          cancellationDate: new Date().toISOString()
        };
      }
      return booking;
    });

    localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

    // Update local state
    const filteredBookings = updatedBookings.filter(booking => booking.userEmail === userEmail);
    setBookings(filteredBookings);

    // Reset modal state
    setShowCancelModal(false);
    setCancelReason('');
    setSelectedBooking(null);
  };

  const filterBookings = (tab) => {
    const currentDate = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      switch (tab) {
        case 'upcoming':
          return !booking.status && bookingDate >= currentDate;
        case 'cancelled':
          return booking.status === 'cancelled';
        case 'past':
          return !booking.status && bookingDate < currentDate;
        default:
          return true;
      }
    });
  };

  if (!isLoggedIn) return null;

  const filteredBookings = filterBookings(activeTab);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'upcoming'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'cancelled'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'past'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No {activeTab} bookings found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Journey Details</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="text-gray-600">From:</span>{' '}
                        {booking.from}
                      </p>
                      <p>
                        <span className="text-gray-600">To:</span>{' '}
                        {booking.to}
                      </p>
                      <p>
                        <span className="text-gray-600">Date:</span>{' '}
                        {booking.date}
                      </p>
                      <p>
                        <span className="text-gray-600">Seats:</span>{' '}
                        {booking.selectedSeats.join(', ')}
                      </p>
                      {booking.status === 'cancelled' && (
                        <div className="mt-2">
                          <p className="text-red-600 font-semibold">CANCELLED</p>
                          <p className="text-sm text-gray-600">Reason: {booking.cancellationReason}</p>
                          <p className="text-sm text-gray-600">
                            Cancelled on: {new Date(booking.cancellationDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
                    <div className="space-y-2">
                      <p>
                        <span className="text-gray-600">Amount:</span>{' '}
                        INR {booking.paymentDetails.amount.toLocaleString()}
                      </p>
                      <p>
                        <span className="text-gray-600">Invoice Number:</span>{' '}
                        {booking.invoiceNumber}
                      </p>
                      <p>
                        <span className="text-gray-600">Booked On:</span>{' '}
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => viewInvoice(booking)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    View Invoice
                  </button>
                  {activeTab === 'upcoming' && (
                    <button
                      onClick={() => handleCancelClick(booking)}
                      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    >
                      Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Cancel Ticket</h3>
              <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border rounded-md p-2 mb-4 h-32"
                placeholder="Enter your reason here..."
              />
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                    setSelectedBooking(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
