const Timeline = ({ events }) => {
    return (
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100"></div>
  
        <div className="space-y-12">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`relative flex items-center justify-between ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              {/* Content */}
              <div className="w-5/12">
                <div className={`bg-white p-6 rounded-lg shadow-sm ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                  <span className="text-blue-600 font-bold">{event.year}</span>
                  <h3 className="text-xl font-bold text-gray-800 mt-1">{event.title}</h3>
                  <p className="text-gray-600 mt-2">{event.description}</p>
                </div>
              </div>
  
              {/* Circle marker */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-500 border-4 border-white shadow"></div>
  
              {/* Empty space for the other side */}
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default Timeline