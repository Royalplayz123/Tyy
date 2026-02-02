export default {
  async fetch(request) {
    const url = new URL(request.url);
    const hostname = url.hostname;

    // ===== CONFIG =====
    const RUN_DOMAIN  = "run.codenestsolution.qzz.io";
    const HOST_DOMAIN = "host.codenestsolution.qzz.io";

    // Browser popup credentials (sirf run domain ke liye)
    const USER = "admin";
    const PASS = "1234";

    // ===== FULL FRIEND-STYLE LOADER =====
    const LOADER = `#!/usr/bin/env bash
# ==================================================
#  NOBITA SECURE LOADER | BOOTSTRAP SYSTEM (FIXED)
# ==================================================
set -euo pipefail

# --- COLORS & STYLES ---
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

# --- CONFIG ---
URL="https://${HOST_DOMAIN}"
HOST="${HOST_DOMAIN}"

draw_header() {
  clear
  echo -e "\\${C_PURPLE}╔════════════════════════════════════════════════════════════╗\\${C_RESET}"
  echo -e "\\${C_PURPLE}║\\${C_RESET} \\${C_BOLD}\\${C_WHITE}NOBITA CLOUD UPLINK\\${C_RESET} \\${C_GRAY}::\\${C_RESET} \\${C_CYAN}SECURE BOOTSTRAP\\${C_RESET}                 \\${C_PURPLE}║\\${C_RESET}"
  echo -e "\\${C_PURPLE}╚════════════════════════════════════════════════════════════╝\\${C_RESET}"
  echo -e "\\${C_GRAY}  Target Host: \\${C_WHITE}\\$HOST\\${C_RESET}"
  echo ""
}

draw_header

# Call the actual installer (same as friend)
bash <(curl -fsSL https://raw.githubusercontent.com/nobita329/ptero/main/ptero/run.sh)
`;

    // ===== RUN DOMAIN → POPUP (BROWSER GATE ONLY) =====
    if (hostname === RUN_DOMAIN) {
      const ua = request.headers.get("User-Agent") || "";

      // Browser ke liye popup
      if (!ua.includes("curl")) {
        const auth = request.headers.get("Authorization");
        if (!auth) {
          return new Response("Auth required", {
            status: 401,
            headers: {
              "WWW-Authenticate": 'Basic realm="Secure Installer"'
            }
          });
        }
        const decoded = atob(auth.split(" ")[1] || "");
        const [u, p] = decoded.split(":");
        if (u !== USER || p !== PASS) {
          return new Response("Forbidden", { status: 403 });
        }
      }

      // curl ke liye direct allow (friend-style)
      return new Response(LOADER, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    // ===== HOST DOMAIN → RAW LOADER (NO POPUP) =====
    if (hostname === HOST_DOMAIN) {
      return new Response(LOADER, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    // ===== FALLBACK =====
    return new Response("Not found", { status: 404 });
  }
};
