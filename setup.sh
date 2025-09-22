#!/bin/sh

if [ ! -d "$KAPOWARR_WEB" ]; then
    cd ./react || exit 1

    npm ci
    npm run build

    KAPOWARR_WEB="./frontend/dist/static"

    cd .. || exit 1
fi

for dir in "$KAPOWARR_WEB"/*; do
    if [ "$dir" != "$KAPOWARR_WEB" ]; then
        target="./src/frontend/static/$(basename "$dir")"

        if [ -d "$target" ]; then
            cp -r "$dir"/* "$target"
        else
            cp -r "$dir" "$target"
        fi
    fi
done
