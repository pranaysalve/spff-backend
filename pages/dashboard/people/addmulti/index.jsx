"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabaseClient";
import { DashboardLayout } from "@/components/dashboard-layout";
import { InvestorSelect } from "@/components/investorSelect";
import { InvestorSelectMultiUserAdd } from "@/components/investorSelectForMultiUserAdd";

export default function AddMultipleTeamMembers({ investors }) {
  const form = useForm({
    defaultValues: {
      members: [
        {
          first_name: "",
          last_name: "",
          designation: "",
          email: "",
          investor_id: "",
        },
      ],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const onSubmit = async (values) => {
    console.log("Submitting members:", values.members);

    // Insert all team members in one go
    const { data, error } = await supabase.from("teams").insert(values.members);

    if (error) {
      console.error("Error inserting members:", error);
      alert("Failed to add members.");
    } else {
      alert("✅ Members added successfully!");
      form.reset();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Add Multiple Team Members
          </h1>
          <p className="text-muted-foreground">
            Quickly add multiple team members at once.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="p-2">First Name</th>
                    <th className="p-2">Last Name</th>
                    <th className="p-2">Designation</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Investor</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      {/* First Name */}
                      <td className="p-2">
                        <FormField
                          control={control}
                          name={`members.${index}.first_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="First name"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {/* Last Name */}
                      <td className="p-2">
                        <FormField
                          control={control}
                          name={`members.${index}.last_name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Last name"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {/* Designation */}
                      <td className="p-2">
                        <FormField
                          control={control}
                          name={`members.${index}.designation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Designation"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {/* Email */}
                      <td className="p-2">
                        <FormField
                          control={control}
                          name={`members.${index}.email`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Email"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {/* Investor Dropdown */}
                      <td className="p-2">
                        <FormField
                          control={control}
                          name={`members.${index}.investor_id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <InvestorSelectMultiUserAdd
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </td>

                      {/* Remove Row */}
                      <td className="p-2 text-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    first_name: "",
                    last_name: "",
                    designation: "",
                    email: "",
                    investor_id: "",
                  })
                }
              >
                + Add Row
              </Button>

              <Button type="submit" className="ml-auto">
                Submit All Members
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
}

export async function getServerSideProps() {
  const { data: investors } = await supabase
    .from("investors")
    .select("id, name");
  return { props: { investors: investors || [] } };
}
