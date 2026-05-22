"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Github,
  Globe,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  Monitor,
  Moon,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sun,
  Unlink,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Password } from "@/components/origin-ui/password";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type SettingsPageProps = {
  userEmail: string;
  currentSessionId: string;
};

type SessionItem = {
  id: string;
  token: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
};

type ConnectedAccount = {
  id: string;
  providerId: string;
  accountId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    revokeOtherSessions: z.boolean().default(true),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.input<typeof passwordSchema>;
type PasswordValues = z.output<typeof passwordSchema>;

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "Use the bright interface.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the darker interface.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Match this device.",
    icon: Monitor,
  },
] as const;

const subscribeToHydrationStore = () => () => {};
const getHydratedSnapshot = () => true;
const getServerSnapshot = () => false;

export default function SettingsPage({
  userEmail,
  currentSessionId,
}: SettingsPageProps) {
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 overflow-y-auto rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold text-balance">Settings</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Manage account security, active sessions, and local preferences.
            </p>
          </div>

          <AppearanceSettings />
          <PasswordSettings />
          <SessionSettings currentSessionId={currentSessionId} />
          <ConnectedAccounts userEmail={userEmail} />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydrationStore,
    getHydratedSnapshot,
    getServerSnapshot,
  );
  const activeTheme = mounted ? theme : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose how GetMyCV looks on this device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = mounted && activeTheme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTheme(option.value)}
                className={cn(
                  "hover:bg-accent focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-28 flex-col gap-3 rounded-lg border p-4 text-left outline-none transition-colors focus-visible:ring-[3px]",
                  isActive && "border-primary bg-primary/5",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  {isActive ? (
                    <CheckCircle2
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-muted-foreground text-sm">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-muted-foreground mt-3 text-sm">
          Current effective theme:{" "}
          {mounted ? (resolvedTheme ?? "system") : "system"}.
        </p>
      </CardContent>
    </Card>
  );
}

function PasswordSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<PasswordFormValues, unknown, PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  async function onSubmit(values: PasswordValues) {
    setIsLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: values.revokeOtherSessions,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to update password");
      return;
    }

    form.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      revokeOtherSessions: true,
    });
    toast.success("Password updated successfully");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password and optionally revoke other sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-3">
              <Controller
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Current password
                    </FieldLabel>
                    <Password
                      {...field}
                      value={field.value ?? ""}
                      id={field.name}
                      autoComplete="current-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Current password"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                    <Password
                      {...field}
                      value={field.value ?? ""}
                      id={field.name}
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="New password"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                    </FieldLabel>
                    <Password
                      {...field}
                      value={field.value ?? ""}
                      id={field.name}
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm password"
                    />
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : null}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="revokeOtherSessions"
              render={({ field }) => (
                <Field orientation="horizontal">
                  <Checkbox
                    id={field.name}
                    checked={field.value ?? true}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Sign out other devices after changing password
                    </FieldLabel>
                    <FieldDescription>
                      Keep this session active and revoke every other active
                      session.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : <KeyRound data-icon="inline-start" />}
              Update password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function SessionSettings({ currentSessionId }: { currentSessionId: string }) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingToken, setRevokingToken] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadSessions = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setLoadError(null);

    const { data, error } = await authClient.listSessions();

    setIsLoading(false);

    if (error) {
      setLoadError(error.message || "Failed to load active sessions");
      return;
    }

    setSessions((data ?? []) as SessionItem[]);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialSessions() {
      const { data, error } = await authClient.listSessions();

      if (!isActive) {
        return;
      }

      setIsLoading(false);

      if (error) {
        setLoadError(error.message || "Failed to load active sessions");
        return;
      }

      setSessions((data ?? []) as SessionItem[]);
    }

    void loadInitialSessions();

    return () => {
      isActive = false;
    };
  }, []);

  async function revokeSession(session: SessionItem) {
    setRevokingToken(session.token);

    const { error } = await authClient.revokeSession({
      token: session.token,
    });

    setRevokingToken(null);

    if (error) {
      toast.error(error.message || "Failed to revoke session");
      return;
    }

    toast.success("Session revoked");
    await loadSessions(false);
  }

  async function revokeOtherSessions() {
    setIsRevokingAll(true);

    const { error } = await authClient.revokeOtherSessions();

    setIsRevokingAll(false);

    if (error) {
      toast.error(error.message || "Failed to revoke other sessions");
      return;
    }

    toast.success("Other sessions revoked");
    await loadSessions(false);
  }

  const otherSessionsCount = sessions.filter(
    (session) => session.id !== currentSessionId,
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active sessions</CardTitle>
        <CardDescription>
          Review where your account is currently signed in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 font-medium">
              <ShieldAlert className="size-5 text-destructive" />
              Unable to load sessions
            </div>
            <p className="text-muted-foreground text-sm">{loadError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadSessions()}
            >
              Try again
            </Button>
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">
              No active sessions were returned for this account.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                isCurrent={session.id === currentSessionId}
                isRevoking={revokingToken === session.token}
                onRevoke={() => revokeSession(session)}
              />
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {otherSessionsCount} other active{" "}
          {otherSessionsCount === 1 ? "session" : "sessions"}.
        </p>
        <Button
          variant="outline"
          disabled={isRevokingAll || otherSessionsCount === 0}
          onClick={revokeOtherSessions}
        >
          {isRevokingAll ? <Spinner /> : <LogOut data-icon="inline-start" />}
          Sign out other devices
        </Button>
      </CardFooter>
    </Card>
  );
}

function SessionRow({
  session,
  isCurrent,
  isRevoking,
  onRevoke,
}: {
  session: SessionItem;
  isCurrent: boolean;
  isRevoking: boolean;
  onRevoke: () => void;
}) {
  const device = useMemo(
    () => getDeviceDetails(session.userAgent),
    [session.userAgent],
  );
  const Icon = device.icon;

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
          <Icon className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{device.label}</p>
            {isCurrent ? <Badge variant="secondary">Current</Badge> : null}
          </div>
          <p className="text-muted-foreground text-sm">
            {session.ipAddress || "Unknown IP"} · Last active{" "}
            {formatDateTime(session.updatedAt)}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {session.userAgent || "Unknown user agent"}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={isCurrent || isRevoking}
        onClick={onRevoke}
      >
        {isRevoking ? <Spinner /> : <Unlink data-icon="inline-start" />}
        Revoke
      </Button>
    </div>
  );
}

function ConnectedAccounts({ userEmail }: { userEmail: string }) {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAccounts = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setLoadError(null);

    const { data, error } = await authClient.listAccounts();

    setIsLoading(false);

    if (error) {
      setLoadError(error.message || "Failed to load connected accounts");
      return;
    }

    setAccounts((data ?? []) as ConnectedAccount[]);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialAccounts() {
      const { data, error } = await authClient.listAccounts();

      if (!isActive) {
        return;
      }

      setIsLoading(false);

      if (error) {
        setLoadError(error.message || "Failed to load connected accounts");
        return;
      }

      setAccounts((data ?? []) as ConnectedAccount[]);
    }

    void loadInitialAccounts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected accounts</CardTitle>
        <CardDescription>
          Providers linked to your GetMyCV account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : loadError ? (
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <p className="text-muted-foreground text-sm">{loadError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadAccounts()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <AccountRow
              providerId="credential"
              title="Email and password"
              description={userEmail}
              connected={accounts.some(
                (account) =>
                  account.providerId === "credential" ||
                  account.providerId === "email-password",
              )}
            />
            <Separator />
            <AccountRow
              providerId="google"
              title="Google"
              description="Google sign-in provider"
              connected={accounts.some(
                (account) => account.providerId === "google",
              )}
            />
            <Separator />
            <AccountRow
              providerId="github"
              title="GitHub"
              description="GitHub sign-in provider"
              connected={accounts.some(
                (account) => account.providerId === "github",
              )}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AccountRow({
  providerId,
  title,
  description,
  connected,
}: {
  providerId: "credential" | "google" | "github";
  title: string;
  description: string;
  connected: boolean;
}) {
  const ProviderIcon =
    providerId === "github"
      ? Github
      : providerId === "google"
        ? Globe
        : KeyRound;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-full">
          <ProviderIcon className="size-5 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground truncate text-sm">
            {description}
          </p>
        </div>
      </div>
      <Badge variant={connected ? "secondary" : "outline"}>
        {connected ? "Connected" : "Not connected"}
      </Badge>
    </div>
  );
}

function DangerZone() {
  const [isLoading, setIsLoading] = useState(false);

  async function signOutEverywhere() {
    setIsLoading(true);

    const { error } = await authClient.revokeSessions();

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Failed to sign out everywhere");
      return;
    }

    toast.success("Signed out from all sessions");
    window.location.href = "/sign-in";
  }

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
        <CardDescription>
          End every active session for this account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field orientation="responsive">
          <FieldContent>
            <FieldTitle className="text-destructive">
              Sign out everywhere
            </FieldTitle>
            <FieldDescription>
              This revokes all sessions, including this browser. You will need
              to sign in again.
            </FieldDescription>
          </FieldContent>
          <Button
            variant="destructive"
            disabled={isLoading}
            onClick={signOutEverywhere}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign out everywhere
          </Button>
        </Field>
      </CardContent>
    </Card>
  );
}

function getDeviceDetails(userAgent?: string | null) {
  const normalized = userAgent?.toLowerCase() ?? "";

  if (
    normalized.includes("mobile") ||
    normalized.includes("iphone") ||
    normalized.includes("android")
  ) {
    return {
      label: "Mobile device",
      icon: Smartphone,
    };
  }

  if (normalized.includes("windows")) {
    return {
      label: "Windows browser",
      icon: Laptop,
    };
  }

  if (normalized.includes("mac")) {
    return {
      label: "Mac browser",
      icon: Laptop,
    };
  }

  if (normalized.includes("linux")) {
    return {
      label: "Linux browser",
      icon: Laptop,
    };
  }

  return {
    label: "Browser session",
    icon: ShieldCheck,
  };
}

function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
