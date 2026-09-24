import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    console.error("MAL OAuth Error:", error);
    return NextResponse.redirect(new URL("/anime?auth_error=" + encodeURIComponent(error), request.url));
  }

  // Once user provides MAL_CLIENT_ID and MAL_CLIENT_SECRET, this exchanges code for access token
  const clientId = process.env.MAL_CLIENT_ID;
  const clientSecret = process.env.MAL_CLIENT_SECRET;

  if (code && clientId && clientSecret) {
    try {
      // Exchange OAuth code for MAL access token
      const tokenRes = await fetch("https://myanimelist.net/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          code,
          redirect_uri: `${new URL(request.url).origin}/api/auth/callback/mal`,
        }),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        // Redirect to anime hub with success
        return NextResponse.redirect(new URL("/anime?mal_connected=true", request.url));
      }
    } catch (err) {
      console.error("Failed to exchange MAL token:", err);
    }
  }

  // Fallback redirect back to anime page
  return NextResponse.redirect(new URL("/anime?mal_auth=received", request.url));
}
