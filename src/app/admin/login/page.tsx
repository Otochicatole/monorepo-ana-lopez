import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/features/admin/infrastructure/admin-auth";
import { loginAction } from "@/features/admin/application/admin-actions";
import { Card, CardBody } from "@/features/admin/presentation/components/ui/card";
import { Button } from "@/features/admin/presentation/components/ui/button";
import { FormField, Input } from "@/features/admin/presentation/components/ui/form-controls";
import { Alert } from "@/features/admin/presentation/components/ui/page-shell";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardBody className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/40">CMS Ana Lopez</p>
            <h1 className="oswald mt-2 text-3xl text-white">Admin Login</h1>
          </div>
          {params.error ? (
            <Alert tone="error">Invalid credentials. Please try again.</Alert>
          ) : null}
          <form action={loginAction} className="space-y-4">
            <FormField label="Username or email">
              <Input name="identifier" required autoComplete="username" />
            </FormField>
            <FormField label="Password">
              <Input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </FormField>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
