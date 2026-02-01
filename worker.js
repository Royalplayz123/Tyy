export default {
  async fetch(request) {
    const USER = "admin";
    const PASS = "1234";

    const auth = request.headers.get("Authorization");

    if (!auth) {
      return new Response("Auth required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Installer"'
        }
      });
    }

    const token = auth.split(" ")[1];
    const decoded = atob(token || "");
    const [u, p] = decoded.split(":");

    if (u !== USER || p !== PASS) {
      return new Response("Forbidden", { status: 403 });
    }

    return new Response(
`#!/usr/bin/env bash
bash <(curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh)
`,
      {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      }
    );
  }
};
