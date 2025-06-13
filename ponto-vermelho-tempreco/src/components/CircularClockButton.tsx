
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CircularClockButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  color: 'green' | 'yellow' | 'blue' | 'red';
}

export const CircularClockButton = ({ 
  onClick, 
  disabled, 
  icon: Icon, 
  label, 
  color 
}: CircularClockButtonProps) => {
  const colorClasses = {
    green: "bg-green-600 hover:bg-green-700 disabled:bg-green-300",
    yellow: "bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300", 
    blue: "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300",
    red: "bg-red-600 hover:bg-red-700 disabled:bg-red-300"
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105",
          colorClasses[color]
        )}
      >
        <Icon className="w-8 h-8" />
      </Button>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};
