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
import ImageUpload from "@/components/ImageUpload";
import { MultiSelect } from "@/components/MultiSelect";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddInvestorPage({ stages, sectors, countries }) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      logo: "",
      tagline: "",
      domain: "",
      description: "",
      aum: "",
      sectors: [],
      stages: [],
      country: [],
      social_links: [{ platform: "", url: "" }],
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

  const logoURL = form.watch("logo");

  const onSubmit = async (values) => {
    console.log("Submitting:", values);

    // 1️⃣ Insert investor
    const { data: newInvestor, error: insertError } = await supabase
      .from("investors")
      .insert([
        {
          name: values.name,
          logo: values.logo,
          tagline: values.tagline,
          domain: values.domain,
          description: values.description,
          aum: values.aum,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting investor:", insertError);
      alert("Failed to add investor");
      return;
    }

    const investorId = newInvestor.id;

    // 2️⃣ Insert related records (many-to-many)
    try {
      // sectors
      if (values.sectors?.length) {
        const sectorRows = values.sectors.map((s) => ({
          investor_id: investorId,
          sector_id: s.id,
        }));
        await supabase.from("investor_sectors").insert(sectorRows);
      }

      // stages
      if (values.stages?.length) {
        const stageRows = values.stages.map((s) => ({
          investor_id: investorId,
          stage_id: s.id,
        }));
        await supabase.from("investor_stages").insert(stageRows);
      }

      // countries
      if (values.country?.length) {
        const countryRows = values.country.map((c) => ({
          investor_id: investorId,
          country_id: c.id,
        }));
        await supabase.from("investor_countries").insert(countryRows);
      }

      // social links
      if (values.social_links?.length) {
        const socialRows = values.social_links.map((s) => ({
          investor_id: investorId,
          platform: s.platform,
          url: s.url,
        }));
        await supabase.from("social_links").insert(socialRows);
      }

      alert("Investor added successfully!");
      router.push("/dashboard/investors");
    } catch (e) {
      console.error("Error inserting related data:", e);
      alert("Investor created but related data failed. Please recheck.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Investor
          </h1>
          <p className="text-muted-foreground">
            Fill out the form to create a new investor record.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-white dark:bg-neutral-900 border rounded-2xl p-6 shadow-sm"
          >
            {/* Logo upload */}
            <div className="flex items-center gap-4">
              {logoURL && (
                <Image
                  src={logoURL}
                  width={100}
                  height={100}
                  alt="Investor logo"
                  className="rounded"
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
                      onUploadComplete={(url) => form.setValue("logo", url)}
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

            {/* Countries */}
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
            <div className="space-y-4">
              {socialFields.map((item, index) => (
                <div key={item.id} className="grid grid-cols-2 gap-4">
                  {/* 🌐 Platform Select */}
                  <FormField
                    control={form.control}
                    name={`social_links.${index}.platform`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="website">Website</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* 🔗 URL Input */}
                  <FormField
                    control={form.control}
                    name={`social_links.${index}.url`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* ❌ Remove Button */}
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

              {/* ➕ Add Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => appendSocial({ platform: "", url: "" })}
              >
                + Add Social Link
              </Button>
            </div>

            <Button type="submit" className="w-full">
              Create Investor
            </Button>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const supabase = await import("@/utils/supabase/server").then((m) =>
    m.createClient()
  );

  const { data: sectors } = await supabase.from("sectors").select("id, name");
  const { data: stages } = await supabase
    .from("investment_stages")
    .select("id, name");
  const { data: countries } = await supabase
    .from("countries")
    .select("id, name, flag");

  return {
    props: {
      stages: stages || [],
      sectors: sectors || [],
      countries: countries || [],
    },
  };
}
