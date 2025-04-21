"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { X, DollarSign } from "lucide-react";

interface SellPositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSell: (data: any) => void;
  companyId?: string;
  companyName?: string;
  currentValue?: number;
}

export function SellPositionModal({ 
  isOpen, 
  onClose, 
  onSell, 
  companyId, 
  companyName = "Goodboy Indonesia",
  currentValue = 3200000
}: SellPositionModalProps) {
  const [percentage, setPercentage] = useState(100);
  const [askingPrice, setAskingPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [feePercentage] = useState(6);

  useEffect(() => {
    // Reset form when modal opens
    if (isOpen) {
      setPercentage(100);
      setAskingPrice(currentValue.toString());
      setDiscount(0);
    }
  }, [isOpen, currentValue]);

  const handlePercentageChange = (newValue: number[]) => {
    const value = newValue[0];
    setPercentage(value);
    
    // Update asking price based on the percentage of current value
    const valueToSell = (currentValue * value) / 100;
    setAskingPrice(valueToSell.toString());
  };

  const handleAskingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAskingPrice(value);
    
    const numValue = parseFloat(value) || 0;
    const offeringValue = (currentValue * percentage) / 100;
    
    // Calculate discount percentage
    if (offeringValue > 0) {
      const discountPct = ((offeringValue - numValue) / offeringValue) * 100;
      setDiscount(discountPct > 0 ? discountPct : 0);
    }
  };
  
  const calculateFee = () => {
    const value = parseFloat(askingPrice) || 0;
    return (value * feePercentage) / 100;
  };
  
  const calculateNetEarnings = () => {
    const value = parseFloat(askingPrice) || 0;
    const fee = calculateFee();
    return value - fee;
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSubmit = () => {
    onSell({
      companyId,
      percentage,
      askingPrice: parseFloat(askingPrice),
      discount,
      fee: calculateFee(),
      netEarnings: calculateNetEarnings()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#171e2e] border-zinc-800 text-white sm:max-w-[550px] p-0 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-zinc-800">
          <div>
            <DialogTitle className="text-xl font-bold text-white">Sell your Security To 1000+ Investors</DialogTitle>
            <p className="text-zinc-400 mt-1">List your position on the secondary market</p>
          </div>
          <DialogClose className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-zinc-800">
            <X className="h-4 w-4 text-zinc-400" />
          </DialogClose>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-md bg-zinc-800 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-violet-900/30 flex items-center justify-center">
                <span className="text-lg font-semibold text-violet-400">
                  {companyName?.charAt(0)}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{companyName}</h3>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-zinc-400">Current Portfolio Value:</p>
            <p className="text-white font-semibold">{formatCurrency(currentValue)} USD</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-zinc-400">Portfolio Percentage to Offer</p>
              <p className="text-white">{percentage}%</p>
            </div>
            <Slider 
              defaultValue={[100]} 
              max={100} 
              step={1}
              value={[percentage]}
              onValueChange={handlePercentageChange}
              className="my-4"
            />
            <p className="text-zinc-400 text-sm">
              Offering {percentage}% of your position ({formatCurrency((currentValue * percentage) / 100)})
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-zinc-400">Your Asking Price (USD)</p>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="number"
                placeholder="Enter your asking price"
                className="pl-10 bg-[#1F2937] border-zinc-700 text-white"
                value={askingPrice}
                onChange={handleAskingPriceChange}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-zinc-400">Potential Discount:</p>
              <p className={`${discount > 0 ? 'text-green-400' : 'text-white'} font-medium`}>
                {discount.toFixed(0)}%
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-zinc-400">Security Value:</p>
              <p className="text-white font-medium">{formatCurrency((currentValue * percentage) / 100)}</p>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-zinc-400">Fee to DeeDee ({feePercentage}%):</p>
              <p className="text-white font-medium">{formatCurrency(calculateFee())}</p>
            </div>

            <div className="flex justify-between items-center border-t border-zinc-700 pt-4">
              <p className="text-zinc-400">Expected Net Earnings:</p>
              <p className="text-green-400 font-bold text-lg">{formatCurrency(calculateNetEarnings())}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between p-6 pt-2">
          <Button
            variant="outline"
            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSubmit}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Add to DeeDee Marketplace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 