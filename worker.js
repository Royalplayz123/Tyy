export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname;

      // ===== DOMAINS =====
      const RUN_DOMAIN  = "run.codenestsolution.qzz.io";
      const HOST_DOMAIN = "host.codenestsolution.qzz.io";

      // ===== POPUP CREDS (browser only) =====
      const USER = "admin";
      const PASS = "1234";

      // ===== FULL LOADER (SAFE VERSION) =====
      const LOADER = `#!/usr/bin/env bash
# ==================================================
#  CODENEST SECURE LOADER | BOOTSTRAP SYSTEM
# ==================================================
set -euo pipefail

# --- COLORS ---
C_RESET='\\033[0m'
C_BOLD='\\033[1m'
C_GREEN='\\033[1;32m'
C_BLUE='\\033[1;34m'
C_PURPLE='\\033[1;35m'
C_GRAY='\\033[1;90m'

draw_header() {
  clear
  echo -e "\\${C_PURPLE}╔════════════════════════════════════════════════════════════╗\\${C_RESET}"
  echo -e "\\${C_PURPLE}║\\${C_RESET} \\${C_BOLD}CODENEST CLOUD INSTALLER\\${C_RESET} \\${C_GRAY}:: SECURE BOOTSTRAP        \\${C_PURPLE}║\\${C_RESET}"
  echo -e "\\${C_PURPLE}╚════════════════════════════════════════════════════════════╝\\${C_RESET}"
  echo ""
}

draw_header
echo -e "\\${C_BLUE}➜\\${C_RESET} Downloading installer payload..."
sleep 1
echo -e "\\${C_GREEN}✔ Payload received. Executing...\\${C_RESET}"

bash <(curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh)
`;

      // ===== RUN DOMAIN (POPUP FOR BROWSER ONLY) =====
      if (hostname === RUN_DOMAIN) {
        const ua = request.headers.get("User-Agent") || "";

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

          let decoded;
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

      // ===== HOST DOMAIN (REAL CMD ENDPOINT) =====
      if (hostname === HOST_DOMAIN) {
        return new Response(LOADER, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }
        });
      }

      return new Response("Not found", { status: 404 });

    } catch (err) {
      return new Response("Worker runtime error", { status: 500 });
    }
  }
};
    } catch (e) {
      return new Response("Worker runtime error", { status: 500 });
    }
  }
};
