import pinsMocks from "@/mocks/pinsMocks";
import PinsCard from "@/components/PinsCard";

const PinsList = () => {
  return (
    <div className="flex justify-center h-auto bg-gradient-to-tr to-slate-300 from-slate-500 py-3 px-4">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:gap-10">
        {pinsMocks.map((pin) => (
          <PinsCard key={pin.id} pin={pin} />
        ))}
      </div>
    </div>
  );
};

export default PinsList;
