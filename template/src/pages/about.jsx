import React, { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaUsers,
  FaHandshake,
  FaStar,
  FaChalkboardTeacher,
  FaLightbulb,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";


const AboutUs = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: "Rajesh Sharma",
      role: "Founder & CEO",
      image: "/img/team/rajesh.jpg",
      bio: "Former educator with 15 years of experience in both public and private education systems. Rajesh founded Tutor Finder to bridge the gap between quality educators and students in need.",
    },
    {
      id: 2,
      name: "Amit Patel",
      role: "CTO",
      image: "/img/team/amit.jpg",
      bio: "Tech industry veteran with expertise in educational technology. Amit leads our development team in creating intuitive and accessible learning platforms.",
    },
    {
      id: 3,
      name: "Priya Singh",
      role: "Head of Tutor Relations",
      image: "/img/team/priya.jpg",
      bio: "With a background in talent acquisition and education, Priya ensures our platform attracts the most qualified and passionate tutors.",
    },
    {
      id: 4,
      name: "Vikram Mehta",
      role: "Student Success Manager",
      image: "/img/team/vikram.jpg",
      bio: "Former academic counselor dedicated to helping students achieve their educational goals through personalized learning experiences.",
    },

  ];

  // Supporters data
  const supporters = [
    {
      id: 1,
      name: "IIT Delhi",
      image: "/img/supporters/iit-delhi.png",
      description: "Academic Partner",
    },
    {
      id: 2,
      name: "Delhi Public School",
      image: "/img/supporters/dps.png",
      description: "Educational Institution Partner",
    },
    {
      id: 3,
      name: "TechEdu Foundation",
      image: "/img/supporters/techedu.png",
      description: "Non-profit Partner",
    },
    {
      id: 4,
      name: "Learning Innovators",
      image: "/img/supporters/learning-innovators.png",
      description: "EdTech Partner",
    },
    {
      id: 5,
      name: "Ministry of Education",
      image: "/img/supporters/ministry-edu.png",
      description: "Government Partner",
    },
    {
      id: 6,
      name: "Future Scholars Program",
      image: "/img/supporters/future-scholars.png",
      description: "Scholarship Partner",
    },
  ];


  // Values data
  const values = [
    {
      id: 1,
      icon: <FaGraduationCap className="text-5xl mb-4 text-indigo-500" />,
      title: "Quality Education",
      description:
        "We believe everyone deserves access to high-quality education that adapts to their unique learning style and pace.",

    },
    {
      id: 2,
      icon: <FaUsers className="text-5xl mb-4 text-indigo-500" />,
      title: "Community",
      description:
        "We foster a supportive community where tutors and students can connect, collaborate, and grow together.",

    },
    {
      id: 3,
      icon: <FaHandshake className="text-5xl mb-4 text-indigo-500" />,
      title: "Integrity",
      description:
        "We uphold the highest standards of honesty, transparency, and fairness in all our operations and interactions.",

    },
    {
      id: 4,
      icon: <FaStar className="text-5xl mb-4 text-indigo-500" />,
      title: "Excellence",
      description:
        "We continuously strive for excellence in our platform, our service, and the educational outcomes we help achieve.",

    },
    {
      id: 5,
      icon: <FaChalkboardTeacher className="text-5xl mb-4 text-indigo-500" />,
      title: "Empowerment",
      description:
        "We empower both tutors and students to take control of their educational journey and achieve their goals.",

    },
    {
      id: 6,
      icon: <FaLightbulb className="text-5xl mb-4 text-indigo-500" />,
      title: "Innovation",
      description:
        "We embrace innovative approaches to teaching and learning, leveraging technology to enhance the educational experience.",
    },
  ];

  // Milestones data
  const milestones = [
    {
      year: 2020,
      event:
        "Tutor Finder was founded with a mission to connect students with quality tutors",
    },
    {
      year: 2021,
      event:
        "Expanded our tutor network to include over 1,000 verified professionals",
    },
    {
      year: 2022,
      event: "Launched our mobile app to facilitate learning on-the-go",
    },
    {
      year: 2023,
      event: "Introduced specialized subject tracks and certification programs",
    },
    {
      year: 2024,
      event:
        "Reached milestone of helping 10,000+ students improve their academic performance",
    },
    {
      year: 2025,
      event: "Expanded internationally to serve students across 20+ countries",
    },
  ];

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive items per slide
  const itemsPerSlide = isMobile ? 1 : 3; // Show 1 supporter on mobile, 3 on desktop
  const totalSlides = isMobile
    ? supporters.length
    : Math.ceil(supporters.length / itemsPerSlide);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setCurrentSlide(0); // Reset to first slide on resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to section if hash is present in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalSlides]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              About Tutor Finder
            </h1>
            <p className="text-lg sm:text-xl text-gray-100">
              We're on a mission to transform education by connecting motivated
              students with exceptional tutors, making quality learning
              accessible to everyone, anywhere.

            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg mb-4">
                Tutor Finder was born from a simple observation: despite living
                in a digital age, finding the right educational support remained
                unnecessarily complicated. Our founder, a former teacher, saw
                firsthand the transformative impact that personalized tutoring
                could have on student achievement and confidence.
              </p>
              <p className="text-lg mb-4">
                Started in 2020, we built Tutor Finder with the vision of
                creating an intuitive platform that removes barriers between
                qualified educators and eager learners. We carefully vet each
                tutor, ensuring they have both the academic credentials and the
                communication skills needed to deliver exceptional learning
                experiences.
              </p>
              <p className="text-lg">
                Today, we're proud to host a diverse community of tutors
                specializing in subjects ranging from elementary math to
                advanced university courses. Our platform has facilitated
                thousands of successful tutoring relationships, helping students
                achieve their academic goals and build confidence in their
                abilities.

              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.id}
                className="bg-gray-50 rounded-lg p-8 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
              >

                {value.icon}
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ddd' width='300' height='300'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ETeam Member%3C/text%3E%3C/svg%3E";

                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">
                    {member.role}
                  </p>

                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Supporters - Premium Carousel Section */}
      <section
        id="trusted-partners"
        className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4 sm:mb-6">
              <span className="bg-yellow-400 text-indigo-900 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg">
                Trusted Partners
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6">
              <span className="text-white">Backed by the</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent mt-2">
                Best in Education
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4">
              Proudly partnering with India's leading educational institutions
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-7xl mx-auto">
            {/* Carousel Track */}
            <div
              className={`overflow-hidden ${
                isMobile ? "h-[500px] sm:h-[550px]" : ""
              }`}
            >
              <div
                className={`flex transition-transform duration-700 ease-in-out ${
                  isMobile ? "flex-col" : "flex-row"
                }`}
                style={
                  isMobile
                    ? { transform: `translateY(-${currentSlide * 100}%)` }
                    : { transform: `translateX(-${currentSlide * 100}%)` }
                }
              >
                {isMobile
                  ? // Mobile: Show one card per slide
                    supporters.map((supporter) => (
                      <div
                        key={supporter.id}
                        className="min-h-[500px] sm:min-h-[550px] w-full flex items-center justify-center px-4 py-8"
                      >
                        <div className="w-full max-w-sm group relative">
                          {/* Card with glow effect */}
                          <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 hover:-translate-y-2 h-full">
                            {/* Glowing border on hover */}
                            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                            {/* Card content */}
                            <div className="relative bg-white rounded-2xl sm:rounded-3xl p-1">
                              {/* Premium badge */}
                              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-indigo-900 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300 z-10">
                                <FaStar className="text-lg sm:text-xl" />
                              </div>

                              {/* Logo container */}
                              <div className="h-48 sm:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 rounded-xl sm:rounded-2xl mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                <img
                                  src={supporter.image}
                                  alt={supporter.name}
                                  className="max-h-full w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                  onError={(e) => {
                                    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='160'%3E%3Crect fill='%23f0f0f0' width='240' height='160'/%3E%3Ctext fill='%236366f1' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${supporter.name}%3C/text%3E%3C/svg%3E`;
                                  }}
                                />
                              </div>

                              {/* Partner info */}
                              <div className="text-center">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                                  {supporter.name}
                                </h3>
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                                  <FaHandshake className="text-sm" />
                                  {supporter.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : // Desktop: Show 3 cards per slide
                    Array.from({ length: totalSlides }).map((_, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="min-w-full flex gap-4 sm:gap-6 px-2"
                      >
                        {supporters
                          .slice(
                            slideIndex * itemsPerSlide,
                            (slideIndex + 1) * itemsPerSlide
                          )
                          .map((supporter) => (
                            <div
                              key={supporter.id}
                              className="flex-1 group relative"
                            >
                              {/* Card with glow effect */}
                              <div className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 hover:-translate-y-2 h-full">
                                {/* Glowing border on hover */}
                                <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                                {/* Card content */}
                                <div className="relative bg-white rounded-2xl sm:rounded-3xl p-1">
                                  {/* Premium badge */}
                                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-indigo-900 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300 z-10">
                                    <FaStar className="text-lg sm:text-xl" />
                                  </div>

                                  {/* Logo container */}
                                  <div className="h-40 sm:h-48 md:h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <img
                                      src={supporter.image}
                                      alt={supporter.name}
                                      className="max-h-full w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                      onError={(e) => {
                                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='160'%3E%3Crect fill='%23f0f0f0' width='240' height='160'/%3E%3Ctext fill='%236366f1' font-family='sans-serif' font-size='18' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E${supporter.name}%3C/text%3E%3C/svg%3E`;
                                      }}
                                    />
                                  </div>

                                  {/* Partner info */}
                                  <div className="text-center">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                                      {supporter.name}
                                    </h3>
                                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
                                      <FaHandshake className="text-sm" />
                                      {supporter.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className={`absolute ${
                isMobile
                  ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  : "left-0 sm:-left-4 md:-left-6 top-1/2 -translate-y-1/2"
              } bg-white hover:bg-yellow-400 text-indigo-900 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl hover:shadow-yellow-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10`}
              aria-label="Previous slide"
            >
              {isMobile ? (
                <FaChevronLeft className="text-xl sm:text-2xl rotate-90" />
              ) : (
                <FaChevronLeft className="text-xl sm:text-2xl" />
              )}
            </button>

            <button
              onClick={nextSlide}
              className={`absolute ${
                isMobile
                  ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                  : "right-0 sm:-right-4 md:-right-6 top-1/2 -translate-y-1/2"
              } bg-white hover:bg-yellow-400 text-indigo-900 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-2xl hover:shadow-yellow-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110 z-10`}
              aria-label="Next slide"
            >
              {isMobile ? (
                <FaChevronRight className="text-xl sm:text-2xl rotate-90" />
              ) : (
                <FaChevronRight className="text-xl sm:text-2xl" />
              )}
            </button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? "w-8 sm:w-12 h-2 sm:h-3 bg-yellow-400"
                      : "w-2 sm:w-3 h-2 sm:h-3 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-2">
                10+
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Partner Institutions
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Students Impacted
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Verified Partners
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-2">
                5★
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium">
                Partner Rating
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-base sm:text-lg text-gray-200 mb-6 sm:mb-8">
              Want to become a partner?
            </p>
            <button className="group bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-indigo-900 font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-full text-base sm:text-lg shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
              <FaHandshake className="text-xl sm:text-2xl group-hover:rotate-12 transition-transform duration-300" />
              Partner With Us
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>


      {/* Milestones */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-6">
                    <div className="rounded-full bg-indigo-600 text-white font-bold w-16 h-16 flex items-center justify-center">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="h-full w-1 bg-indigo-200 my-1"></div>
                    )}
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 flex-1 transform transition duration-300 hover:-translate-x-2">
                    <p className="text-lg">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl italic">
              "To democratize education by creating meaningful connections
              between students and tutors, fostering personalized learning
              experiences that inspire confidence, curiosity, and academic
              excellence."

            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="text-xl mb-8">
              Have questions about Tutor Finder? We'd love to hear from you!
            </p>
            <a
              href="/contact"

              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <style>{`

        /* Essential 3D styles */
        .perspective {
          perspective: 1200px;
        }
        
        .transform-style-preserve3d {
          transform-style: preserve-3d;
        }
        
        .spin-container {
          transform-origin: center center;
        }
        
        .supporter-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transform-origin: center center;
          transition: transform 1s;
        }
        
        .supporter-card:hover {
          z-index: 1;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
          transform: scale(1.05) translateZ(20px);
        }
        
        /* Reflection effect */
        .supporter-card:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -30px;
          width: 100%;
          height: 30px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
          transform: rotateX(90deg);
          transform-origin: top;
          filter: blur(2px);
        }
        
        /* Ground */
        .bg-gradient-radial {
          background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
        }
        
        /* Hide card backs */
        .supporter-card > div {
          backface-visibility: hidden;
        }
        
        /* Fix Firefox transform issues */
        @-moz-document url-prefix() {
          .supporter-card {
            will-change: transform;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;

