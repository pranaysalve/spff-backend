"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/ImageUpload"; // adjust path
import { MultiSelect } from "@/components/MultiSelect"; // adjust path
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { isObejectChanges } from "@/lib/utils";

export default function EditInvestorPage({
  investor,
  stages,
  sectors,
  countries,
  error,
}) {
  console.log({ stages,
    sectors,
    countries,})
  const form = useForm({
    defaultValues: {
      name: investor?.name || "",
      logo: investor?.logo || "",
      tagline: investor?.tagline || "",
      domain: investor?.domain || "",
      description: investor?.description || "",
      aum: investor?.aum || "",
      sectors: investor?.sectors || [],
      stages: investor?.stages || [],
      country: investor?.countries || [],
      social_links: investor?.social_links?.length
        ? investor.social_links
        : [{ platform: "", url: "" }],
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: "social_links",
  });

  const logoURL = investor.logo ? investor.logo : form.watch("logo");
  console.log({});
  const onSubmit = async (values) => {
    // Compare and collect changed fields
    console.log({ values });
    const updateObject = {};
    if (values.country?.length !== investor.countries.length) {
      await supabase
        .from("investor_countries")
        .delete()
        .eq("investor_id", investor.id);

      if (values.country?.length) {
        const countriesRows = values.country.map((s) => ({
          investor_id: investor.id,
          country_id: s.id,
        }));
        await supabase.from("investor_countries").insert(countriesRows);
      }
    }
    if (values.social_links?.length !== investor.social_links?.length) {
      await supabase
        .from("social_links")
        .delete()
        .eq("investor_id", investor.id);

      if (values.social_links?.length) {
        const social_linkRows = values.social_links.map((s) => ({
          investor_id: investor.id,
          platform: s.platform,
          url: s.url,
        }));
        await supabase.from("social_links").insert(social_linkRows);
      }
    }
    if (values.sectors.length !== investor.sectors.length) {
      await supabase
        .from("investor_sectors")
        .delete()
        .eq("investor_id", investor.id);

      if (values.sectors?.length) {
        const sectorRows = values.sectors.map((s) => ({
          investor_id: investor.id,
          sector_id: s.id,
        }));
        await supabase.from("investor_sectors").insert(sectorRows);
      }
    }
    if (values.stages.length !== investor.stages.length) {
      await supabase
        .from("investor_stages")
        .delete()
        .eq("investor_id", investor.id);

      if (values.stages?.length) {
        const stagesRow = values.stages.map((s) => ({
          investor_id: investor.id,
          stage_id: s.id,
        }));
        await supabase.from("investor_stages").insert(stagesRow);
      }
    }

    if (investor.name !== values.name) updateObject.name = values.name;
    if (investor.logo !== values.logo) updateObject.logo = values.logo;
    if (investor.tagline !== values.tagline)
      updateObject.tagline = values.tagline;
    if (investor.domain !== values.domain) updateObject.domain = values.domain;
    if (investor.description !== values.description)
      updateObject.description = values.description;
    if (investor.aum !== values.aum) updateObject.aum = values.aum;

    if (Object.keys(updateObject).length > 0) {
      // If anything changed, update once
      const { data, error } = await supabase
        .from("investors")
        .update(updateObject)
        .eq("id", investor.id);

      if (error) console.error("Update failed:", error);
      else console.log("Investor updated successfully");
      console.log({ data });
    } else {
      console.log("No changes detected");
    }
  };

  if (!investor) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Investor Not Found
          </h1>
          <p className="text-muted-foreground">
            The requested investor profile could not be found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Investor Details
          </h1>
          <p className="text-muted-foreground">
            Update investor information and save your changes.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white dark:bg-neutral-900 border rounded-2xl p-6 shadow-sm"
          >
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2  items-center">
              {/* Upload logo dialog */}
              <div>
                {logoURL && (
                  <Image
                    src={logoURL}
                    width={100}
                    height={100}
                    alt={investor.name}
                  />
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-full shadow" variant="outline">
                      {logoURL ? "Change Logo" : "Upload Logo"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        Upload your logo
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Upload an image file to use as your company logo.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <ImageUpload
                        onUploadComplete={(url) => {
                          form.setValue("logo", url);
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Investor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Tagline */}
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Short tagline" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Domain */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. greylock.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the investor..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* AUM */}
            <FormField
              control={form.control}
              name="aum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AUM</FormLabel>
                  <FormControl>
                    <Input placeholder="Assets under management" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Sectors */}
            {sectors && (
              <FormField
                control={form.control}
                name="sectors"
                render={({ field }) => (
                  <MultiSelect
                    field={field}
                    label="Sectors"
                    options={sectors}
                    placeholder="Select sectors"
                  />
                )}
              />
            )}
            {/* Stages */}
            {stages && (
              <FormField
                control={form.control}
                name="stages"
                render={({ field }) => (
                  <MultiSelect
                    field={field}
                    label="Stages"
                    options={stages}
                    placeholder="Select stages"
                  />
                )}
              />
            )}
            {/* Country Info */}

            {countries && (
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <MultiSelect
                    field={field}
                    label="Country"
                    options={countries}
                    placeholder="Select countries of presence"
                  />
                )}
              />
            )}

            {/* Social Links */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                {socialFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`social_links.${index}.platform`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Facebook / Instagram"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`social_links.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://facebook.com"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSocial(index)}
                      className="col-span-2"
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendSocial({ platform: "", url: "" })}
                >
                  + Add Social Link
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

// ✅ SSR to fetch data

export async function getServerSideProps(context) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("investor_detail")
      .select(`*`)
      .eq("id", context.query.id)
      .single();

    const { data: sectors, error: sectorError } = await supabase
      .from("sectors")
      .select("id, name");

    const { data: stages, error: stagesError } = await supabase
      .from("investment_stages")
      .select("id, name");

    const { data: countries, error: countriesError } = await supabase
      .from("countries")
      .select("id, name, flag");

    if (error) {
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
        stages,
        sectors,
        countries,
        error: null,
      },
    };
  } catch (error) {
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
