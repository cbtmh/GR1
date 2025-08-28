
const Stats = ({ stats }) => {
    return (
      <div className="mt-16 bg-blue-600 rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="p-8 text-center border-b md:border-b-0 md:border-r border-blue-500 last:border-0"
            >
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default Stats