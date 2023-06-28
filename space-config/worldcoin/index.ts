// add an images folder in your space folder if you would like Sismo to host your images
import { SpaceConfig } from "../types";

export const worldcoinConfig: SpaceConfig = {
  slug: "worldcoin",
  name: "Worldcoin",
  description: "Worldcoin is building the world's largest identity and financial network as a public utility, giving ownership to everyone.",
  profileImage: "worldcoin_pfp.jpeg",
  coverImage: "worldcoin_cover.jpeg",
  envs: ["Demo", "Prod"],
  hidden: false,
  apps: [
    {
      type: "custom",
      name: "Proof of personhood",
      appId: "0x3bcdab2ad3caddb11b90b02bde258f6b",
      description: "World ID is a digital passport that lets you prove you are a unique and real person while remaining anonymous.",
      tags: ["Proof of personhood"],
      image: "proof-of-personhood.png",
      CTAText: "Prove your are unique",
      slug: "proof-of-personhood",
      envs: ["Demo", "Prod"],
      authRequests: [{ authType: 0 }],
      path: "/worldcoin/proof-of-personhood",
      extraData: {
        api: "https://worldcoin-app-backend.vercel.app/api/proof-of-personhood",
        congratulationsMessage: {
          title: "Congratulations",
          description: "You have successfully proven your personhood. Your proof of personhood will be available in your Sismo Vault within 24 hours.",
        }
      }
    }
  ],
};
