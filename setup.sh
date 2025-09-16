#!/bin/sh

if [ ! -d "$KAPOWARR_WEB" ]; then
    cd ./react || exit 1

    npm ci
    npm run build

    KAPOWARR_WEB="./react/dist/static"
fi

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
