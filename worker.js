export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname;

      // ===== DOMAINS =====
      const RUN_DOMAIN  = "run.codenestsolution.qzz.io";
      const HOST_DOMAIN = "host.codenestsolution.qzz.io";

      // ===== BROWSER POPUP (OPTIONAL GATE) =====
      const USER = "admin";
      const PASS = "1234";

      // ===== RUN DOMAIN → POPUP ONLY (BROWSER) =====
      if (hostname === RUN_DOMAIN) {
        const ua = request.headers.get("User-Agent") || "";

        if (!ua.includes("curl")) {
          const auth = request.headers.get("Authorization");
          if (!auth || !auth.startsWith("Basic ")) {
            return new Response("Auth required", {
              status: 401,
              headers: {
                "WWW-Authenticate": 'Basic realm="Installer"'
              }
            });
          }

          const decoded = atob(auth.slice(6));
          const [u, p] = decoded.split(":");
          if (u !== USER || p !== PASS) {
            return new Response("Forbidden", { status: 403 });
          }
        }
      }

      // ===== HOST DOMAIN → REAL INSTALLER (REPO HIDDEN) =====
      if (hostname === HOST_DOMAIN) {
        // 🔒 Repo fetch happens HERE (server-side)
        const res = await fetch(
          "https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh"
        );

        if (!res.ok) {
          return new Response("Installer unavailable", { status: 502 });
        }

        const script = await res.text();

        return new Response(script, {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "no-store"
          }
        });
      }

      return new Response("Not found", { status: 404 });

    } catch {
      return new Response("Worker error", { status: 500 });
    }
  }
};
