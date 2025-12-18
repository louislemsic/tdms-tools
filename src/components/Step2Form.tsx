"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Step2Data {
  partnerName: string;
  amount: string;
  denomination: "PHP" | "USD";
  email: string;
  mobile: string;
  localChurch: string;
  isVictoryMember: boolean | null;
}

interface Step2FormProps {
  initialValues?: Partial<Step2Data>;
  onDataChange?: (data: Step2Data) => void;
}

export function Step2Form({ initialValues, onDataChange }: Step2FormProps) {
  const [partnerName, setPartnerName] = useState(initialValues?.partnerName || "");
  const [amount, setAmount] = useState(initialValues?.amount || "");
  const [denomination, setDenomination] = useState<"PHP" | "USD">(
    initialValues?.denomination || "PHP"
  );
  const [email, setEmail] = useState(initialValues?.email || "");
  const [mobile, setMobile] = useState(initialValues?.mobile || "");
  const [localChurch, setLocalChurch] = useState(initialValues?.localChurch || "");
  const [isVictoryMember, setIsVictoryMember] = useState<boolean | null>(
    initialValues?.isVictoryMember ?? null
  );

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        partnerName,
        amount,
        denomination,
        email,
        mobile,
        localChurch,
        isVictoryMember,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerName, amount, denomination, email, mobile, localChurch, isVictoryMember]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Partner Information</h2>
      
      <div className="space-y-2">
        <Label htmlFor="partner-name">Partner&apos;s Name</Label>
        <Input
          id="partner-name"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="Enter partner's name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="denomination">Denomination</Label>
          <Select value={denomination} onValueChange={(value: "PHP" | "USD") => setDenomination(value)}>
            <SelectTrigger id="denomination">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PHP">PHP</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          type="tel"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="local-church">Local Church</Label>
        <Input
          id="local-church"
          value={localChurch}
          onChange={(e) => setLocalChurch(e.target.value)}
          placeholder="Enter local church"
        />
      </div>

      <div className="space-y-4 border-t pt-6 mt-6">
        <Label className="text-base font-semibold">
          Are you a member of Victory Christian Fellowship in the Philippines?
        </Label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsVictoryMember(true)}
            className={`px-4 py-2 rounded-md border-2 transition-colors ${
              isVictoryMember === true
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setIsVictoryMember(false)}
            className={`px-4 py-2 rounded-md border-2 transition-colors ${
              isVictoryMember === false
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}

