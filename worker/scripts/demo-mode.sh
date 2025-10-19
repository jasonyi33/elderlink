#!/bin/bash

# Demo Mode Management Script
# Use this to enable/disable demo mode for live demonstrations

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ENV="${1:-dev}"  # Default to dev environment

show_help() {
    echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║        ElderLink Demo Mode Management                        ║${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo "Usage: ./demo-mode.sh [command] [environment]"
    echo ""
    echo "Commands:"
    echo "  enable     - Enable demo mode (pre-scripted first call)"
    echo "  disable    - Disable demo mode (all calls live)"
    echo "  status     - Check current demo mode status"
    echo "  help       - Show this help message"
    echo ""
    echo "Environment: dev (default) | production"
    echo ""
    echo "Examples:"
    echo "  ./demo-mode.sh enable        # Enable demo mode in dev"
    echo "  ./demo-mode.sh status        # Check status in dev"
    echo "  ./demo-mode.sh disable prod  # Disable in production"
    echo ""
}

enable_demo_mode() {
    echo -e "${YELLOW}🎬 Enabling demo mode in ${ENV} environment...${NC}"

    npx wrangler kv:key put --binding=KV "demo-mode-active" "true" --env "$ENV"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Demo mode ENABLED${NC}"
        echo ""
        echo -e "${BLUE}Demo Flow:${NC}"
        echo "  1️⃣  First call will use pre-scripted conversation (5 exchanges)"
        echo "  2️⃣  Dashboard updates in real-time with demo sentiment/emotions"
        echo "  3️⃣  Language switches English → Mandarin on exchange 4"
        echo "  4️⃣  After call ends, demo mode auto-disables"
        echo "  5️⃣  All subsequent calls use live Gemini/ElevenLabs"
        echo ""
        echo -e "${YELLOW}⚠️  Make sure to test the call flow before the actual demo!${NC}"
    else
        echo -e "${RED}❌ Failed to enable demo mode${NC}"
    fi
}

disable_demo_mode() {
    echo -e "${YELLOW}Disabling demo mode in ${ENV} environment...${NC}"

    npx wrangler kv:key delete --binding=KV "demo-mode-active" --env "$ENV"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Demo mode DISABLED${NC}"
        echo -e "${BLUE}All calls will now use live mode (real Gemini/ElevenLabs)${NC}"
    else
        echo -e "${RED}❌ Failed to disable demo mode${NC}"
    fi
}

check_status() {
    echo -e "${BLUE}Checking demo mode status in ${ENV} environment...${NC}"
    echo ""

    # Get status from API
    if [ "$ENV" == "dev" ]; then
        URL="https://elderlink-dev.elderlinkhelper.workers.dev/api/demo-mode"
    else
        URL="https://elderlink.elderlinkhelper.workers.dev/api/demo-mode"
    fi

    RESPONSE=$(curl -s "$URL")

    if [ $? -eq 0 ]; then
        echo "$RESPONSE" | jq '.'
    else
        echo -e "${RED}❌ Failed to get status from API${NC}"
        echo "Trying direct KV lookup..."
        npx wrangler kv:key get --binding=KV "demo-mode-active" --env "$ENV"
    fi
}

# Main script logic
case "${2:-$1}" in
    enable)
        enable_demo_mode
        ;;
    disable)
        disable_demo_mode
        ;;
    status)
        check_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        if [ -z "$1" ]; then
            show_help
        else
            echo -e "${RED}Unknown command: $1${NC}"
            echo ""
            show_help
        fi
        ;;
esac
