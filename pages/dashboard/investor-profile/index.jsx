import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { DashboardStats } from "@/components/dashboard-stats";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetAllInvestors } from "@/service/InvestorProfile";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default function InvestorProfile({
  investors,
  error,
  currentPage,
  totalPages,
}) {
  console.log({ currentPage, totalPages });
  if (!error)
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>

          <DashboardStats />
        </div>
        <div className="flex flex-1 mt-10">
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.map((item, index) => (
                <TableRow key={index} className="">
                  <TableCell className="font-medium">{index}</TableCell>
                  <TableCell>
                    <Link href={`/dashboard/investor-profile/${item.id}`}>
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>"Payment Method"</TableCell>
                  <TableCell className="text-right">
                    <button>Edit</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter> */}
          </Table>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {currentPage > 1 && (
            <Link
              href={`?page=${currentPage - 1}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              ← Previous
            </Link>
          )}

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages && (
            <Link
              href={`?page=${currentPage + 1}`}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Next →
            </Link>
          )}
        </div>
      </DashboardLayout>
    );
}

export async function getServerSideProps(context) {
  const limit = 100;
  const page = parseInt(context.query.page || "1");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const supabase = await createClient();
    const { data, error, count } = await supabase
      .from("AllInvestorsView")
      .select("id, name", { count: "exact" }) // ✅ get total count too
      .range(from, to);

    if (error) throw error;

    return {
      props: {
        investors: data,
        error: error,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: error,
      },
    };
  }
}
