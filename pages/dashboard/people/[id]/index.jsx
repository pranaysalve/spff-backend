import { createClient } from "@/utils/supabase/server";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Globe,
  Building,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SingleMember({ member, error }) {
  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
            <p className="text-muted-foreground">
              Failed to load team member profile: {error.message}
            </p>
            {error.code && (
              <p className="text-sm text-muted-foreground mt-2">
                Error Code: {error.code}
              </p>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!member) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Member not found
            </h1>
            <p className="text-muted-foreground">
              The requested member profile could not be found.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              {/* <Image
                src={investor.logo}
                height={100}
                width={100}
                alt={investor.name}
              /> */}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {member.first_name} {member.last_name}
              </h1>
              <p className="text-small">{member.email}</p>
            </div>
            {/* <div className="flex flex-col sm:flex-row gap-2">
              {member.email && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  {member}
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Link href={`/dashboard/investor-profile/edit/${investor.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
            </div> */}
          </div>
        </div>

        {/* Key Metrics */}

        {/* Investment Sectors */}
        {member.sectors && member.sectors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Investment Sectors</CardTitle>
              <CardDescription>Sectors this member focuses on</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {member.sectors?.map((sector, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {sector.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        {/* {investor.social_links && (
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Connect with this investor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {investor.social_links?.map((item) => (
                  <Button
                    key={item.platform}
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.platform}
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )} */}

        {/* Additional Information */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-blue-500">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Website
                </label>
                <p className="text-sm">{investor.domain || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Country
                </label>
                <p className="text-sm">
                  {investor.country?.name || "Not specified"}
                </p>
              </div>
              <div className="">
                <label className="text-sm font-medium text-muted-foreground">
                  Created at
                </label>
                <p className="text-sm">
                  {investor.created_at
                    ? new Date(investor.created_at).toISOString().split("T")[0]
                    : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Focus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Sectors Count
                </label>
                <p className="text-sm">
                  {investor.sectors?.length || 0} sectors
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Stages Count
                </label>
                <p className="text-sm">{investor.stages?.length || 0} stages</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Assets Under Management
                </label>
                <p className="text-sm">{investor.aum || "Not disclosed"}</p>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("team_detail_withemail")
      .select(`*`)
      .eq("id", context.query.id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        props: {
          member: null,
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
        member: data,
        error: null,
      },
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      props: {
        member: null,
        error: {
          message: error.message || "An unexpected error occurred",
          code: error.code || "UNKNOWN_ERROR",
        },
      },
    };
  }
}
