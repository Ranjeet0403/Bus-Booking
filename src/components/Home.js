import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    state: '',
    city: '',
    toState: '',
    toCity: '',
    date: ''
  });

  // List of states and their cities
  const stateData = {
    // Northern States
    'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Pitampura'],
    'Punjab': ['Amritsar', 'Ludhiana', 'Jalandhar', 'Patiala', 'Chandigarh'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Ghaziabad'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Kullu', 'Dalhousie'],
    'Jammu & Kashmir': ['Srinagar', 'Jammu', 'Gulmarg', 'Pahalgam', 'Leh'],

    // Eastern States
    'West Bengal': ['Kolkata', 'Siliguri', 'Darjeeling', 'Durgapur', 'Asansol'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar'],
    'Odisha': ['Bhubaneswar', 'Puri', 'Cuttack', 'Rourkela', 'Sambalpur'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
    'Sikkim': ['Gangtok', 'Pelling', 'Namchi', 'Ravangla', 'Lachung'],
    'Meghalaya': ['Shillong', 'Cherrapunji', 'Tura', 'Jowai', 'Nongpoh'],

    // Southern States (existing)
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy'],
    'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati']
  };

  // Get cities based on selected state
  const getCities = (state) => {
    return state ? stateData[state] || [] : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchData.city || !searchData.toCity || !searchData.date) {
      alert('Please fill in all fields');
      return;
    }
    navigate('/search', { 
      state: { 
        from: searchData.city,
        fromState: searchData.state,
        to: searchData.toCity,
        toState: searchData.toState,
        date: searchData.date 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[500px]"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")'
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-4 text-center">
            Welcome to SarkariiBUSS
          </h1>
          <p className="text-xl text-white mb-8 text-center">
            Your trusted partner for comfortable and safe bus travel
          </p>
          
          {/* Search Form */}
          <div className="w-full max-w-4xl px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* From Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      From State
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchData.state}
                      onChange={(e) => setSearchData({ 
                        ...searchData, 
                        state: e.target.value,
                        city: '' // Reset city when state changes
                      })}
                      required
                    >
                      <option value="">Select State</option>
                      {Object.keys(stateData).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      From City
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchData.city}
                      onChange={(e) => setSearchData({ ...searchData, city: e.target.value })}
                      required
                      disabled={!searchData.state}
                    >
                      <option value="">Select City</option>
                      {getCities(searchData.state).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* To Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      To State
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchData.toState}
                      onChange={(e) => setSearchData({ 
                        ...searchData, 
                        toState: e.target.value,
                        toCity: '' // Reset city when state changes
                      })}
                      required
                    >
                      <option value="">Select State</option>
                      {Object.keys(stateData).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      To City
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={searchData.toCity}
                      onChange={(e) => setSearchData({ ...searchData, toCity: e.target.value })}
                      required
                      disabled={!searchData.toState}
                    >
                      <option value="">Select City</option>
                      {getCities(searchData.toState).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  min={new Date().toISOString().split('T')[0]}
                  value={searchData.date}
                  onChange={(e) => setSearchData({ ...searchData, date: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Search Buses
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SarkariiBUSS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Book your tickets anytime, anywhere</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Safe and secure payment options</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Support</h3>
              <p className="text-gray-600">Dedicated support team at your service</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-12 bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Indian Buses</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-4">
              India has one of the largest and most extensive bus transportation networks in the world. 
              The state-run bus services, operated by State Road Transport Corporations (SRTCs), form 
              the backbone of public transportation in India, connecting thousands of cities and villages.
            </p>
            <p className="text-gray-600 mb-4">
              From luxury buses with modern amenities to economical services, Indian buses cater to all 
              segments of society. The network includes air-conditioned Volvo buses, sleeper coaches, 
              and regular services, making it accessible and affordable for everyone.
            </p>
            <p className="text-gray-600">
              SarkariiBUSS partners with various state transport corporations and private operators to 
              provide you with the best bus travel experience. Our platform offers easy booking, 
              transparent pricing, and reliable service across the country.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-12 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                <div className="space-y-4">
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    1800-123-4567 (Toll Free)
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@sarkariibuss.com
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    123 Transport Bhavan, Delhi - 110001
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Support Hours</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">Monday - Saturday: 24 hours</p>
                  <p className="text-gray-600">Sunday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 mt-4">
                    For emergency support outside of these hours,
                    please email us at emergency@sarkariibuss.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
