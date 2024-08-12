import Navbar from "@/components/Navbar";
import { getCookies } from "next-client-cookies/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NameCard from "./NameCard";
import ChangePasswordCard from "./ChangePasswordCard";
import { UserInfoType } from "@/types/user";

const ProfilePage = () => {
  const cookies = getCookies();
  const userinfo = cookies.get("userinfo");
  if (!userinfo) {
    redirect("/login");
  }
  const user = JSON.parse(userinfo) as UserInfoType;
  return (
    <div>
      <Navbar />
      <div className="p-4 flex items-center justify-center">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="change-password">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <NameCard email={user.email} name={user.name} />
          </TabsContent>
          <TabsContent value="change-password">
            <ChangePasswordCard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
