import { cn } from "@/lib/utils";

const steps = [
  "Personal details",
  "Income verification",
  "Employment details",
  "Office address",
  "Email verification",
  "Offer details",
  "Loan summary",
  "KYC verification",
  "Bank details",
  "Application submission",
  "e-Mandate"
];

export const LoanProgress = ({ currentStep = 0 }) => {
  return (
    <div className="w-full overflow-x-auto py-4 px-2">
      <div className="flex min-w-max gap-2 items-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                  index <= currentStep 
                    ? "bg-primary text-white" 
                    : "bg-gray-200 text-gray-500"
                )}
              >
                {index + 1}
              </div>
              <span className="text-xs mt-1 whitespace-nowrap">{step}</span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "h-[2px] w-8",
                  index < currentStep ? "bg-primary" : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};