"use client";
import CalculatePasswordStrength from "@/components/CalculatePasswordStrength";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const apiHostUrl = process.env.NEXT_PUBLIC_API_HOST_URI as string;

type FormType = {
  email: string;
  password: string;
  confirmPassword: string;
};

const initForm: FormType = {
  confirmPassword: "",
  email: "",
  password: "",
};

const LoginPage = () => {
  const cookies = useCookies();
  const router = useRouter();
  const [formType, setFormType] = useState<"Register" | "Login">("Login");
  const [form, setForm] = useState<FormType>(initForm);

  const isStrengthPassword = useMemo(() => {
    const length = form.password.length >= 8;
    const hasUppercase = /[A-Z]/.test(form.password);
    const hasLowercase = /[a-z]/.test(form.password);
    const hasNumber = /[0-9]/.test(form.password);
    const hasSpecialCharacter = /[\W_]/.test(form.password);
    const res = [
      length,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialCharacter,
    ];
    return res.every((v) => v);
  }, [form, form.password]);

  if (cookies.get("userinfo")) {
    router.push("/");
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const res = await axios.post(apiHostUrl + "/auth/google", {
        code,
      });
      cookies.set("userinfo", JSON.stringify(res.data.data));
    },
    flow: "auth-code",
  });

  const handleChangeForm = () => {
    setFormType(formType === "Login" ? "Register" : "Login");
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const onSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isStrengthPassword && formType === "Register") return;
    if (formType === "Register" && form.password !== form.confirmPassword)
      return;

    const payload = {
      email: form.email,
      password: form.password,
    };

    let url = apiHostUrl;
    if (formType === "Register") {
      url += "/auth/register";
    } else {
      url += "/auth/login";
    }
    try {
      const res = await axios.post(url, payload);
      const data = res.data.data;
      cookies.set("userinfo", JSON.stringify(data));
      router.push("/");
    } catch (error : any) {
      alert(error.response.data.message)
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>All Test Project</CardTitle>
          <CardDescription>Login to view dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <>
            <div className="flex flex-row justify-between gap-2 pb-3">
              <Button onClick={handleGoogleLogin} className="w-full">
                Google
              </Button>
              <Button className="w-full">Facebook</Button>
            </div>
            <form onSubmit={onSubmitForm}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username">Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });
                    }}
                    id="username"
                    placeholder="me@mail.com"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    value={form.password}
                    onChange={(e) => {
                      setForm({ ...form, password: e.target.value });
                    }}
                    id="password"
                    type="password"
                    placeholder=""
                  />
                  {!isStrengthPassword && formType === "Register" && (
                    <p className="text-red-400 font-semibold text-sm">
                      Password not strength
                    </p>
                  )}
                  {form.password && formType === "Register" && (
                    <CalculatePasswordStrength password={form.password} />
                  )}
                </div>
                {formType === "Register" && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirm-password">Retype Password</Label>
                    <Input
                      value={form.confirmPassword}
                      onChange={(e) => {
                        setForm({ ...form, confirmPassword: e.target.value });
                      }}
                      id="confirm-password"
                      type="password"
                      placeholder=""
                    />
                    {form.confirmPassword &&
                      form.confirmPassword !== form.password && (
                        <p className="text-red-400 text-sm font-semibold">
                          Password does not match
                        </p>
                      )}
                  </div>
                )}
              </div>
              <div className="pt-4">
                <Button className="w-full">{formType}</Button>
              </div>
            </form>
          </>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p onClick={handleChangeForm} className="cursor-pointer underline">
            {formType === "Login" ? "Register" : "Login"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
