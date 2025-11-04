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
import ImageUpload from "@/components/ImageUpload"; // adjust path
import { MultiSelect } from "@/components/MultiSelect"; // adjust path
import { createClient } from "@/utils/supabase/server";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { convertSegmentPathToStaticExportFilename } from "next/dist/shared/lib/segment-cache/segment-value-encoding";

export default function EditTeamMemberPage({ team, sectors, error }) {
  console.log({ team });
  const form = useForm({
    defaultValues: {
      first_name: team?.first_name || "",
      last_name: team?.last_name || "",
      designation: team?.designation || "",
      email: team?.email || "",
      bio: team?.bio || "",
      photo: team?.photo || "",
      sectors: team?.sectors || [],
      people_social_links: team?.people_social_links?.length
        ? team.people_social_links
        : [{ platform: "", url: "" }],
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

  console.log({socialFields, team: team.people_social_links})
  const photoURL = team.photo ? team.photo : form.watch("photo");

  const onSubmit = async (values) => {
    console.log({ values });
    const updateObject = {};

    if (team.first_name !== values.first_name)
      updateObject.first_name = values.first_name;
    if (team.last_name !== values.last_name)
      updateObject.last_name = values.last_name;
    if (team.designation !== values.designation)
      updateObject.designation = values.designation;
    if (team.bio !== values.bio) updateObject.bio = values.bio;
    if (team.photo !== values.photo) updateObject.photo = values.photo;
    console.log({ updateObject });
    if (Object.keys(updateObject).length > 0) {
      const { data, error } = await supabase
        .from("teams")
        .update(updateObject)
        .eq("id", team.id);

      if (error) {
        console.error("Update failed:", error);
      } else {
        console.log("Team member updated successfully", data);
      }
    }

    // Handle sectors (many-to-many)
    const oldSectorIds = team.sectors?.map((s) => s.id) || [];
    const newSectorIds = values.sectors?.map((s) => s.id) || [];

    if (JSON.stringify(oldSectorIds) !== JSON.stringify(newSectorIds)) {
      await supabase.from("team_sectors").delete().eq("team_id", team.id);

      if (newSectorIds.length > 0) {
        const sectorRows = newSectorIds.map((id) => ({
          team_id: team.id,
          sector_id: id,
        }));
        await supabase.from("team_sectors").insert(sectorRows);
      }
    }

    // Handle social links
    const oldSocialIds = team.people_social_links?.map((s) => s.platform) || [];
    const newSocialLinks = values.people_social_links || [];

    if (
      newSocialLinks.length !== oldSocialIds.length ||
      newSocialLinks.some(
        (s, idx) =>
          s.platform !== team.people_social_links?.[idx]?.platform ||
          s.url !== team.people_social_links?.[idx]?.url
      )
    ) {
      await supabase
        .from("people_social_links")
        .delete()
        .eq("member_id", team.id);

      if (newSocialLinks.length > 0) {
        const socialRows = newSocialLinks.map((s) => ({
          member_id: team.id,
          platform: s.platform,
          url: s.url,
        }));
        await supabase.from("people_social_links").insert(socialRows);
      }
    }

    alert("Team member updated successfully!");
  };

  if (!team) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Team Member Not Found
          </h1>
          <p className="text-muted-foreground">
            The requested team member profile could not be found.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Team Member
          </h1>
          <p className="text-muted-foreground">
            Update team member details below.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white dark:bg-neutral-900 border rounded-2xl p-6 shadow-sm"
          >
            {/* Upload photo */}
            <div>
              {photoURL && (
                <Image
                  src={photoURL}
                  width={100}
                  height={100}
                  alt={team.first_name}
                  className="rounded-full"
                />
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-full mt-2" variant="outline">
                    {photoURL ? "Change Photo" : "Upload Photo"}
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
                      onUploadComplete={(url) => {
                        form.setValue("photo", url);
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* First Name */}
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

              {/* Last Name */}
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
                    <Input placeholder="rahul@xyc.com" {...field} />
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
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                {socialFields.map((item, index) => {
                  return (
                    <div key={item.id} className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`people_social_links.${index}.platform`}
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Platform</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Facebook / Instagram"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          );
                        }}
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
                  );
                })}

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

export async function getServerSideProps(context) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("team_detail_withemail")
      .select("*")
      .eq("id", context.query.id)
      .single();

    const { data: sectors, error: sectorsError } = await supabase
      .from("sectors")
      .select("id, name");

    if (error) {
      return {
        props: {
          team: null,
          sectors: [],
          error: { message: error.message, code: error.code },
        },
      };
    }

    return {
      props: {
        team: data,
        sectors: sectors || [],
        error: null,
      },
    };
  } catch (error) {
    return {
      props: {
        team: null,
        sectors: [],
        error: {
          message: error.message || "Unexpected server error",
          code: error.code || "UNKNOWN_ERROR",
        },
      },
    };
  }
}
