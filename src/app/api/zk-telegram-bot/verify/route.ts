import { NextResponse } from "next/server";
import { ZkTelegramBotAppType, getApp, getSpace } from "@/src/libs/spaces";
import {
  AuthType,
  SismoConnect,
  SismoConnectResponse,
  SismoConnectConfig,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-server";
import env from "@/src/environments";
import ServiceFactory from "@/src/libs/service-factory/service-factory";

export async function POST(req: Request) {
  const logger = ServiceFactory.getLoggerService();
  const userStore = ServiceFactory.getZkTelegramBotUserStore();
  const { response, spaceSlug, appSlug } = await req.json();

  const space = getSpace({ slug: spaceSlug });
  const app = getApp({ appSlug: appSlug, spaceSlug: space.slug }) as ZkTelegramBotAppType;

  if (!app) {
    return errorResponse(`Failed to find app ${appSlug} in space ${spaceSlug}`);
  }

  try {
    const telegramId = await sismoConnectVerifyResponse(app, response);
    const isUserAlreadySaved = await userStore.exists({ userId: telegramId, appSlug });
    if (isUserAlreadySaved) {
      logger.debug(`User ${telegramId} is already approved`);
      return NextResponse.json({ status: "already-approved" });
    }

    const entry = {
      appSlug: app.slug,
      userId: telegramId,
    };
    logger.debug(`Adding ${JSON.stringify(entry)}`);
    await userStore.add(entry);
    return NextResponse.json({ status: "approved" });
  } catch (error) {
    return errorResponse(`Failed to add to the whitelist: ${error.message}`);
  }
}

const sismoConnectVerifyResponse = async (
  app: ZkTelegramBotAppType,
  response: SismoConnectResponse
): Promise<string> => {
  const config: SismoConnectConfig = {
    appId: app.appId,
    vault: {
      impersonate: app.impersonateAddresses,
    },
  };
  const sismoConnect = SismoConnect({ config });
  const verifyParams = {
    claims: app.claimRequests,
    auths: app.authRequests,
  };
  const result = await sismoConnect.verify(response, verifyParams);
  return result.getUserId(AuthType.TELEGRAM);
};

const errorResponse = (message: string): Response => {
  if (env.isDev) {
    console.error(message);
  }
  return NextResponse.json({
    status: "error",
    message: message,
  });
};
