import { UseFormReturn, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatExperienceLevel,
  formatJobType,
  formatLocationRequirement,
  formatWageInterval,
} from "../lib/formatters";
import { StateSelectItems } from "@/components/customs/StateSelectItem";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";
import {
  CreateJobListingFormData,
  createJobListingSchema,
} from "@/schemas/job-listings/createJobListingSchema";
import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/types/job-listing.type";
import { useIsMobile } from "@/hooks/use-mobile";

const NONE_SELECT_VALUE = "__none__";

interface JobListingFormProps {
  // Core functionality
  onSubmit: (data: CreateJobListingFormData) => void | Promise<void>;
  defaultValues?: Partial<CreateJobListingFormData>;

  // Customization
  mode?: "create" | "edit";
  translations?: {
    validations?: any;
    labels?: Partial<Record<keyof CreateJobListingFormData, string>>;
    descriptions?: Partial<Record<keyof CreateJobListingFormData, string>>;
    buttons?: {
      submit?: string;
      submitting?: string;
    };
    options?: {
      wageIntervals?: Record<string, string>;
      locationRequirements?: Record<string, string>;
      jobTypes?: Record<string, string>;
      experienceLevels?: Record<string, string>;
      clearState?: string;
    };
  };

  // Layout & styling
  className?: string;
  buttonClassName?: string;
  showBorder?: boolean;

  // Field visibility/customization
  fields?: {
    show?: Partial<Record<keyof CreateJobListingFormData, boolean>>;
    disabled?: Partial<Record<keyof CreateJobListingFormData, boolean>>;
  };

  // Advanced
  validationSchema?: any;
  children?: (form: UseFormReturn<CreateJobListingFormData>) => React.ReactNode;

  // Additional props
  isLoading?: boolean;
  hideSubmitButton?: boolean;
}

export function JobListingForm({
  onSubmit,
  defaultValues,
  mode = "create",
  translations,
  className,
  buttonClassName,
  showBorder = true,
  fields,
  validationSchema,
  children,
  isLoading = false,
  hideSubmitButton = false,
}: JobListingFormProps) {
  const defaultValidationT = useTranslations("validations.jobListings");
  const validationT = translations?.validations ?? defaultValidationT;
  const isMobile = useIsMobile();

  const form = useForm<CreateJobListingFormData>({
    resolver: zodResolver(
      validationSchema ?? createJobListingSchema(validationT)
    ),
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
      ...defaultValues,
    },
  });

  const getLabel = (
    field: keyof CreateJobListingFormData,
    defaultLabel: string
  ) => translations?.labels?.[field] ?? defaultLabel;

  const getDescription = (field: keyof CreateJobListingFormData) =>
    translations?.descriptions?.[field];

  const shouldShowField = (field: keyof CreateJobListingFormData) =>
    fields?.show?.[field] ?? true;

  const isFieldDisabled = (field: keyof CreateJobListingFormData) =>
    fields?.disabled?.[field] ?? false;

  // Option translation helpers
  const getWageIntervalLabel = (interval: (typeof wageIntervals)[number]) =>
    translations?.options?.wageIntervals?.[interval] ??
    formatWageInterval(interval);

  const getLocationRequirementLabel = (
    requirement: (typeof locationRequirements)[number]
  ) =>
    translations?.options?.locationRequirements?.[requirement] ??
    formatLocationRequirement(requirement);

  const getJobTypeLabel = (type: (typeof jobListingTypes)[number]) =>
    translations?.options?.jobTypes?.[type] ?? formatJobType(type);

  const getExperienceLevelLabel = (level: (typeof experienceLevels)[number]) =>
    translations?.options?.experienceLevels?.[level] ??
    formatExperienceLevel(level);

  const getClearStateLabel = () => translations?.options?.clearState ?? "Clear";

  async function handleSubmit(data: CreateJobListingFormData) {
    await onSubmit(data);
  }

  const submitButtonText =
    mode === "edit"
      ? translations?.buttons?.submit ?? "Update Job Listing"
      : translations?.buttons?.submit ?? "Create Job Listing";

  const submittingText = translations?.buttons?.submitting ?? "...";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("h-full flex flex-col @container", className)}
      >
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div
            className={`grid grid-cols-1 ${
              !isMobile ? "@md:grid-cols-2" : ""
            } gap-x-4 gap-y-6 items-start`}
          >
            {shouldShowField("title") && (
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("title", "Job Title")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isFieldDisabled("title")} />
                    </FormControl>
                    {getDescription("title") && (
                      <FormDescription>
                        {getDescription("title")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {shouldShowField("wage") && (
              <FormField
                name="wage"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("wage", "Wage")}
                    </FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          value={field.value ?? ""}
                          className="flex-1"
                          disabled={isFieldDisabled("wage")}
                          onChange={(e) =>
                            field.onChange(
                              isNaN(e.target.valueAsNumber)
                                ? null
                                : e.target.valueAsNumber
                            )
                          }
                        />
                      </FormControl>
                      {shouldShowField("wageInterval") && (
                        <FormField
                          name="wageInterval"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="w-[150px]">
                              <Select
                                value={field.value ?? ""}
                                onValueChange={(val) =>
                                  field.onChange(val ?? null)
                                }
                                disabled={isFieldDisabled("wageInterval")}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-l-none">
                                    / <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {wageIntervals.map((interval) => (
                                    <SelectItem key={interval} value={interval}>
                                      {getWageIntervalLabel(interval)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <FormDescription>
                      {getDescription("wage") ?? "Optional"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div
            className={`grid grid-cols-1 ${
              !isMobile ? "@md:grid-cols-3" : ""
            } gap-x-4 gap-y-6 items-start`}
          >
            {shouldShowField("city") && (
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("city", "City")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        disabled={isFieldDisabled("city")}
                      />
                    </FormControl>
                    {getDescription("city") && (
                      <FormDescription>
                        {getDescription("city")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {shouldShowField("stateAbbreviation") && (
              <FormField
                name="stateAbbreviation"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("stateAbbreviation", "State")}
                    </FormLabel>
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) =>
                        field.onChange(val === NONE_SELECT_VALUE ? null : val)
                      }
                      disabled={isFieldDisabled("stateAbbreviation")}
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
                            {getClearStateLabel()}
                          </SelectItem>
                        )}
                        <StateSelectItems />
                      </SelectContent>
                    </Select>
                    {getDescription("stateAbbreviation") && (
                      <FormDescription>
                        {getDescription("stateAbbreviation")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {shouldShowField("locationRequirement") && (
              <FormField
                name="locationRequirement"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("locationRequirement", "Location Requirement")}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isFieldDisabled("locationRequirement")}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationRequirements.map((lr) => (
                          <SelectItem key={lr} value={lr}>
                            {getLocationRequirementLabel(lr)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getDescription("locationRequirement") && (
                      <FormDescription>
                        {getDescription("locationRequirement")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div
            className={`grid grid-cols-1 ${
              !isMobile ? "@md:grid-cols-2" : ""
            } gap-x-4 gap-y-6 items-start`}
          >
            {shouldShowField("type") && (
              <FormField
                name="type"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("type", "Job Type")}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isFieldDisabled("type")}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {jobListingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {getJobTypeLabel(type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getDescription("type") && (
                      <FormDescription>
                        {getDescription("type")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {shouldShowField("experienceLevel") && (
              <FormField
                name="experienceLevel"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                      {getLabel("experienceLevel", "Experience Level")}
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isFieldDisabled("experienceLevel")}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {experienceLevels.map((experience) => (
                          <SelectItem key={experience} value={experience}>
                            {getExperienceLevelLabel(experience)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {getDescription("experienceLevel") && (
                      <FormDescription>
                        {getDescription("experienceLevel")}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {shouldShowField("description") && (
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-gray-700 tracking-tighter">
                    {getLabel("description", "Description")}
                  </FormLabel>
                  <FormControl>
                    <div
                      className={cn(
                        isFieldDisabled("description") &&
                          "opacity-50 pointer-events-none"
                      )}
                    >
                      <MarkdownEditor
                        {...field}
                        markdown={field.value}
                        className="min-h-[200px]"
                      />
                    </div>
                  </FormControl>
                  {getDescription("description") && (
                    <FormDescription>
                      {getDescription("description")}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Custom children for additional fields */}
          {children?.(form)}
        </div>

        {!hideSubmitButton && (
          <div className={cn("pt-4 mt-4", showBorder && "border-t")}>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isLoading}
              className={cn(
                "w-full bg-gray-900 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-gray-800 transition-colors",
                buttonClassName
              )}
            >
              {form.formState.isSubmitting || isLoading
                ? submittingText
                : submitButtonText}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
