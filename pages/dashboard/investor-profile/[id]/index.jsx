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

export default function SingleInvestorProfile({ investor, error }) {
  console.log({ investor, error });
  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Error</h1>
            <p className="text-muted-foreground">
              Failed to load investor profile: {error.message}
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

  if (!investor) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Investor Not Found
            </h1>
            <p className="text-muted-foreground">
              The requested investor profile could not be found.
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
              <Image
                src={investor.logo}
                height={100}
                width={100}
                alt={investor.name}
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {investor.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {investor.tagline}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {investor.domain && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Website
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
            </div>
          </div>

          {/* Description */}
          {investor.description && (
            <p className="text-muted-foreground leading-relaxed">
              {investor.description}
            </p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">AUM</p>
                  <p className="text-2xl font-bold">{investor.aum || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">Country</p>
                <div className="flex flex-wrap gap-2">
                  {investor.countries.map((country, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {country.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Founded</p>
                  <p className="text-2xl font-bold">
                    {investor.created_at
                      ? new Date(investor.created_at).getFullYear()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Sectors</p>
                  <p className="text-2xl font-bold">
                    {investor.sectors?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Investment Sectors */}
        {investor.sectors && investor.sectors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Investment Sectors</CardTitle>
              <CardDescription>
                Sectors this investor focuses on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {investor.sectors.map((sector, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {sector.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investment Stages */}
        {investor.stages && investor.stages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Investment Stages</CardTitle>
              <CardDescription>
                Funding stages this investor participates in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {investor.stages.map((stage, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {stage.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Information */}
        {investor.teams && investor.teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Key team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investor.teams.map((team, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 border rounded-lg"
                  >
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {team.position}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        {investor.social_links && (
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
        )}

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        </div>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("investor_detail")
      .select(`*`)
      .eq("id", context.query.id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        props: {
          investor: null,
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
        investor: data,
        error: null,
      },
    };
  } catch (error) {
    console.error("Server error:", error);
    return {
      props: {
        investor: null,
        error: {
          message: error.message || "An unexpected error occurred",
          code: error.code || "UNKNOWN_ERROR",
        },
      },
    };
  }
}
