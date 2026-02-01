export default {
  async fetch(request) {
    const url = new URL(request.url);
    const host = url.hostname;

    // ========= CONFIG =========
    const USER = "admin";
    const PASS = "1234";

    const LOADER_CODE = `#!/usr/bin/env bash
# NOBITA STYLE LOADER
set -e

bash <(curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh)
`;

    // ========= RUN DOMAIN (POPUP) =========
    if (host.startsWith("run.")) {
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

      // AUTH OK → return loader
      return new Response(LOADER_CODE, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    // ========= PTERO DOMAIN (RAW CODE, NO POPUP) =========
    if (host.startsWith("ptero.")) {
      return new Response(LOADER_CODE, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    // ========= DEFAULT =========
    return new Response("Not found", { status: 404 });
  }
};
