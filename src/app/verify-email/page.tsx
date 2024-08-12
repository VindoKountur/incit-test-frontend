"use client";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_HOST_URI as string;

const VerifyEmailPage = () => {
  const searchParam = useSearchParams();
  const token = searchParam.get("token");
  const cookies = useCookies();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifyUserEmail = async () => {
      try {
        const res = await axios.post(API_URL + "/user/verify-email", { token });
        const data = res.data.data;
        cookies.set("userinfo", JSON.stringify(data));

        alert("Success verify email, redirect to dashboard");
        router.push("/");
      } catch (error) {
        alert("Failed to verify email");
      }
    };
    verifyUserEmail();
  }, []);
  return <div>Verify email</div>;
};

export default VerifyEmailPage;
