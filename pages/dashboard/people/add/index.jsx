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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUpload from "@/components/ImageUpload";
import { MultiSelect } from "@/components/MultiSelect";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

import { InvestorSelect } from "@/components/investorSelect";

export default function AddTeamMemberPage({ sectors, investors }) {
  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      designation: "",
      email: "",
      bio: "",
      photo: "",
      sectors: [],
      investors: [],
      people_social_links: [{ platform: "", url: "" }],
    },
  });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({
    control: form.control,
    name: "people_social_links",
  });
  const investorId = form.watch("investor_id") || null;

  const onSubmit = async (values) => {
    console.log("Submitting new team member:", values);

    if (
      !values.first_name ||
      !values.last_name ||
      !values.email ||
      !values.designation ||
      !investorId
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // 1️⃣ Insert into teams table
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .insert([
        {
          first_name: values.first_name,
          last_name: values.last_name,
          designation: values.designation,
          email: values.email,
          bio: values.bio,
          investor_id: investorId, // ✅ single investor
          photo: values.photo,
        },
      ])
      .select("id")
      .single();

    if (teamError) {
      console.error("Error inserting team member:", teamError);
      alert("Failed to add team member.");
      return;
    }

    const teamId = teamData.id;

    // 2️⃣ Handle sectors (many-to-many)
    if (values.sectors.length > 0) {
      const sectorRows = values.sectors.map((sector) => ({
        team_id: teamId,
        sector_id: sector.id,
      }));

      const { error: sectorError } = await supabase
        .from("team_sectors")
        .insert(sectorRows);

      if (sectorError) {
        console.error("Sector insert error:", sectorError);
      }
    }

    // 3️⃣ Handle social links
    if (values.people_social_links.length > 0) {
      const socialRows = values.people_social_links.map((s) => ({
        member_id: teamId,
        platform: s.platform,
        url: s.url,
      }));

      const { error: socialError } = await supabase
        .from("people_social_links")
        .insert(socialRows);

      if (socialError) {
        console.error("Social links insert error:", socialError);
      }
    }

    alert("✅ New team member added successfully!");
    form.reset();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Team Member</h1>
          <p className="text-muted-foreground">
            Enter details to add a new member to your team.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white dark:bg-neutral-900 border rounded-2xl p-6 shadow-sm"
          >
            {/* Upload photo */}
            <div>
              {form.watch("photo") && (
                <Image
                  src={form.watch("photo")}
                  width={100}
                  height={100}
                  alt="Preview"
                  className="rounded-full"
                />
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-full mt-2" variant="outline">
                    {form.watch("photo") ? "Change Photo" : "Upload Photo"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-center">
                      Upload Profile Photo
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <ImageUpload
                      onUploadComplete={(url) => form.setValue("photo", url)}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Designation */}
            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Investment Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short bio..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Investor */}
            <InvestorSelect />

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

            {/* Social Links */}
            <div className="space-y-4">
              {socialFields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`people_social_links.${index}.platform`}
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
                    name={`people_social_links.${index}.url`}
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

            <Button type="submit" className="w-full">
              Add Team Member
            </Button>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const supabase = await createClient();

  const { data: sectors, error } = await supabase
    .from("sectors")
    .select("id, name");
  const { data: investors, error: investorsError } = await supabase
    .from("investor_detail")
    .select("id, name, domain");
  return {
    props: {
      sectors: sectors || [],
      investors: investors || [],
    },
  };
}
