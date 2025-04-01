import React from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/print.css';

const Invoice = () => {
  const location = useLocation();
  const booking = location.state || {};
  const userEmail = localStorage.getItem('userEmail');
  
  // Default QR code data if no booking exists
  const defaultQrData = 'https://sarkariibuss.com/Ba.2Kha9704';
  const qrData = booking.invoiceNumber ? JSON.stringify({
    billNo: booking.invoiceNumber,
    date: booking.date,
    email: userEmail,
    seats: booking.selectedSeats?.join(', '),
    from: `${booking.from}, ${booking.fromState}`,
    to: `${booking.to}, ${booking.toState}`,
    busName: booking.busName,
    busId: booking.busId,
    amount: booking.paymentDetails?.amount,
    passengers: booking.passengers?.map(p => p.name).join(', '),
    status: booking.status || 'confirmed'
  }) : defaultQrData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 print-bg-white print-p-0">
      <div className="max-w-3xl mx-auto px-4 print-px-0">
        {/* Print Button - Outside the ticket area */}
        <div className="mb-4 print-hidden">
          <button
            onClick={() => window.print()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ticket
          </button>
        </div>

        {/* Ticket Container - This is what gets printed */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden relative print-shadow-none">
          {/* Status Tag */}
          <div className="absolute top-4 right-4 z-10">
            <div className={`px-4 py-1 rounded-full border ${getStatusColor(booking.status)} font-medium text-sm`}>
              {booking.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}
            </div>
          </div>

          {/* Cancellation Stamp */}
          {booking.status === 'cancelled' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="transform rotate-45 border-8 border-red-600 rounded p-4">
                <span className="text-red-600 text-4xl font-bold whitespace-nowrap">CANCELLED</span>
              </div>
            </div>
          )}

          {/* Invoice content */}
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-red-600">SarkariiBUSS</h1>
              <p className="text-gray-600 mt-1">Your Trusted Travel Partner</p>
            </div>

            {/* Ticket Details */}
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Bus Ticket</h2>
                <div className={`px-3 py-1 rounded-full border ${getStatusColor(booking.status)} text-sm`}>
                  {booking.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">From</p>
                  <p className="font-medium">{booking.from}</p>
                  <p className="text-sm text-gray-500">{booking.fromState}</p>
                </div>
                <div>
                  <p className="text-gray-600">To</p>
                  <p className="font-medium">{booking.to}</p>
                  <p className="text-sm text-gray-500">{booking.toState}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{booking.date}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bus Type</p>
                  <p className="font-medium">{booking.busType || 'Deluxe AC Sleeper'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Bus Name</p>
                  <p className="font-medium">{booking.busName || 'Express Travels'}</p>
                  <p className="text-sm text-gray-500">Bus ID: {booking.busId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Timings</p>
                  <p className="font-medium">Departure: {booking.departureTime}</p>
                  <p className="text-sm text-gray-500">Arrival: {booking.arrivalTime}</p>
                </div>
                {booking.status === 'cancelled' && (
                  <div className="col-span-2">
                    <p className="text-gray-600">Cancellation Details</p>
                    <p className="font-medium text-red-600">Cancelled on: {new Date(booking.cancellationDate).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Reason: {booking.cancellationReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Passenger Details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Seat No.
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {booking.passengers?.map((passenger, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {passenger.seatNo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {passenger.gender}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Booking Details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <QRCodeSVG 
                    value={qrData} 
                    size={128}
                    level="Q"
                    includeMargin={true}
                  />
                </div>
                <div className="space-y-1 text-sm">
                  <p>Bill No.: {booking.invoiceNumber}</p>
                  <p>Date: {booking.date}</p>
                  <p>Email: {userEmail}</p>
                  <p>From: {booking.from}, {booking.fromState}</p>
                  <p>To: {booking.to}, {booking.toState}</p>
                  <p>Bus Name: {booking.busName}</p>
                  <p>Bus ID: {booking.busId}</p>
                  <p>Dept. Time: {booking.departureTime}</p>
                  <p>Arrival Time: {booking.arrivalTime}</p>
                  <p>Total Passenger: {booking.passengers?.length || 0}</p>
                  <p>Base Amount: ₹{booking.paymentDetails?.amount}</p>
                  <p>Service Tax (5%): ₹{Math.round(booking.paymentDetails?.amount * 0.05)}</p>
                  <p className="font-semibold">Total Amount: ₹{Math.round(booking.paymentDetails?.amount * 1.05)}</p>
                  <p>Payment Method: {booking.paymentDetails?.method?.toUpperCase() || 'Card'}</p>
                  <p>Status: <span className={`inline-block px-2 py-0.5 rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'}
                  </span></p>
                  {booking.status === 'cancelled' && (
                    <>
                      <p className="text-red-600">Cancelled on: {new Date(booking.cancellationDate).toLocaleString()}</p>
                      <p className="text-red-600">Reason: {booking.cancellationReason}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
              <h3 className="font-semibold mb-2">Important Notes:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Please arrive at least 30 minutes before departure time.</li>
                <li>Carry a valid ID proof during the journey.</li>
                <li>No refund on cancellation within 2 hours of departure.</li>
                <li>For any assistance, call our 24/7 helpline: 1800-123-4567</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
