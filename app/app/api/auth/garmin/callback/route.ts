import { NextRequest, NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { prisma } from "@/prisma";

const GARMIN_ACCESS_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/access_token";
const GARMIN_CONSUMER_KEY = process.env.GARMIN_CONSUMER_KEY!;
const GARMIN_CONSUMER_SECRET = process.env.GARMIN_CONSUMER_SECRET!;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const oauthToken = url.searchParams.get("oauth_token");
    const oauthVerifier = url.searchParams.get("oauth_verifier");

    if (!oauthToken || !oauthVerifier) {
      return NextResponse.json({ error: "Fehlende OAuth-Parameter" }, { status: 400 });
    }

    const authEntry = await prisma.garminAuth.findUnique({
      where: { oauthToken },
    });

    if (!authEntry) {
      return NextResponse.json({ error: "Kein passender Nutzer gefunden" }, { status: 403 });
    }

    const userId = authEntry.userId;

    const oauth = new OAuth({
      consumer: { key: GARMIN_CONSUMER_KEY, secret: GARMIN_CONSUMER_SECRET },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto.createHmac("sha1", key).update(base_string).digest("base64");
      },
    });

    const token = {
      key: oauthToken,
      secret: authEntry.oauthTokenSecret,
    };

    const requestData = {
      url: GARMIN_ACCESS_TOKEN_URL,
      method: "POST",
      data: { oauth_verifier: oauthVerifier },
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

    //access token from garmin response
    const response = await fetch(GARMIN_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: { 
        "Authorization": authHeader["Authorization"],
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ oauth_verifier: oauthVerifier }),
    });

    if (!response.ok) {
      console.error("❌ Fehler beim Abrufen des Access Tokens:", await response.text());
      return NextResponse.json({ error: "Fehler beim Abrufen des Access Tokens" }, { status: 500 });
    }

    const responseText = await response.text();
    const params = new URLSearchParams(responseText);
    const accessToken = params.get("oauth_token");
    const accessTokenSecret = params.get("oauth_token_secret");

    if (!accessToken || !accessTokenSecret) {
      return NextResponse.json({ error: "Ungültige Antwort von Garmin" }, { status: 500 });
    }

    //store access token in user table
    await prisma.user.update({
      where: { id: userId },
      data: {
        garminAccessToken: accessToken,
        garminAccessTokenSecret: accessTokenSecret,
      },
    });

    await prisma.garminAuth.delete({
      where: { userId },
    });

    return NextResponse.redirect(`http://localhost:3000/user`);

  } catch (error) {
    console.error("❌ Fehler bei Garmin OAuth Callback:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
