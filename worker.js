export default {
  async fetch(request) {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname;

      // ===== DOMAINS =====
      const RUN_DOMAIN  = "run.codenestsolution.qzz.io";
      const HOST_DOMAIN = "host.codenestsolution.qzz.io";

      // ===== POPUP CREDS (sirf browser ke liye) =====
      const USER = "admin";
      const PASS = "1234";

      // ===== FULL FRIEND-STYLE LOADER =====
      const LOADER = `#!/usr/bin/env bash
# ==================================================
#  NOBITA SECURE LOADER | BOOTSTRAP SYSTEM
# ==================================================
set -euo pipefail

# --- COLORS ---
C_RESET='\\033[0m'
C_BOLD='\\033[1m'
C_RED='\\033[1;31m'
C_GREEN='\\033[1;32m'
C_YELLOW='\\033[1;33m'
C_BLUE='\\033[1;34m'
C_PURPLE='\\033[1;35m'
C_CYAN='\\033[1;36m'
C_WHITE='\\033[1;37m'
C_GRAY='\\033[1;90m'

draw_header() {
  clear
  echo -e "\\${C_PURPLE}╔════════════════════════════════════════════════════════════╗\\${C_RESET}"
  echo -e "\\${C_PURPLE}║\\${C_RESET} \\${C_BOLD}\\${C_WHITE}CODENEST CLOUD INSTALLER\\${C_RESET} \\${C_GRAY}::\\${C_RESET} \\${C_CYAN}SECURE BOOTSTRAP\\${C_RESET}        \\${C_PURPLE}║\\${C_RESET}"
  echo -e "\\${C_PURPLE}╚════════════════════════════════════════════════════════════╝\\${C_RESET}"
  echo ""
}

spinner() {
  local pid=\\$1
  local spin='|/-\\\\'
  while kill -0 \\$pid 2>/dev/null; do
    for i in {0..3}; do
      printf "\\r\\${C_CYAN}[%c]\\${C_RESET} Working..." "\\${spin:\\$i:1}"
      sleep 0.1
    done
  done
  printf "\\r"
}

draw_header
echo -e "\\${C_BLUE}➜\\${C_RESET} Fetching installer payload..."

(
  curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh
) &
spinner \\$!

echo -e "\\n\\${C_GREEN}✔ Payload received. Executing...\\${C_RESET}"
bash <(curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh)
`;

      // ===== RUN DOMAIN (POPUP ONLY FOR BROWSER) =====
      if (hostname === RUN_DOMAIN) {
        const ua = request.headers.get("User-Agent") || "";

        // Browser ko popup
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

        // curl ko bina auth allow (friend-style)
        return new Response(LOADER, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }
        });
      }

      // ===== HOST DOMAIN (REAL LOADER + CMD ENDPOINT) =====
      if (hostname === HOST_DOMAIN) {
        return new Response(LOADER, {
          headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" }
        });
      }

      return new Response("Not found", { status: 404 });

    } catch (e) {
      return new Response("Worker runtime error", { status: 500 });
    }
  }
};
