import Navbar from "@/components/Navbar";
import ResendEmail from "@/components/ResendEmail";
import SignupUsers from "@/components/users/SignupUsers";
import { UserInfoType } from "@/types/user";
import { getCookies } from "next-client-cookies/server";
import { redirect } from "next/navigation";

type TotalUserApiResponse = {
  success : boolean,
  data : number
}
const API_URL = process.env.NEXT_PUBLIC_API_HOST_URI;
const getTotalUsers = async (accessToken: string) => {
  const getData = await fetch(API_URL + "/user/total", {
    method: "GET",
    cache: "reload",
  });
  return await getData.json() as TotalUserApiResponse;
};

export default async function Home() {
  const cookies = getCookies();
  const userinfo = cookies.get("userinfo");
  if (!userinfo) {
    redirect("/login");
  }
  const parseUserinfo = JSON.parse(userinfo) as UserInfoType;
  const isVerifiedUser = parseUserinfo.isVerified;

  const totalUser = await getTotalUsers(parseUserinfo.accessToken);
  return (
    <main>
      <Navbar />
      {isVerifiedUser ? (
        <div>
          <p>Total User : {totalUser.data}</p>
          <SignupUsers />
        </div>
      ) : (
        <div>
          Need to verified email first
          <ResendEmail />
        </div>
      )}
    </main>
  );
}
