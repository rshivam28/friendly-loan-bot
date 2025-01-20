import { Image } from "@/components/ui/image";

export const LoanHeader = () => {
  return (
    <div className="bg-[#00204e] p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/9c195468-5443-43e5-9eb0-d552f84a4dba.png" 
          alt="Bajaj Finance Logo" 
          className="h-8"
        />
        <h1 className="text-white text-xl font-semibold">Personal Loan Application</h1>
      </div>
    </div>
  );
};