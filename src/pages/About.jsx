import React from 'react'
import avatar from '../../src/assets/images/avatar.jpeg' // Assuming you have an avatar image in your assets

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-purple-500 to-indigo-600">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>

          <div className="pt-16 pb-6 px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Vu Le</h1>
            <p className="text-gray-600 mt-1">Web Developer </p>
            <p className="mt-3 text-gray-500">Ha Noi, Vietnam</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About Me</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Hello! I'm Vu, a passionate web developer and writer with over 4 years of experience creating beautiful,
              functional websites and engaging content.
            </p>
            <p className="mb-4">
              My journey in web development began during college when I built my first blog from scratch. Since then,
              I've worked with various technologies and frameworks, always striving to create exceptional user
              experiences.
            </p>
            <p>
              When I'm not coding or writing, you can find me hiking in the mountains, experimenting with new recipes in
              the kitchen, or curled up with a good book and my cat, Pixel.
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Skills & Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {["React", "JavaScript", "TypeScript", "HTML/CSS", "Node.js", "Tailwind CSS"].map((skill) => (
              <div key={skill} className="bg-gray-100 rounded-full px-4 py-2 text-sm text-center text-gray-700">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Education</h2>
          <div className="space-y-6">
            <div className="border-l-2 border-indigo-500 pl-4">
              <h3 className="text-lg font-medium text-gray-900">Web Developer</h3>
              <p className="text-sm text-gray-500">Ha Noi University of Science and Technology • 2019 - 2025</p>
              <p className="mt-2 text-gray-600">
                Developed responsive websites for various clients using modern JavaScript frameworks. Collaborated with
                designers to implement pixel-perfect UIs.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">vu.lva194720@sis.hust.edu.vn</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Ha Noi, Viet Nam</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-indigo-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://github.com/cbtmh" className="text-gray-500 hover:text-indigo-500">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-500">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About