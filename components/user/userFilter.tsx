"use  client";
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface DateRangeState {
  startDate: string;
  endDate: string;
}
interface UserType {
  _id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings?: any;
  paddleCustomerId?: string;
  freeTrialEnd?: number;
  lifeTimeDeal?: boolean;
  currentSubscription?: {
    status: 'active' | 'canceled' | 'pastDue' | 'trialing' | 'ended';
    planId: string;
    endsAt?: number;
    startDate: number;
    billingCycle: 'month' | 'year';
    paymentProcessorSubscriptionId: string;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
}


type userFilterDataType = {
  pageNumber: number;
  pageSize: number;
  setUsers: Dispatch<SetStateAction<UserType[]>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}
function UserFilter({ pageNumber, pageSize, setUsers, setLoading }: userFilterDataType) {
  const [fieldSort, setFieldSort] = useState<string>("name");
  const [sort, setSort] = useState<string>("1");
  const [fields, setFields] = useState<string>("All");
  const [fieldSearch, setFieldSearch] = useState<string>("firstName");
  const [searchInput, setSearchInput] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: '',
    endDate: ''
  });
  const defaultDateRange = { startDate: "", endDate: "" };

  const handleResetFilters = useCallback(() => {
    setFieldSort("name");
    setSort("1");
    setFields("All");
    setFieldSearch("");
    setSearchInput("");
    setDateRange(defaultDateRange);



    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterAndSearchHandler = async () => {
    try {
      console.log(searchInput);
      const data = {
        fieldSort,
        sort,
        fields,
        fieldSearch,
        searchInput,
        dateRange
      };
      console.log(data, "users");
      setLoading(true)

      const fetchData = await fetch(`/api/getUsers/${pageNumber}/${pageSize}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data)
      });

      const res = await fetchData.json();
      console.log(res, "res")
      if (res.success === false) {
        toast.error(res?.message || "Failed to fetch users");
        return;
      }

      if (res.data) {
        console.log(res.data, "user response");
        setUsers(res.data);
        setLoading(false)
        toast.success("Users data fetched successfully");
      } else {
        toast.error("No user data available");
      }

      console.log(res);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An unexpected error occurred while fetching users");
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      filterAndSearchHandler();
    }, 2000);

    return () => clearTimeout(getData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput, pageSize, pageNumber]);


  return (
    <div className="flex justify-start gap-2 ">
      <div className="flex justify-start  card-gradient shadow-sm rounded-sm h-10 ">
        <Select onValueChange={setFieldSearch} value={fieldSearch}>
          <SelectTrigger className="w-full h-10 rounded-r-none  card-gradient text-orange-300 px-5 rounded-l-sm outline-none border-none	 ring-0 focus:outline-none focus:border-none focus:ring-0 ">
            <SelectValue placeholder="Name" className="outline-none " />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="firstName">First Name</SelectItem>
              <SelectItem value="lastName">Last Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              
            </SelectGroup>
          </SelectContent>
        </Select>
        <form className="h-10 ">
          <div className="flex">
            <div className="relative ">
              <input
                type="search"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e: any) => {
                  setSearchInput(e.target.value);
                }}
                value={searchInput}
                id="search-dropdown"
                className="block outline-none   card-gradient rounded-sm  p-2.5   text-sm text-white bg-transparent rounded-e-lg  "
                placeholder="Search ..."
                required
              />
            </div>
          </div>
        </form>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className=" h-10 bg-background  hover:text-gray-400"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2 text-red-300 " />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent className="w-3/4  bg-background">
          <DialogHeader className="flex justify-start ">
            <DialogTitle className="flex gap-2 border-b-2 border-gray-500 pb-4">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-orange-600  " />
              Filter
              <Button
                variant="default" //

                onClick={handleResetFilters}
                className=" sm:w-auto w-4 h-4"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Filter
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-between items-center gap-2">
            <Select onValueChange={setFieldSort} value={fieldSort}>
              <SelectTrigger
                id="status"
                aria-label="A-Z order"
                className="bg-foreground/10  border-none h-8  w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="Field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="CompanyName">Company Name</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={setSort} value={sort}>
              <SelectTrigger
                id="status"
                aria-label="A-Z order"
                className=" bg-foreground/10  border-none h-8  w-fit text-[#A19D9D]"
              >
                <SelectValue placeholder="A-Z order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">A-TO-Z</SelectItem>
                <SelectItem value="-1">Z-TO-A</SelectItem>
              </SelectContent>
            </Select>
          </div>



          <div className="flex space-x-4">
            <div className="flex flex-col w-1/2">
              <label
                htmlFor="start-date"
                className="mb-2 text-sm font-medium "
              >
                Date From
              </label>
              <input
                id="start-date"
                type="date"
                className="w-full px-3 py-2 bg-foreground/10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  startDate: e.target.value
                }))}
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label
                htmlFor="end-date"
                className="mb-2 text-sm font-medium "
              >
                Date To
              </label>
              <input
                id="end-date"
                type="date"
                className="w-full px-3 py-2 bg-foreground/10   rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({
                  ...prev,
                  endDate: e.target.value
                }))}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="default"
            className="h-8 w-full cursor-pointer	"
            onClick={filterAndSearchHandler}
          >
            Apply
          </Button>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>

            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserFilter;


