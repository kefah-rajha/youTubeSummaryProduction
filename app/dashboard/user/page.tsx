"use client"

import TableUser from "@/components/user/tableUser"
import UserFilter from "@/components/user/userFilter"
import { PaginationControls } from "@/components/Pagination/PaginationControls";
import { useEffect, useState } from "react"
import '@/style/home-page.css';
import { HomePageBackground } from '@/components/gradients/home-page-background';

import {
  Card,
  CardContent,

} from "@/components/ui/card";
import CollapsibleCard from "@/components/Pagination/CollapsibleCard";
import { cn } from "@/lib/utils"

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


function Page() {
  const [numberProducts, setNumberProducts] = useState<number>(0);
  const [countPages, setCountPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isExpanded, setIsExpanded] = useState(false);
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getNumberProducts = async () => {

      const getNumberProductsServer = await fetch("/api/users/getNumberUsers", {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": "*",
        },


      })
      const resNumberProduct = await getNumberProductsServer.json()
      console.log(resNumberProduct, "resproduct");
      if (resNumberProduct?.data) {
        setNumberProducts(resNumberProduct.data);
        console.log(resNumberProduct, "resNumberProduct.count")
        const totalPages = Math.ceil(resNumberProduct.data / pageSize);
        console.log(totalPages, pageSize, "totalPages1111");
        setCountPages(totalPages);

      }
    };
    getNumberProducts();
  }, [pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };
  return (
    <>
<HomePageBackground />
    <div className='  heighWithOutBar overflow-auto pt-4 pb-10 bg-gradient w-[95%] mx-auto'>
      
     

      <div className='h-14 flex items-center overflow-auto   justify-end gap-2'>
        <UserFilter pageNumber={currentPage} pageSize={pageSize} setUsers={setUsers} setLoading={setLoading} />
        
      </div>
      <div >
        <TableUser users={users} loading={loading} />
      </div>
      <Card className={cn(!isExpanded ? "sticky bottom-0 w-fit shadow-lg" : "sticky bottom-0 w-full shadow-sm")} >
        <CardContent className="">
          <CollapsibleCard
            numberProducts={numberProducts}
            currentPage={currentPage}
            countPages={countPages}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}

          >
            <PaginationControls
              numberProducts={numberProducts}
              countPages={countPages}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            // disabled={loading}
            />
          </CollapsibleCard>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default Page


