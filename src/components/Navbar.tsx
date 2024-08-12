"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { redirect, useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_HOST_URI;

const Navbar = () => {
  const router = useRouter();
  const cookies = useCookies();
  const userinfo = cookies.get("userinfo");
  if (!userinfo) {
    redirect("/login");
  }

  const user = JSON.parse(userinfo);
  const userEmail = user.email;
  const handleLogout = () => {
    axios.post(apiUrl + "/auth/logout", { userEmail });
    cookies.remove("userinfo");
    redirect("/login");
  };
  return (
    <nav className="flex items-center justify-between p-3 border-b-2">
      <p>Incit Test Dashboard</p>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            router.push("/profile");
          }}
        >
          Profile
        </Button>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
