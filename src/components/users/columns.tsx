"use client";

import { ColumnDef } from "@tanstack/react-table";

export type UserType = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<UserType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdAt",
    header: "Register Date",
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
  },
  {
    accessorKey: "isVerified",
    header: "Verified Status",
  },
];
