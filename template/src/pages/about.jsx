import React, { useState, useEffect, useRef } from 'react';
import { FaGraduationCap, FaUsers, FaHandshake, FaStar, FaChalkboardTeacher, FaLightbulb } from 'react-icons/fa';

const AboutUs = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Rajesh Sharma',
      role: 'Founder & CEO',
      image: '/img/team/rajesh.jpg',
      bio: 'Former educator with 15 years of experience in both public and private education systems. Rajesh founded Tutor Finder to bridge the gap between quality educators and students in need.',
    },
    {
      id: 2,
      name: 'Amit Patel',
      role: 'CTO',
      image: '/img/team/amit.jpg',
      bio: 'Tech industry veteran with expertise in educational technology. Amit leads our development team in creating intuitive and accessible learning platforms.',
    },
    {
      id: 3,
      name: 'Priya Singh',
      role: 'Head of Tutor Relations',
      image: '/img/team/priya.jpg',
      bio: 'With a background in talent acquisition and education, Priya ensures our platform attracts the most qualified and passionate tutors.',
    },
    {
      id: 4,
      name: 'Vikram Mehta',
      role: 'Student Success Manager',
      image: '/img/team/vikram.jpg',
      bio: 'Former academic counselor dedicated to helping students achieve their educational goals through personalized learning experiences.',
    }
  ];

  // Supporters data
  const supporters = [
    {
      id: 1,
      name: 'IIT Delhi',
      image: '/img/supporters/iit-delhi.png',
      description: 'Academic Partner'
    },
    {
      id: 2,
      name: 'Delhi Public School',
      image: '/img/supporters/dps.png',
      description: 'Educational Institution Partner'
    },
    {
      id: 3,
      name: 'TechEdu Foundation',
      image: '/img/supporters/techedu.png',
      description: 'Non-profit Partner'
    },
    {
      id: 4,
      name: 'Learning Innovators',
      image: '/img/supporters/learning-innovators.png',
      description: 'EdTech Partner'
    },
    {
      id: 5,
      name: 'Ministry of Education',
      image: '/img/supporters/ministry-edu.png',
      description: 'Government Partner'
    },
    {
      id: 6,
      name: 'Future Scholars Program',
      image: '/img/supporters/future-scholars.png',
      description: 'Scholarship Partner'
    },
  ];
  
  // Values data
  const values = [
    {
      id: 1,
      icon: <FaGraduationCap className="text-5xl mb-4 text-indigo-500" />,
      title: 'Quality Education',
      description: 'We believe everyone deserves access to high-quality education that adapts to their unique learning style and pace.'
    },
    {
      id: 2,
      icon: <FaUsers className="text-5xl mb-4 text-indigo-500" />,
      title: 'Community',
      description: 'We foster a supportive community where tutors and students can connect, collaborate, and grow together.'
    },
    {
      id: 3,
      icon: <FaHandshake className="text-5xl mb-4 text-indigo-500" />,
      title: 'Integrity',
      description: 'We uphold the highest standards of honesty, transparency, and fairness in all our operations and interactions.'
    },
    {
      id: 4,
      icon: <FaStar className="text-5xl mb-4 text-indigo-500" />,
      title: 'Excellence',
      description: 'We continuously strive for excellence in our platform, our service, and the educational outcomes we help achieve.'
    },
    {
      id: 5,
      icon: <FaChalkboardTeacher className="text-5xl mb-4 text-indigo-500" />,
      title: 'Empowerment',
      description: 'We empower both tutors and students to take control of their educational journey and achieve their goals.'
    },
    {
      id: 6,
      icon: <FaLightbulb className="text-5xl mb-4 text-indigo-500" />,
      title: 'Innovation',
      description: 'We embrace innovative approaches to teaching and learning, leveraging technology to enhance the educational experience.'
    }
  ];
  
  // Milestones data
  const milestones = [
    { year: 2020, event: 'Tutor Finder was founded with a mission to connect students with quality tutors' },
    { year: 2021, event: 'Expanded our tutor network to include over 1,000 verified professionals' },
    { year: 2022, event: 'Launched our mobile app to facilitate learning on-the-go' },
    { year: 2023, event: 'Introduced specialized subject tracks and certification programs' },
    { year: 2024, event: 'Reached milestone of helping 10,000+ students improve their academic performance' },
    { year: 2025, event: 'Expanded internationally to serve students across 20+ countries' }
  ];

  // 3D Carousel functionality
  const dragContainerRef = useRef(null);
  const spinContainerRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [radius, setRadius] = useState(240); // Reduced from 300 to 240
  const [dragStartX, setDragStartX] = useState(0);
  const [rotation, setRotation] = useState(0);

  // Initialize carousel on mount
  useEffect(() => {
    if (!spinContainerRef.current) return;
    
    // Position all cards in a circle
    const cards = spinContainerRef.current.getElementsByClassName('supporter-card');
    const anglePerCard = 360 / supporters.length;
    
    Array.from(cards).forEach((card, i) => {
      const angle = anglePerCard * i;
      card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
    });
  }, [supporters.length, radius]);

  // Handle auto rotation
  useEffect(() => {
    if (!autoRotate) return;
    
    const spinSpeed = 30000; // One full rotation every 30 seconds (positive value = counter-clockwise)
    let startTime = null;
    let animationId = null;
    
    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const newRotation = -(elapsed / spinSpeed) * 360 % 360; // Added negative sign for counter-clockwise
      
      setRotation(newRotation);
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [autoRotate]);

  // Handle mouse/touch drag
  const handleDragStart = (e) => {
    setAutoRotate(false);
    setDragStartX(e.clientX || (e.touches && e.touches[0].clientX) || 0);
  };
  
  const handleDragMove = (e) => {
    if (dragStartX === 0) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartX;
    // Inverted direction by multiplying by -0.5 instead of 0.5
    setRotation(prev => (prev - deltaX * 0.5) % 360);
    setDragStartX(clientX);
  };
  
  const handleDragEnd = () => {
    setDragStartX(0);
  };
  
  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY;
    setRadius(prev => Math.min(Math.max(prev - delta * 0.1, 150), 350));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">About Tutor Finder</h1>
            <p className="text-xl">
              We're on a mission to transform education by connecting motivated students with exceptional tutors, 
              making quality learning accessible to everyone, anywhere.
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
                Tutor Finder was born from a simple observation: despite living in a digital age, 
                finding the right educational support remained unnecessarily complicated. Our founder, 
                a former teacher, saw firsthand the transformative impact that personalized tutoring 
                could have on student achievement and confidence.
              </p>
              <p className="text-lg mb-4">
                Started in 2020, we built Tutor Finder with the vision of creating an intuitive platform 
                that removes barriers between qualified educators and eager learners. We carefully vet each 
                tutor, ensuring they have both the academic credentials and the communication skills needed 
                to deliver exceptional learning experiences.
              </p>
              <p className="text-lg">
                Today, we're proud to host a diverse community of tutors specializing in subjects ranging 
                from elementary math to advanced university courses. Our platform has facilitated thousands 
                of successful tutoring relationships, helping students achieve their academic goals and 
                build confidence in their abilities.
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
            {values.map(value => (
              <div key={value.id} className="bg-gray-50 rounded-lg p-8 text-center transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">
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
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Team+Member';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* /* 3D Carousel for Supporters */ }
    <section className="py-12 bg-gray-900 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">Our Supporters</h2>
        
        {/* Reduce height of the container */}
        <div className="h-[400px] relative perspective"
             onWheel={handleWheel}
        >
          <div 
            ref={dragContainerRef}
            className="drag-container absolute inset-0 w-full h-full flex items-center justify-center"
            style={{
              transform: `rotateX(-10deg)`
            }}
          >
            <div 
              ref={spinContainerRef}
              className="spin-container relative transform-style-preserve3d"
              style={{
                transform: `rotateY(${rotation}deg)`,
                transition: dragStartX === 0 ? 'transform 0.5s ease-out' : 'none'
              }}
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {supporters.map((supporter) => (
                <div 
                  key={supporter.id} 
                  className="supporter-card absolute transform-style-preserve3d"
                  style={{
                    width: '240px',         // Reduced from 300px
                    height: '300px',        // Reduced from 400px
                    left: '-120px',         // Half of new width
                    top: '-150px',          // Half of new height
                  }}
                >
                  <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
                    <div className="h-[160px] bg-gray-50 flex items-center justify-center p-2 mb-3 rounded-md">
                      <img 
                        src={supporter.image} 
                        alt={supporter.name} 
                        className="max-h-full w-full object-contain"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x120?text=Supporter';
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">{supporter.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium text-center">{supporter.description}</p>
                  </div>
                </div>
              ))}
              
              {/* Ground reflection */}
              <div className="ground absolute rounded-full bg-gradient-radial" style={{
                width: `${radius * 2.5}px`,     // Reduced multiplier from 3 to 2.5
                height: `${radius * 2.5}px`,    // Reduced multiplier from 3 to 2.5
                transform: 'rotateX(90deg) translateZ(-80px)', // Moved up from -110px to -80px
                top: '80px',                    // Reduced from 110px
                left: '0',
                background: 'radial-gradient(circle at center, rgba(101,116,205,0.2) 0%, transparent 70%)'
              }}></div>
            </div>
          </div>
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
              "To democratize education by creating meaningful connections between students and tutors, 
              fostering personalized learning experiences that inspire confidence, curiosity, and academic excellence."
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

      <style jsx global>{`
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