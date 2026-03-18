#!/bin/sh
set -e

CERT_DIR="/etc/certificats"
CERT_FILE="$CERT_DIR/certif.pem"
KEY_FILE="$CERT_DIR/certif-key.pem"
DOMAIN="${DOMAIN:-}"
LE_CERT="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
LE_KEY="/etc/letsencrypt/live/${DOMAIN}/privkey.pem"

if [ -n "$DOMAIN" ] && [ -f "$LE_CERT" ]; then
    echo "Using Let's Encrypt certificate for ${DOMAIN}"
    ln -sf "$LE_CERT" "$CERT_FILE"
    ln -sf "$LE_KEY"  "$KEY_FILE"
elif [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "Using mounted certificates"
else
    echo "Generating self-signed fallback certificate..."
    CN="${DOMAIN:-localhost}"
    openssl req -x509 -nodes -days 365 \
        -newkey rsa:2048 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -subj "/CN=${CN}" \
        -addext "subjectAltName=DNS:${CN},IP:127.0.0.1"
    chmod 600 "$KEY_FILE"
fi

# Reload nginx every hour to pick up renewed certificates
(while true; do sleep 1h; nginx -s reload 2>/dev/null || true; done) &

echo "Starting nginx..."
exec nginx -g "daemon off;"
