import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserGraduate, FaBook, FaChalkboardTeacher } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative h-screen bg-gradient-to-r from-indigo-600 via-purple-700 to-blue-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center items-start h-full text-white">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
            CONNECT WITH <br />
            EXCEPTIONAL TUTORS
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Find personalized learning solutions across all subjects, education levels, 
            and locations with our expert-matched tutoring platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/tutors" 
              className="bg-white text-indigo-700 hover:bg-indigo-100 font-bold py-3 px-6 rounded-md transition duration-300"
            >
              Find a Tutor
            </Link>
            <Link 
              to="/register" 
              className="bg-transparent hover:bg-white hover:text-indigo-700 text-white font-bold py-3 px-6 border-2 border-white rounded-md transition duration-300"
            >
              Become a Tutor
            </Link>
          </div>
        </div>
        
        {/* Dark overlay at bottom for smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Three Column Feature Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Column 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="bg-indigo-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <FaUserGraduate className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">STUDENTS</h3>
              <p className="text-gray-600 mb-4">
                Access personalized learning experiences with verified tutors, 
                tailored sessions for all subjects, and flexible scheduling options to 
                improve academic performance.
              </p>
              <Link to="/students" className="text-indigo-600 font-medium hover:underline">
                Learn more →
              </Link>
            </div>

            {/* Column 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="bg-purple-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <FaChalkboardTeacher className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">TUTORS</h3>
              <p className="text-gray-600 mb-4">
                Join our network of professional educators, set your own rates and schedule,
                connect with motivated students, and build your teaching portfolio with our
                comprehensive platform.
              </p>
              <Link to="/tutors" className="text-purple-600 font-medium hover:underline">
                Learn more →
              </Link>
            </div>

            {/* Column 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="bg-blue-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-6">
                <FaBook className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4">SUBJECTS</h3>
              <p className="text-gray-600 mb-4">
                Explore our extensive range of academic subjects, specialized topics,
                test preparation services, and skill development courses designed to meet
                diverse educational needs.
              </p>
              <Link to="/subjects" className="text-blue-600 font-medium hover:underline">
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Find Your Perfect Tutor</h2>
            <p className="text-xl text-gray-600">
              Search from our extensive database of qualified tutors based on subject expertise
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const subject = e.target.subject.value;
                if (subject) {
                  window.location.href = `/tutors?subject=${subject}`;
                } else {
                  window.location.href = '/tutors';
                }
              }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
                <select 
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0"
                >
                  <option value="">All Subjects</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="english">English</option>
                  <option value="history">History</option>
                  <option value="programming">Programming</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="economics">Economics</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg flex items-center justify-center transition duration-300"
              >
                <FaSearch className="mr-2" />
                <span>Search Tutors</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-indigo-200">Qualified Tutors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-indigo-200">Students Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-indigo-200">Subjects Offered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-indigo-200">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
            
            <div className="mb-10">
              <div className="italic text-xl mb-4">
                "Finding a math tutor for my daughter was incredibly easy with Tutor Finder. 
                Her grades improved significantly after just a few sessions."
              </div>
              <div className="font-medium">Sarah P., Parent</div>
            </div>
            
            <div>
              <Link 
                to="/testimonials" 
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg transition duration-300"
              >
                Read More Testimonials
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8">
              Join thousands of students and tutors who are already benefiting from our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/tutors" 
                className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-8 border-2 border-white rounded-lg transition duration-300"
              >
                Browse Tutors
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;