import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ResumeColorPickerProps {
  onColorChange: (color: string) => void;
  initialColor?: string;
}

const predefinedColors = [
  { name: "Red", value: "#ab2034" },
  { name: "Blue", value: "#2563eb" },
  { name: "Green", value: "#16a34a" },
  { name: "Purple", value: "#9333ea" },
  { name: "Orange", value: "#ea580c" },
  { name: "Teal", value: "#0d9488" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Pink", value: "#ec4899" },
  { name: "Gray", value: "#64748b" },
  { name: "Black", value: "#000000" },
];

export const ResumeColorPicker: React.FC<ResumeColorPickerProps> = ({ 
  onColorChange, 
  initialColor = "#ab2034" 
}) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [customColor, setCustomColor] = useState("");
  const [isCustomColorValid, setIsCustomColorValid] = useState(true);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
    setShowCustomInput(false);
    setIsCustomColorValid(true);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomColor(value);
    
    // Validate hex color
    const isValid = /^#[0-9A-Fa-f]{6}$/.test(value);
    setIsCustomColorValid(isValid);
  };

  const applyCustomColor = () => {
    if (isCustomColorValid) {
      setSelectedColor(customColor);
      onColorChange(customColor);
      setShowCustomInput(false);
    }
  };

  const cancelCustomColor = () => {
    setShowCustomInput(false);
    setCustomColor("");
    setIsCustomColorValid(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {predefinedColors.map((color) => (
          <button
            key={color.value}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.value 
                ? "border-gray-800 scale-110" 
                : "border-transparent hover:border-gray-300"
            }`}
            style={{ backgroundColor: color.value }}
            onClick={() => handleColorSelect(color.value)}
            title={color.name}
          />
        ))}
        <button
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            showCustomInput 
              ? "border-gray-800 bg-white" 
              : "border-transparent hover:border-gray-300 bg-gradient-to-br from-purple-500 to-pink-500"
          }`}
          onClick={() => setShowCustomInput(true)}
          title="Custom Color"
        >
          {showCustomInput && <span className="text-xs">+</span>}
        </button>
      </div>

      {showCustomInput && (
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="#000000"
              value={customColor}
              onChange={handleCustomColorChange}
              className={`pr-8 ${!isCustomColorValid ? "border-red-500" : ""}`}
            />
            <div 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
              style={{ backgroundColor: isCustomColorValid ? customColor : "#ef4444" }}
            />
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={applyCustomColor}
            disabled={!isCustomColorValid || !customColor}
          >
            <Check className="h-4 w-4 mr-1" />
            Apply
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={cancelCustomColor}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {!showCustomInput && (
        <div className="text-sm text-gray-500 mt-2">
          Selected color: <span className="font-medium">{selectedColor}</span>
        </div>
      )}
    </div>
  );
}; 