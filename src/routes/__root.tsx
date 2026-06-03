import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/AppShell";
import { AuthProvider } from "../lib/auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Sidan finns inte här</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Lite som en tanke som hann passera innan vi hann fånga den.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Tillbaka hem
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Något hakade upp sig</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Det händer. Försök ladda om — eller gå hem och andas lite.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            Försök igen
          </button>
          <a
            href="/"
            className="rounded-full border px-5 py-2.5 text-sm font-bold"
          >
            Hem
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f59e0b" },
      { title: "Andrum – ett litet mellanrum i vardagen" },
      {
        name: "description",
        content:
          "Andrum är en svensk app för korta andningsövningar, mindfulness och mentala pauser. Kom in, andas lite, gå vidare.",
      },
      { property: "og:title", content: "Andrum – ett litet mellanrum i vardagen" },
      {
        property: "og:description",
        content: "Kom in, andas lite, släpp taget, gå vidare.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Andrum – ett litet mellanrum i vardagen" },
      { name: "description", content: "En svensk PWA för mindfulness, meditation och korta mentala pauser." },
      { property: "og:description", content: "En svensk PWA för mindfulness, meditation och korta mentala pauser." },
      { name: "twitter:description", content: "En svensk PWA för mindfulness, meditation och korta mentala pauser." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ec826b4e-226f-41e7-9669-1222690b561a/id-preview-c30be6e1--f6de5050-e2bb-4b64-b2b9-294cd2b75373.lovable.app-1780496573760.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ec826b4e-226f-41e7-9669-1222690b561a/id-preview-c30be6e1--f6de5050-e2bb-4b64-b2b9-294cd2b75373.lovable.app-1780496573760.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </AuthProvider>
    </QueryClientProvider>
  );
}
