"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_HOST_URI as string;
const ResendEmail = () => {
  const cookies = useCookies();
  const userinfo = cookies.get("userinfo");
  if (!userinfo) {
    redirect("/login");
  }
  const accessToken = JSON.parse(userinfo).accessToken;
  const handleResendEmail = async () => {
    const res = await axios.post(
      API_URL + "/auth/resend-verification-email",
      undefined,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    console.log(res.data);
  };
  return <Button onClick={handleResendEmail}>Resend Verification Email</Button>;
};

export default ResendEmail;
