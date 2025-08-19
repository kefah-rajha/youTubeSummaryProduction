"use client"
import React from 'react'
import { SidebarTrigger } from "@/components/ui/sidebar"
import {ModeToggle} from "@/components/header/ModeToggle"

function Navbar() {

  return (
    <div className="flex justify-between items-center p-4  w-full h-16 bg-transparent backdrop-filter backdrop-blur-md shadow-lg">
      <SidebarTrigger />
      <div className="flex justify-between gap-4">
      
      <ModeToggle/>
      </div>



    </div>
  )
}

export default Navbar


