#!/usr/bin/env bash
# Copyright (c) 2026, Rye Stahle-Smith; All rights reserved.
# Personal Website
# Last Updated: June 2nd, 2026
# Description: Bash script to start the Vercel development server.
#              Vercel serves the Vite frontend and Python API functions together.

set -e  # Exit immediately on any error

# Determine project root
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Define a helper function that generates an AppleScript-escaped string (for use in osascript commands)
escape_apple_script_string() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  printf '%s' "$value"
}

# Define a helper function that opens each command in a new terminal window, with cross-platform support
open_in_terminal() {
  local cmd="$1"
  local _pid_var="$2"

  # Support for the macOS Terminal.app
  if [ "$(uname)" = "Darwin" ]; then
    local escaped_cmd
    escaped_cmd="$(escape_apple_script_string "$cmd")"
    osascript <<OSA
tell application "Terminal"
  do script "$escaped_cmd"
end tell
OSA
    eval "$_pid_var=''"
    return 0
  fi

  # Support for various Linux terminal emulators
  if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal -- bash -ic "$cmd; exec bash" >/dev/null 2>&1 &
    eval "$_pid_var=''"
    return 0
  fi
  if command -v konsole >/dev/null 2>&1; then
    konsole -e bash -lc "$cmd; exec bash" >/dev/null 2>&1 &
    eval "$_pid_var=''"
    return 0
  fi
  if command -v xterm >/dev/null 2>&1; then
    xterm -hold -e bash -lc "$cmd" >/dev/null 2>&1 &
    eval "$_pid_var=''"
    return 0
  fi

  # Fallback: run in background in this shell and return the PID
  bash -c "$cmd" &
  eval "$_pid_var=$!"
  return 0
}

# Start the frontend and API functions through Vercel from the project root.
VERCEL_CMD="cd '$ROOT' ; npx vercel dev"
echo "Starting Vercel development server..."
open_in_terminal "$VERCEL_CMD" VERCEL_PID

# Display instructions to the user
if [ -n "$VERCEL_PID" ]; then
  echo ""; echo "Vercel development server is starting at http://localhost:3000."
  trap "kill ${VERCEL_PID:-} 2>/dev/null; echo 'Server stopped.'" EXIT INT TERM
  wait
else
  echo ""
  echo "Close the new terminal window to stop the server..."
fi
