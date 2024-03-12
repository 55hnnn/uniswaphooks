import { redirect } from "next/navigation";
import { getCurrentUser } from "@lib/session";

import Container from "@component/overall/Container";
import HookGrid from "@component/showcase/hook/HookGrid";
import { DashboardHeader } from "@component/dashboard/Header";

import SplashButton from "@component/ui/SplashButton";
import { EmptyPlaceholder } from "@component/ui/EmptyPlaceholder";

export const metadata = {
  title: "Hooks",
  description: "Manage your hooks with ease.",
};

async function getHooks({
  id,
  isAdmin,
}: {
  id?: string | null | undefined;
  isAdmin: boolean;
}) {
  const hooksFetch = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/hook`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });

  if (!hooksFetch.ok) {
    throw new Error("Failed to fetch hooks");
  }

  const hooks = await hooksFetch.json();

  if (isAdmin) {
    return hooks.data;
  }

  hooks.data = hooks.data.filter((hook: any) => hook.user.id === id);
  hooks.data.sort((a: any, b: any) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return hooks.data;
}

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const hooks = await getHooks({ id: user.id, isAdmin: user.role === "admin" });

  return (
    <main>
      <DashboardHeader
        heading="Manage your hooks with ease."
        text="Create, edit, and manage your hooks."
      >
        <SplashButton href="/dashboard/hook/submit" id={"add-hook"}>
          <span>➕</span> Add a new hook
        </SplashButton>
      </DashboardHeader>

      <Container classNames="py-8 lg:py-6 space-y-8 lg:space-y-0">
        {hooks?.length ? (
          <HookGrid hookPosts={hooks} owned={true} role={user.role} />
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Title>No hooks created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any hooks created yet. Get started by adding a
              new
            </EmptyPlaceholder.Description>
            <SplashButton href="/dashboard/hook/submit" id={"add-new-hook"}>
              <span>➕ </span> Add a new hook
            </SplashButton>
          </EmptyPlaceholder>
        )}
      </Container>
    </main>
  );
}
