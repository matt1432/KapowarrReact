#!/bin/sh

# TODO: build if $KAPOWARR_WEB is not set

for dir in "$KAPOWARR_WEB"/*; do
    if [ "$dir" != "$KAPOWARR_WEB" ]; then
        target="./python/frontend/static/$(basename "$dir")"

        if [ -d "$target" ]; then
            cp -r "$dir"/* "$target"
        else
            cp -r "$dir" "$target"
        fi
    fi
done
