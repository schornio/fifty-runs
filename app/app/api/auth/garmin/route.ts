import { NextRequest, NextResponse } from "next/server";
import OAuth from "oauth-1.0a";
import crypto from "crypto";
import { prisma } from "@/prisma";

const GARMIN_REQUEST_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/request_token";
const GARMIN_CONSUMER_KEY = process.env.GARMIN_CONSUMER_KEY!;
const GARMIN_CONSUMER_SECRET = process.env.GARMIN_CONSUMER_SECRET!;
const GARMIN_REDIRECT_URI = "http://localhost:3000/api/auth/garmin/callback";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // ✅ Nutzer-ID aus Anfrage erhalten

    if (!userId) {
      return NextResponse.json({ error: "Benutzer-ID fehlt" }, { status: 400 });
    }

    const oauth = new OAuth({
      consumer: { key: GARMIN_CONSUMER_KEY, secret: GARMIN_CONSUMER_SECRET },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto.createHmac("sha1", key).update(base_string).digest("base64");
      },
    });

    const requestData = {
      url: GARMIN_REQUEST_TOKEN_URL,
      method: "POST",
      data: { oauth_callback: GARMIN_REDIRECT_URI },
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData));

    const response = await fetch(GARMIN_REQUEST_TOKEN_URL, {
      method: "POST",
      headers: { Authorization: authHeader["Authorization"] },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Fehler beim Abrufen des Request Tokens" }, { status: 500 });
    }

    const responseText = await response.text();
    const params = new URLSearchParams(responseText);
    const oauthToken = params.get("oauth_token");
    const oauthTokenSecret = params.get("oauth_token_secret");

    if (!oauthToken || !oauthTokenSecret) {
      return NextResponse.json({ error: "Ungültige Antwort von Garmin" }, { status: 500 });
    }

    // ✅ Falls bereits ein Eintrag existiert, wird er aktualisiert (kein Unique-Error mehr!)
    await prisma.garminAuth.upsert({
      where: { userId },
      update: { oauthToken, oauthTokenSecret },
      create: { userId, oauthToken, oauthTokenSecret },
    });

    return NextResponse.json({
      authUrl: `https://connect.garmin.com/oauthConfirm?oauth_token=${oauthToken}`,
    });
  } catch (error) {
    console.error("❌ Fehler bei Garmin OAuth:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
