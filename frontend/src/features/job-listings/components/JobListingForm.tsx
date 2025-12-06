"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateJobListingFormData,
  createJobListingSchema,
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/schemas/job-listings/createJobListingSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
  formatWageInterval,
} from "../lib/formatters";
import { StateSelectItems } from "@/components/customs/StateSelectItem";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";

const NONE_SELECT_VALUE = "__none__";
export function JobListingForm() {
  const validationT = useTranslations("validations.jobListings");

  const form = useForm<CreateJobListingFormData>({
    resolver: zodResolver(createJobListingSchema(validationT)),
    defaultValues: {
      title: "",
      description: "",
      stateAbbreviation: "",
      city: "",
      experienceLevel: "junior",
      wage: undefined,
      wageInterval: "yearly",
      type: "full-time",
      locationRequirement: "in-office",
    },
  });

  function onSubmit(data: CreateJobListingFormData) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="h-full flex flex-col @container"
      >
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    Job Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="wage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    Wage
                  </FormLabel>
                  <div className="flex gap-0">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value ?? ""}
                        className="rounded-r-none flex-1"
                        onChange={(e) =>
                          field.onChange(
                            isNaN(e.target.valueAsNumber)
                              ? null
                              : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormField
                      name="wageInterval"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-[200px]">
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(val) => field.onChange(val ?? null)}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-l-none">
                                / <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {wageIntervals.map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                  {formatWageInterval(interval)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 @md:grid-cols-3 gap-x-4 gap-y-6 items-start">
            <FormField
              name="city"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="stateAbbreviation"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    State
                  </FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) =>
                      field.onChange(val === NONE_SELECT_VALUE ? null : val)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.value != null && (
                        <SelectItem
                          value={NONE_SELECT_VALUE}
                          className="text-muted-foreground"
                        >
                          Clear
                        </SelectItem>
                      )}
                      <StateSelectItems />
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="locationRequirement"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    Location Requirement
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationRequirements.map((lr) => (
                        <SelectItem key={lr} value={lr}>
                          {formatLocationRequirement(lr)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
            <FormField
              name="type"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    Job Type
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jobListingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {formatJobType(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="experienceLevel"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    Experience Level
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {experienceLevels.map((experience) => (
                        <SelectItem key={experience} value={experience}>
                          {formatExperienceLevel(experience)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                  Description
                </FormLabel>
                <FormControl>
                  <MarkdownEditor
                    {...field}
                    markdown={field.value}
                    className="min-h-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="pt-4 border-t mt-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            {form.formState.isSubmitting ? "..." : "Create Job Listing"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
