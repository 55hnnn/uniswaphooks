import Container from "@component/overall/Container";
import SplashButton from "@component/ui/SplashButton";
import HookOwned from "@component/showcase/hook/HookOwned";

async function getHook(id: string) {
  const hookFetch = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL_DEV}/api/hook/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    }
  );

  if (!hookFetch.ok) {
    throw new Error("Failed to fetch hooks");
  }

  const hook = await hookFetch.json();
  return hook;
}

export default async function HookSubbmission({ id }: { id: string }) {
  const hook = await getHook(id);

  return (
    <Container classNames="-mx-2 flex flex-col justify-center items-center">
      <HookOwned componentData={hook} />
      <div className="h-8" />
      <SplashButton href="/dashboard" id={"home"}>
        <span>🏠</span> Back to home
      </SplashButton>
    </Container>
  );
}
