import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BusSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state || {};

  // Mock bus data
  const buses = [
    {
      id: 1,
      name: 'Express Travels',
      type: 'AC Sleeper',
      departure: '21:00',
      arrival: '06:00',
      duration: '9h',
      price: 899,
      seats: 23,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Royal Travels',
      type: 'Non-AC Seater',
      departure: '22:00',
      arrival: '08:00',
      duration: '10h',
      price: 599,
      seats: 15,
      rating: 4.2
    },
    {
      id: 3,
      name: 'Comfort Line',
      type: 'AC Semi-Sleeper',
      departure: '20:30',
      arrival: '05:30',
      duration: '9h',
      price: 799,
      seats: 32,
      rating: 4.7
    }
  ];

  const handleBooking = (bus) => {
    // Navigate directly to payment page with bus and search details
    navigate('/payment', { 
      state: { 
        ...searchData,
        busId: bus.id,
        busName: bus.name,
        busType: bus.type,
        departureTime: bus.departure,
        arrivalTime: bus.arrival,
        basePrice: bus.price
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">{searchData.from}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span className="text-lg font-semibold">{searchData.to}</span>
            </div>
            <div className="text-gray-600">
              <span>{searchData.date}</span>
            </div>
          </div>
        </div>

        {/* Bus List */}
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800">{bus.name}</h3>
                  <p className="text-gray-600">{bus.type}</p>
                  <div className="flex items-center mt-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-600">{bus.rating}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-800">
                    <div className="font-semibold">{bus.departure}</div>
                    <div className="text-sm text-gray-500">to</div>
                    <div className="font-semibold">{bus.arrival}</div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{bus.duration}</div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-gray-800">₹{bus.price}</div>
                  <div className="text-sm text-gray-500">{bus.seats} seats left</div>
                  <button
                    onClick={() => handleBooking(bus)}
                    className="mt-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusSearch;
