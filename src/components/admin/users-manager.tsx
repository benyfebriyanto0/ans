"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { KeyRound, Loader2, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { changeOwnPassword, createAdminUser, deleteAdminUser, resetAdminPassword } from "@/server/actions/users";
import { formatDateTime } from "@/lib/utils";
import { Field } from "./field";
import { DeleteButton } from "./delete-button";
import { toastResult } from "./toast-result";

type U = { id: number; name: string; email: string; createdAt: Date };

export function UsersManager({ users, meId }: { users: U[]; meId: number }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errs, setErrs] = useState<Record<string, string[] | undefined>>({});
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwErrs, setPwErrs] = useState<Record<string, string[] | undefined>>({});
  const [resetFor, setResetFor] = useState<U | null>(null);
  const [resetPw, setResetPw] = useState("");

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Daftar akun admin</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.name}{" "}
                    {u.id === meId && (
                      <Badge variant="secondary" className="ml-1">
                        Anda
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatDateTime(u.createdAt)}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {u.id !== meId && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Reset password"
                          onClick={() => {
                            setResetFor(u);
                            setResetPw("");
                          }}
                        >
                          <KeyRound />
                        </Button>
                        <DeleteButton id={u.id} action={deleteAdminUser} title={`Hapus akun ${u.name}?`} />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Tambah admin</CardTitle>
            <CardDescription>Password min 8 karakter, berisi huruf & angka.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                start(async () => {
                  const r = await createAdminUser(form);
                  if (toastResult(r)) {
                    setForm({ name: "", email: "", password: "" });
                    setErrs({});
                    router.refresh();
                  } else if (!r.ok) setErrs(r.fieldErrors ?? {});
                });
              }}
            >
              <Field label="Nama" htmlFor="u-name" error={errs.name?.[0]}>
                <Input id="u-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </Field>
              <Field label="Email" htmlFor="u-email" error={errs.email?.[0]}>
                <Input
                  id="u-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </Field>
              <Field label="Password" htmlFor="u-pass" error={errs.password?.[0]}>
                <Input
                  id="u-pass"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </Field>
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader2 className="animate-spin" /> : <Plus />} Tambah
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4" /> Ganti password saya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                start(async () => {
                  const r = await changeOwnPassword(pw);
                  if (toastResult(r)) {
                    setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setPwErrs({});
                  } else if (!r.ok) setPwErrs(r.fieldErrors ?? {});
                });
              }}
            >
              <Field label="Password saat ini" htmlFor="pw-cur" error={pwErrs.currentPassword?.[0]}>
                <Input
                  id="pw-cur"
                  type="password"
                  autoComplete="current-password"
                  value={pw.currentPassword}
                  onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
                />
              </Field>
              <Field label="Password baru" htmlFor="pw-new" error={pwErrs.newPassword?.[0]}>
                <Input
                  id="pw-new"
                  type="password"
                  autoComplete="new-password"
                  value={pw.newPassword}
                  onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                />
              </Field>
              <Field label="Ulangi password baru" htmlFor="pw-conf" error={pwErrs.confirmPassword?.[0]}>
                <Input
                  id="pw-conf"
                  type="password"
                  autoComplete="new-password"
                  value={pw.confirmPassword}
                  onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })}
                />
              </Field>
              <Button type="submit" variant="outline" disabled={pending} className="w-full">
                Ganti Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!resetFor} onOpenChange={(o) => !o && setResetFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password {resetFor?.name}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!resetFor) return;
              start(async () => {
                const r = await resetAdminPassword(resetFor.id, { password: resetPw });
                if (toastResult(r)) setResetFor(null);
              });
            }}
          >
            <Field label="Password baru" htmlFor="rp">
              <Input
                id="rp"
                type="password"
                autoComplete="new-password"
                value={resetPw}
                onChange={(e) => setResetPw(e.target.value)}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setResetFor(null)}>
                Batal
              </Button>
              <Button type="submit" disabled={pending}>
                Simpan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
