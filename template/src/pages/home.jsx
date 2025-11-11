<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserGraduate, FaBook, FaChalkboardTeacher } from 'react-icons/fa';
=======
import React from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUserGraduate,
  FaBook,
  FaChalkboardTeacher,
  FaStar,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
>>>>>>> 181f83f (Updated Features)

const Home = () => {
  return (
    <div className="min-h-screen">
<<<<<<< HEAD
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
=======
      {/* Hero Section with Enhanced Gradient Background */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col justify-center items-center min-h-screen text-white text-center pt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight mb-6 animate-slideUp">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Tutor Today
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-12 max-w-3xl text-gray-100 animate-slideUp animation-delay-200">
            Connect with expert tutors across all subjects. Personalized
            learning, flexible scheduling, and proven results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slideUp animation-delay-400">
            <Link
              to="/tutors"
              className="group bg-white text-indigo-700 hover:bg-yellow-400 hover:text-indigo-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
            >
              <FaSearch className="mr-2 group-hover:rotate-12 transition-transform" />
              Find a Tutor
            </Link>
            <Link
              to="/signup"
              className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold py-4 px-8 border-2 border-yellow-400 hover:border-yellow-300 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Become a Tutor
            </Link>
            <Link
              to="/about#trusted-partners"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Our Sponsors
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl animate-slideUp animation-delay-600">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500">
                2,500+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Expert Tutors
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500">
                15K+
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Happy Students
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500">
                100+
              </div>
              <div className="text-sm text-gray-600 font-medium">Subjects</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500">
                4.9★
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Avg Rating
              </div>
>>>>>>> 181f83f (Updated Features)
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Features Section with Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose <span className="text-indigo-600">TutorFinder?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for successful online learning in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaUserGraduate className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Verified Tutors
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                All our tutors are thoroughly vetted and verified. Access
                personalized learning with experienced educators tailored to
                your needs.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Background checked
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Qualified & experienced
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Highly rated
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaClock className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Flexible Scheduling
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Book sessions that fit your schedule. Learn at your own pace
                with tutors available 24/7 across all time zones.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  24/7 availability
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Instant booking
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Reschedule anytime
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
              <div className="bg-gradient-to-br from-pink-500 to-yellow-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FaBook className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                All Subjects Covered
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                From elementary to advanced levels, we cover every subject.
                Math, Science, Languages, Programming, and more.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  100+ subjects
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  All grade levels
                </li>
                <li className="flex items-center text-gray-700">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Test preparation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Search Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Start Learning Today
            </h2>
            <p className="text-xl text-gray-100">
              Search from thousands of qualified tutors and start your learning
              journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
            <form
>>>>>>> 181f83f (Updated Features)
              onSubmit={(e) => {
                e.preventDefault();
                const subject = e.target.subject.value;
                if (subject) {
                  window.location.href = `/tutors?subject=${subject}`;
                } else {
<<<<<<< HEAD
                  window.location.href = '/tutors';
=======
                  window.location.href = "/tutors";
>>>>>>> 181f83f (Updated Features)
                }
              }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
<<<<<<< HEAD
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
=======
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a Subject
                </label>
                <select
                  name="subject"
                  className="w-full px-6 py-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 transition-all text-gray-900 font-medium"
                >
                  <option value="">All Subjects</option>
                  <option value="mathematics">📐 Mathematics</option>
                  <option value="science">🔬 Science</option>
                  <option value="english">📚 English</option>
                  <option value="history">📜 History</option>
                  <option value="programming">💻 Programming</option>
                  <option value="physics">⚛️ Physics</option>
                  <option value="chemistry">🧪 Chemistry</option>
                  <option value="biology">🧬 Biology</option>
                  <option value="economics">💰 Economics</option>
                  <option value="business">📊 Business</option>
                </select>
              </div>
              <button
                type="submit"
                className="md:self-end bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-8 rounded-xl flex items-center justify-center transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
              >
                <FaSearch className="mr-2" />
                <span>Find Tutors</span>
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-600">Popular:</span>
              <Link
                to="/tutors?subject=mathematics"
                className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition-colors"
              >
                Math
              </Link>
              <Link
                to="/tutors?subject=science"
                className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
              >
                Science
              </Link>
              <Link
                to="/tutors?subject=programming"
                className="text-sm bg-pink-100 text-pink-700 px-3 py-1 rounded-full hover:bg-pink-200 transition-colors"
              >
                Programming
              </Link>
              <Link
                to="/tutors?subject=english"
                className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
              >
                English
>>>>>>> 181f83f (Updated Features)
              </Link>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
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
=======
      {/* Testimonial Section with Better Design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from our happy students and parents
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl border border-indigo-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-xl">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "Finding a math tutor for my daughter was incredibly easy. Her
                grades improved from C to A in just 3 months. The platform is
                user-friendly and the tutors are highly qualified!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  S
                </div>
                <div>
                  <div className="font-bold text-gray-900">Sarah Peterson</div>
                  <div className="text-sm text-gray-500">Parent</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 text-xl">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "As a tutor, this platform has transformed my teaching career. I
                can set my own schedule, connect with motivated students, and
                focus on what I love - teaching!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                  M
                </div>
                <div>
                  <div className="font-bold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-500">Math Tutor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Modern Design */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-400 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-300">
              Join thousands of students achieving their academic goals with
              expert tutors
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-indigo-900 font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center"
              >
                <span>Get Started Free</span>
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              <Link
                to="/tutors"
                className="bg-white hover:bg-gray-100 text-indigo-900 font-bold py-4 px-10 border-2 border-white rounded-xl transition-all duration-300 hover:scale-105 shadow-xl"
>>>>>>> 181f83f (Updated Features)
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

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 181f83f (Updated Features)
