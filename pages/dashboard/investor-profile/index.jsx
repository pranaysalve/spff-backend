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
import InvestorSearchBar from "@/components/investorSearchBar";

export default function InvestorProfile({
  investors,
  error,
  currentPage,
  totalPages,
}) {
  console.log({ investors });
  if (error) {
    console.log(error.message, error.code);
  }
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

          {/* <DashboardStats /> */}
        </div>
        <div className="max-w-3xl mx-auto mt-10">
          <InvestorSearchBar />
        </div>
        <div className="flex flex-1 mt-10">
          <Table>
            {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.map((item, index) => (
                <TableRow key={index} className="">
                  <TableCell>
                    <Link href={`/dashboard/investor-profile/${item.id}`}>
                      {item.name}
                    </Link>
                  </TableCell>
                  <TableCell>{item.domain ? item.domain : "-"}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/investor-profile/edit/${item.id}`}>
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center items-center gap-4 mt-4">
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
      .select("*", { count: "exact" })
      .filter("social_links_count", "gt", 0)
      // .filter("investment_stage_count", "eq", 0)
      // .filter("sector_count", "eq", 0)
      // .filter("name", "eq", "")
      .range(from, to);

    if (error) throw error;

    return {
      props: {
        investors: data,
        error: error,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        count: count,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        error: {
          message: error.message || "Unknown error",
          code: error.code || null,
        },
      },
    };
  }
}
