import { columns } from "./columns";
import { DataTable } from "./data-table";

const API_URL = process.env.NEXT_PUBLIC_API_HOST_URI as string;

const getAllUsers = async () => {
  const res = await fetch(API_URL + "/user", {
    cache: "reload",
    method: "GET",
  });
  return await res.json();
};

const SignupUsers = async () => {
  const users = await getAllUsers();

  return (
    <div className="p-4 ">
      <DataTable columns={columns} data={users.data} />
    </div>
  );
};

export default SignupUsers;
