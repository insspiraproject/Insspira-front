import StarBorder from "@/components/StarBorder";

const Subscriptions = () => {
    

    return(
        <div className="w-full min-h-screen flex flex-col md:flex-row justify-center items-center gap-6  px-4 bg-[var(--violeta)]">
  <StarBorder
    as="div"
    className="w-full max-w-sm flex-1"
    color="magenta"
    speed="5s"
  >
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform">
      <h2 className="text-2xl font-bold mb-4 text-center">Monthly</h2>
      <p className="text-gray-600 mb-6 text-center">Pay month-to-month</p>
      <p className="text-3xl font-semibold mb-6 text-center">$10 / month</p>
      <ul className="mb-6 space-y-2">
        <li>✔ Access to all content</li>
        <li>✔ Community support</li>
        <li>✔ Some premium features</li>
      </ul>
      <button className="w-full bg-[var(--rosa)] text-white py-2 rounded-full hover:bg-[var(--morado)] transition-colors">
        Choose Monthly
      </button>
    </div>
  </StarBorder>
  
  <StarBorder
    as="div"
    className="w-full max-w-sm flex-1"
    color="magenta"
    speed="5s"
  >
    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col justify-between hover:scale-105 transition-transform">
      <h2 className="text-2xl font-bold mb-4 text-center">Annual</h2>
      <p className="text-gray-600 mb-6 text-center">Save 20% with yearly payment</p>
      <p className="text-3xl font-semibold mb-6 text-center">$100 / year</p>
      <ul className="mb-6 space-y-2">
        <li>✔ Access to all content</li>
        <li>✔ Community support</li>
        <li>✔ All premium features</li>
      </ul>
      <button className="w-full bg-purple-700 text-white py-2 rounded-full hover:bg-purple-500 transition-colors">
        Choose Annual
      </button>
    </div>
  </StarBorder>

</div>

    )
};

export default Subscriptions