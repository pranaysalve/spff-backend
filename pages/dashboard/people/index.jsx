"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "../../../components/dashboard-layout";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { supabase } from "@/lib/supabaseClient";

export default function Peoples({
  people,
  error,
  count,
  currentPage,
  totalPages,
}) {
  const [emails, setEmails] = useState({});

  const getEmail = async (e, id) => {
    e.preventDefault();
    if (emails[id]) {
      setEmails((prev) => ({ ...prev, [id]: null }));
      return;
    }

    try {
      const res = await fetch(`/api/getemail?id=${id}`);
      const data = await res.json();
      if (res.ok) {
        setEmails((prev) => ({ ...prev, [id]: data.email }));
      } else {
        console.error("Error fetching email:", data.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const deleteUser = async (e, id) => {
    e.preventDefault();
    const { error } = await supabase.from("teams").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
    } else {
      window.location.reload();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Peoples </h1>
            <p className="text-muted-foreground">
              Manage your peoples associated with the investor firms and their
              details.
            </p>
          </div>
          <Link href="/dashboard/people/add">
            <Button>Add Member</Button>
          </Link>
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>People Directory</CardTitle>
            <CardDescription>
              View, edit, and manage your people details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  A list of all people associated with investors. Total {count}{" "}
                  people.{" "}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Designation</TableHead>

                    <TableHead>Sectors</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {people?.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-semibold">
                        <div className="row">
                          <div>
                            <Link href={`/dashboard/people/${person.id}`}>
                              {person.first_name} {person.last_name}
                            </Link>
                          </div>
                          <div>
                            {!emails[person.id] ? (
                              <Button
                                size="xsm"
                                variant="link"
                                onClick={(e) => getEmail(e, person.id)}
                                className="p-0 text-primary text-xs"
                              >
                                Show Email
                              </Button>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                {emails[person.id]}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        {person.investor ? (
                          <Link
                            href={`/dashboard/investor-profile/${person.investor.id}`}
                          >
                            {person.investor.name}
                          </Link>
                        ) : (
                          <p>{"-"}</p>
                        )}
                      </TableCell>
                      <TableCell>{person.designation || "-"}</TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {person.sectors && person.sectors.length > 0 ? (
                            <>
                              {person.sectors.slice(0, 2).map((item, index) => (
                                <Badge key={index} variant="outline">
                                  {item.name}
                                </Badge>
                              ))}
                              {person.sectors.length > 2 && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs font-medium"
                                >
                                  +{person.sectors.length - 2}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Link href={`/dashboard/people/edit/${person.id}`}>
                          Edit
                        </Link>
                        <Button
                          size="xsm"
                          variant="ghost"
                          onClick={(e) => deleteUser(e, person.id)}
                        >
                          Delete
                        </Button>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  const limit = 100;
  const page = parseInt(context.query.page || "1");
  const search = context.query.search?.trim() || "";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();

  let query = supabase
    .from("team_detail")
    .select("*", { count: "exact" })
    .range(from, to);

  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,investor->>name.ilike.%${search}%,sectors->>name.ilike.%${search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) {
    return {
      props: {
        people: [],
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
    };
  }

  return {
    props: {
      people: data || [],
      error: null,
      count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      search,
    },
  };
}
