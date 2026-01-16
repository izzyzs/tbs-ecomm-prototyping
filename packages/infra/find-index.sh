#!/usr/bin/env zsh

find . -type f -name "index.ts" \
  -exec printf "\n\n===== %s =====\n" {} \; \
  -exec cat {} \;
