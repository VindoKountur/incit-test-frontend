"use client";
import CalculatePasswordStrength from "@/components/CalculatePasswordStrength";
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
import React, { useMemo, useState } from "react";

type UpdatePasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initForm: UpdatePasswordForm = {
  confirmPassword: "",
  newPassword: "",
  currentPassword: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_HOST_URI as string;
const ChangePasswordCard = () => {
  const cookies = useCookies();
  const router = useRouter();
  const userinfo = cookies.get("userinfo");
  const [form, setForm] = useState<UpdatePasswordForm>(initForm);

  const isStrengthPassword = useMemo(() => {
    const length = form.newPassword.length >= 8;
    const hasUppercase = /[A-Z]/.test(form.newPassword);
    const hasLowercase = /[a-z]/.test(form.newPassword);
    const hasNumber = /[0-9]/.test(form.newPassword);
    const hasSpecialCharacter = /[\W_]/.test(form.newPassword);
    const res = [
      length,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialCharacter,
    ];
    return res.every((v) => v);
  }, [form, form.newPassword]);

  if (!userinfo) {
    router.push("/login");
    return <></>;
  }
  const user = JSON.parse(userinfo) as UserInfoType;

  const handleUpdatePassword = async () => {
    if (form.confirmPassword !== form.newPassword) return;
    if (!isStrengthPassword) return;
    try {
      const payload = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      };
      const res = await axios.put(API_URL + "/auth/change-password", payload, {
        headers: {
          Authorization: "Bearer " + user.accessToken,
        },
      });
      alert("Success Update Password");
      cookies.remove("userinfo");
      router.replace("/login");
    } catch (error: any) {
      alert(error.response.data.message);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password here. After saving, you'll be logged out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Current password</Label>
          <Input
            id="current"
            type="password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">New password</Label>
          <Input
            id="new"
            type="password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          {!isStrengthPassword && form.newPassword.length > 0 && (
            <p className="text-red-400 font-semibold text-sm">
              Password not strength
            </p>
          )}
          {form.newPassword.length > 0 && (
            <CalculatePasswordStrength password={form.newPassword} />
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirm-new">Retype New password</Label>
          <Input
            id="confirm-new"
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          {form.confirmPassword &&
            form.confirmPassword !== form.newPassword && (
              <p className="text-red-400 text-sm font-semibold">
                Password does not match
              </p>
            )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpdatePassword}>Save password</Button>
      </CardFooter>
    </Card>
  );
};

export default ChangePasswordCard;
