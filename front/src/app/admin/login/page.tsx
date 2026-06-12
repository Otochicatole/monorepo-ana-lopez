import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/features/admin/infrastructure/admin-auth";
import { loginAction } from "@/features/admin/application/admin-actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");
  const params = await searchParams;

  return (
    <div className="mx-auto mt-20 max-w-md rounded border border-white/10 bg-white/5 p-6">
      <h1 className="oswald mb-6 text-3xl">Admin Login</h1>
      {params.error && (
        <p className="mb-4 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
          Credenciales invalidas.
        </p>
      )}
      <form action={loginAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm">
          Usuario o email
          <input
            name="identifier"
            required
            className="rounded border border-white/10 bg-black/40 px-3 py-2"
            defaultValue="admin@example.com"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            className="rounded border border-white/10 bg-black/40 px-3 py-2"
          />
        </label>
        <button className="rounded bg-pk px-4 py-2 font-bold text-white">
          Entrar
        </button>
      </form>
      <p className="mt-4 text-xs text-white/50">
        Si corriste el seed sin variables, el password inicial es admin123456.
      </p>
    </div>
  );
}

