import { join } from "path";
import Link from "next/link";
import matter from "gray-matter";
import { promises as fs } from "fs";

import Container from "@component/overall/Container";
import HeroBanner from "@component/section/HeroBanner";
import ChainGrid from "@/components/showcase/chain/ChainGrid";
import CollectionLinks from "@component/ui/CollectionLinks";

export const metadata = {
  title: "Chains",
};

const chainsPath = join(process.cwd(), "/data/chains");

async function getChains() {
  const chainSlugs = await fs.readdir(chainsPath);

  const chainPosts = await Promise.all(
    chainSlugs.map(async (chainSlug) => {
      const postPath = join(chainsPath, chainSlug);
      const chainItem = await fs.readFile(postPath, "utf-8");

      const { data: chainData } = matter(chainItem);

      return {
        title: chainData.title,
        logo: chainData.logo,
        chainID: chainData.ChainID,
        currency: chainData.currency,
        poolManager: chainData.poolManager,
        poolInitializeTest: chainData.poolInitializeTest || "",
        poolModifyLiquitifyTest: chainData.poolModifyLiquitifyTest || "",
        poolSwapTest: chainData.poolSwapTest || "",
        slug: chainSlug.replace(".mdx", ""),
        tags: chainData.tags,
        docs: chainData.docs,
      };
    })
  );

  return chainPosts.sort((a, b) =>
    a.chainID === 111 ? -1 : b.chainID === 111 ? 1 : 0
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const chainPosts = await getChains();
  const showNew = searchParams.new === "false";

  const newChains = chainPosts.filter((chain) => chain.tags?.includes("new"));
  const oldChains = chainPosts.filter((chain) => !chain.tags?.includes("new"));

  const activeCategory = {
    category: "Chains",
    emoji: "🔗",
  };
  const sections = [
    {
      id: "false",
      title: "New Chains",
      count: newChains.length,
      description: "New chains that have been added to the list.",
      emoji: "🆕",
    },
    {
      id: "true",
      title: "Old Chains",
      count: oldChains.length,
      description: "Chains that have been around for a while.",
      emoji: "🕰",
    },
  ];

  return (
    <>
      <HeroBanner
        title="Chains"
        subtitle="List of EVM networks where Uniswap v4 is deployed."
      />

      <Container classNames="pb-8 lg:pb-12">
        <CollectionLinks
          activeCollection={showNew ? "false" : "true"}
          activeCategory={activeCategory}
          // @ts-ignore: Showcases the CollectionLinks component
          componentsData={sections}
        />
        <div className="h-8" />
        <ChainGrid chainPosts={showNew ? newChains : oldChains} />
      </Container>
    </>
  );
}
