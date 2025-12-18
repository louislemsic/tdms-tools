"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COUNTRIES_URL = "/countries.json";

interface Country {
  name: string;
  flag: string;
  code: string;
  dial_code: string;
}

export interface Step1Data {
  missionerName: string;
  nation: string;
  date: Date | undefined;
  church: string;
}

interface Step1FormProps {
  initialValues?: Partial<Step1Data>;
  onDataChange?: (data: Step1Data) => void;
}

export function Step1Form({ initialValues, onDataChange }: Step1FormProps) {
  const [missionerName, setMissionerName] = useState(initialValues?.missionerName || "");
  const [nation, setNation] = useState(initialValues?.nation || "");
  const [date, setDate] = useState<Date | undefined>(
    initialValues?.date instanceof Date 
      ? initialValues.date 
      : initialValues?.date 
        ? new Date(initialValues.date as any) 
        : undefined
  );
  const [church, setChurch] = useState(initialValues?.church || "");
  const [countriesData, setCountriesData] = useState<Country[]>([]);

  useEffect(() => {
    fetch(COUNTRIES_URL)
      .then((res) => res.json())
      .then((data) => setCountriesData(data))
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        missionerName,
        nation,
        date,
        church,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionerName, nation, date, church]);


  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Missioner Information</h2>
      
      <div className="space-y-2">
        <Label htmlFor="missioner-name">Missioner&apos;s Name</Label>
        <Input
          id="missioner-name"
          value={missionerName}
          onChange={(e) => setMissionerName(e.target.value)}
          placeholder="Enter missioner's name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nation">Nation</Label>
        <Select value={nation} onValueChange={setNation}>
          <SelectTrigger id="nation">
            <SelectValue placeholder="Select a nation" />
          </SelectTrigger>
          <SelectContent>
            {countriesData.map((country) => (
              <SelectItem key={country.code} value={country.code}>
                <span className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="travel-date">Travel Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="travel-date"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sending-church">Sending Church</Label>
        <Input
          id="sending-church"
          value={church}
          onChange={(e) => setChurch(e.target.value)}
          placeholder="Enter sending church"
        />
      </div>
    </div>
  );
}
