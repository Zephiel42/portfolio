#!/bin/sh
set -e

DOMAIN="${DOMAIN:?Set DOMAIN in .env}"
EMAIL="${CERTBOT_EMAIL:?Set CERTBOT_EMAIL in .env}"
WEBROOT="/var/www/certbot"
CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

# First run: obtain certificate if not already present
if [ ! -f "$CERT_PATH" ]; then
    echo "[certbot] Requesting certificate for ${DOMAIN}..."
    certbot certonly \
        --webroot \
        -w "$WEBROOT" \
        -d "$DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --non-interactive \
        --no-eff-email
    echo "[certbot] Certificate obtained."
else
    echo "[certbot] Certificate already present, skipping initial request."
fi

# Renewal loop certbot only renews when < 30 days remain
echo "[certbot] Entering renewal loop (checks every 12h)..."
while true; do
    sleep 12h
    echo "[certbot] Running renewal check..."
    certbot renew --webroot -w "$WEBROOT" --non-interactive --quiet
done
