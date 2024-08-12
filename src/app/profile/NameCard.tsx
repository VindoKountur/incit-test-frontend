"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserInfoType } from "@/types/user";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_HOST_URI as string;
const NameCard = ({ email, name }: { email: string; name: string }) => {
  const cookies = useCookies();
  const router = useRouter();
  const userinfo = cookies.get("userinfo");
  const [newName, setNewName] = useState<string>(name);

  if (!userinfo) {
    router.push("/login");
    return <></>;
  }
  const user = JSON.parse(userinfo) as UserInfoType;

  const handleUpdateUsername = async () => {
    try {
      const res = await axios.put(
        API_URL + "/user/name",
        { name: newName },
        {
          headers: {
            Authorization: "Bearer " + user.accessToken,
          },
        }
      );
      user.name = newName;
      cookies.set("userinfo", JSON.stringify(user));
      alert("Success Update name");
      router.refresh();
    } catch (error: any) {
      alert(error.response.message);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Email : {email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={newName}
            onChange={(e) => {
              setNewName(e.target.value);
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdateUsername}>Update Name</Button>
      </CardFooter>
    </Card>
  );
};

export default NameCard;
