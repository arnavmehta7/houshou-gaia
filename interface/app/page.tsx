"use client"

import SideBar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import NavBar from "../components/NavBar";

export default function Home() {
  return (
    <div className="">
      <NavBar/>
        <SideBar/>
        <Dashboard/>
    </div>
    
  );
}
