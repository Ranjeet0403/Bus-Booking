import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SeatLayout from './SeatLayout';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state || {};
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPassengerForm, setShowPassengerForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const baseFare = bookingDetails.basePrice || 1600; // INR per seat

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay using Visa, MasterCard, RuPay',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Pay directly from your bank account',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '👝',
      description: 'Pay using Paytm, PhonePe, or other digital wallets',
    }
  ];

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('pendingBooking', JSON.stringify(bookingDetails));
      navigate('/login', { state: { returnUrl: '/payment' } });
    } else {
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking && !bookingDetails.from) {
        const savedBooking = JSON.parse(pendingBooking);
        navigate('/payment', { state: savedBooking, replace: true });
        localStorage.removeItem('pendingBooking');
      }
    }
  }, [isLoggedIn, navigate, bookingDetails]);

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
    setShowPassengerForm(false);
    setShowPaymentForm(false);
    setPassengers([]);
  };

  const handleProceedToPassengers = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat to continue.');
      return;
    }
    setShowPassengerForm(true);
  };

  const handlePassengerSubmit = (e) => {
    e.preventDefault();
    const passengerForms = document.querySelectorAll('.passenger-form');
    const newPassengers = Array.from(passengerForms).map((form, index) => ({
      name: form.querySelector('[name="name"]').value,
      age: form.querySelector('[name="age"]').value,
      gender: form.querySelector('[name="gender"]').value,
      seatNo: selectedSeats[index]
    }));
    setPassengers(newPassengers);
    setShowPaymentForm(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const totalAmount = baseFare * selectedSeats.length;
    const userEmail = localStorage.getItem('userEmail');
    
    // Create new booking
    const newBooking = {
      ...bookingDetails,
      selectedSeats,
      passengers,
      paymentDetails: {
        amount: totalAmount,
        method: selectedPaymentMethod,
        timestamp: new Date().toISOString()
      },
      userEmail,
      bookingDate: new Date().toISOString(),
      invoiceNumber: `INV${Math.floor(Math.random() * 1000000)}`
    };

    // Save to user's bookings
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    localStorage.setItem('userBookings', JSON.stringify([...existingBookings, newBooking]));

    // Navigate to invoice
    navigate('/invoice', { state: newBooking });
  };

  const renderPaymentForm = () => {
    switch (selectedPaymentMethod) {
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@upi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <p className="text-sm text-gray-500">
              You'll receive a payment request on your UPI app
            </p>
          </div>
        );
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  maxLength="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Bank
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">
              You'll be redirected to your bank's secure payment page
            </p>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Wallet
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="">Choose your wallet</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="amazonpay">Amazon Pay</option>
                <option value="mobikwik">MobiKwik</option>
              </select>
            </div>
            <p className="text-sm text-gray-500">
              You'll be redirected to your wallet's payment page
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              true ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}>1</div>
            <div className="text-sm ml-2">Select Seats</div>
            <div className="w-16 h-1 mx-2 bg-gray-200"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              showPassengerForm || showPaymentForm ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}>2</div>
            <div className="text-sm ml-2">Passenger Details</div>
            <div className="w-16 h-1 mx-2 bg-gray-200"></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              showPaymentForm ? 'bg-red-600 text-white' : 'bg-gray-200'
            }`}>3</div>
            <div className="text-sm ml-2">Payment</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Bus Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-medium">{bookingDetails.from}</p>
              <p className="text-sm text-gray-500">{bookingDetails.fromState}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-medium">{bookingDetails.to}</p>
              <p className="text-sm text-gray-500">{bookingDetails.toState}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{bookingDetails.date}</p>
            </div>
            <div>
              <p className="text-gray-600">Bus Type</p>
              <p className="font-medium">{bookingDetails.busType}</p>
            </div>
            <div>
              <p className="text-gray-600">Bus Name</p>
              <p className="font-medium">{bookingDetails.busName}</p>
              <p className="text-sm text-gray-500">Bus ID: {bookingDetails.busId}</p>
            </div>
            <div>
              <p className="text-gray-600">Timings</p>
              <p className="font-medium">Departure: {bookingDetails.departureTime}</p>
              <p className="text-sm text-gray-500">Arrival: {bookingDetails.arrivalTime}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {!showPassengerForm && !showPaymentForm && (
              <SeatLayout onSeatSelect={handleSeatSelect} maxSeats={8} />
            )}

            {showPassengerForm && !showPaymentForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Passenger Details</h3>
                <form onSubmit={handlePassengerSubmit} className="space-y-6">
                  {selectedSeats.map((seatNo, index) => (
                    <div key={seatNo} className="passenger-form bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Passenger {index + 1} - Seat {seatNo}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            name="age"
                            min="1"
                            max="120"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            name="gender"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {showPaymentForm && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-6">Payment Details</h3>
                
                {/* Payment Method Slider */}
                <div className="mb-8 overflow-x-auto">
                  <div className="flex space-x-4 min-w-max">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'bg-red-50 border-2 border-red-600'
                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                        }`}
                        style={{ minWidth: '160px' }}
                      >
                        <span className="text-3xl mb-2">{method.icon}</span>
                        <span className="font-medium text-gray-800">{method.name}</span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          {method.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-6">
                  {renderPaymentForm()}

                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Base Fare (₹{baseFare} × {selectedSeats.length})</span>
                      <span>₹{baseFare * selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Service Tax (5%)</span>
                      <span>₹{Math.round(baseFare * selectedSeats.length * 0.05)}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg mt-4 pt-4 border-t border-gray-200">
                      <span>Total Amount</span>
                      <span>₹{Math.round(baseFare * selectedSeats.length * 1.05)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Pay ₹{Math.round(baseFare * selectedSeats.length * 1.05)}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats</span>
                  <span>{selectedSeats.join(', ') || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <span>₹{baseFare} per seat</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Seats</span>
                  <span>{selectedSeats.length}</span>
                </div>
                {selectedSeats.length > 0 && (
                  <>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{baseFare * selectedSeats.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Tax (5%)</span>
                      <span>₹{Math.round(baseFare * selectedSeats.length * 0.05)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-3 border-t border-gray-200">
                      <span>Total Amount</span>
                      <span>₹{Math.round(baseFare * selectedSeats.length * 1.05)}</span>
                    </div>
                  </>
                )}
              </div>
              {!showPassengerForm && !showPaymentForm && selectedSeats.length > 0 && (
                <button
                  onClick={handleProceedToPassengers}
                  className="w-full bg-red-600 text-white py-2 rounded-lg mt-6 hover:bg-red-700 transition duration-300"
                >
                  Proceed with {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
