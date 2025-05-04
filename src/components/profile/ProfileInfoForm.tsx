
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const profileFormSchema = z.object({
  fullName: z.string().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileInfoFormProps {
  defaultValues: ProfileFormValues;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  loading: boolean;
  userEmail: string | undefined;
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  userEmail,
}) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  // Reset form when defaultValues change
  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Email Address</h3>
        <p className="text-sm text-muted-foreground mb-1">
          This is the email address associated with your account.
        </p>
        <Input value={userEmail || ""} disabled readOnly />
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} value={field.value || ""} />
                </FormControl>
                <FormDescription>
                  This is the name that will be displayed on your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a username" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public username.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="mt-4" 
            disabled={loading || !form.formState.isDirty}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileInfoForm;
