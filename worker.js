export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname;

      // ===== CONFIG =====
      const RUN_DOMAIN  = "run.codenestsolution.qzz.io";
      const HOST_DOMAIN = "host.codenestsolution.qzz.io";

      const USER = "admin";
      const PASS = "1234";

      // ===== LOADER =====
      const LOADER = `#!/usr/bin/env bash
# NOBITA STYLE LOADER
set -e

bash <(curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh)
`;

      // ===== RUN DOMAIN (POPUP ONLY FOR BROWSER) =====
      if (hostname === RUN_DOMAIN) {
        const ua = request.headers.get("User-Agent") || "";

        // Browser ke liye auth
        if (!ua.includes("curl")) {
          const auth = request.headers.get("Authorization");
          if (!auth || !auth.startsWith("Basic ")) {
            return new Response("Auth required", {
              status: 401,
              headers: {
                "WWW-Authenticate": 'Basic realm="Secure Installer"'
              }
            });
          }

          let decoded = "";
          try {
            decoded = atob(auth.slice(6));
          } catch {
            return new Response("Forbidden", { status: 403 });
          }

          const [u, p] = decoded.split(":");
          if (u !== USER || p !== PASS) {
            return new Response("Forbidden", { status: 403 });
          }
        }

        return new Response(LOADER, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }
        });
      }

      // ===== HOST DOMAIN (RAW LOADER, NO AUTH) =====
      if (hostname === HOST_DOMAIN) {
        return new Response(LOADER, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }
        });
      }

      return new Response("Not found", { status: 404 });

    } catch (err) {
      // HARD SAFETY NET (no more 500 without reason)
      return new Response("Worker error", { status: 500 });
    }
  }
};
