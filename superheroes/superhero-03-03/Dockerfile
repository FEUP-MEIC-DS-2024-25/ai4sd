FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

#Install Firebase Admin
RUN npm install --save -g firebase-admin

RUN npm install

ENV TYPE="service_account"
ENV PROJECT_ID="hero-alliance-feup-ds-24-25"
ENV PRIVATE_KEY_ID="ac6e7d11ef1c46f4eefa34b976590d0c5f765eaf"
ENV PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDBgkcX26TMd28R\nPLMDvlQY1d3V3tPM4Bt/FsTqwZhkyGrVDflVrl9AN70nd7liDYuJMctVtvagN8QM\nKt5G8KyhN6NHrJBgqhWhFDXs+4xKEcbKErZpJqEc/o2PbLMg97ulyHwmCelK0/V6\nogE6vSAlpD7+MQGHmvU33RwYt30j4lYA7g+gUQejRk1rcbpSaijV0t32e8c2wxDu\nJz+Up6hBLqBEW6aLgBx5ZeWPjvkw+6SGraW8DJObGJzXFMAYa2RgtajJlCLnnwBT\nhrZDTuiP16IqZLjOwrqetIShskUHuEduKKr+EKxehVRatXxctnaG9DJ0qTK7Chgn\nr6nDQ2LjAgMBAAECggEAHLxgGqgN4XqCSQYsCUwcHfIIdtLtE0QGdp7ReuZpNIeE\nly3zjv3i0YeqycUgMkeTpznN7w/JW60xqk2QDkB9n5VCZImOM89I1fpJMG+B0PAH\nMV6KWF7EVyi//y1OWSt2DLOTKBeZss3QwDd1mkeX51nBgarnsL+vVu6Oq7xNKOTt\n2L65PvMAUFzeK6+adiM6QKt8lRo6Hino1dy0N+jl5Q1T4AWYi3FbXMdux8UpcDGs\nEbNHJiJdiligQAV5LETMidGeuGGgYDF44pFo4OWpVgi2xz23ZzGeEPXStc8Z9I3r\nZk6XQL4BLQCiZOWP9ShVjGC5u686sADmCm4MFq5yeQKBgQDrdaWw43CfsbnO4whW\njurIyLCcIBTvzsiXKOoL15O91HTLiQcuePH42P4oU3ikapVspTZSTOyAd5aYdP9K\n3cH+67ONxhq/a9lDO6cXJeClZi3EkmDOYFdLtUkfMTZk2k9L6aSbcZpHGPbk2IDJ\nh9JHCrge4VRTx+WQDWG1uwgyCwKBgQDSY8adTq0R+aVUSVAlidHmVq3qFnDSlQhw\nYsD/sS0jXLa4XuRqFhLoWIQW60XB0d6aT6xFqV4VRKftnNncI6RABcr83ToftLMM\nFszpYvB6DP6jCWfMiwDcxmTBFvLAhSpPDOsQM7Drwf2UTI8VsP28I4Y0PmQNTi0O\nurvFDzWxiQKBgQCw7CmgDIYnuIeBaR5uy9ynGgV6irCwsJQQ4PFcDJQ641UPSttW\nlBJdhc8TxgS0plG43TtABAUBUtqZm+/n9VE7lyfHs7+NbiBGYKBgyFlQbsKdHdAX\nwlRV0tYq1fOlPFSxGdJR6r6eBagetH+w7pmWP/uxWGbgvSdFYoi04OB7mQKBgQCP\nYDucPF+pnk3TMNsTmeaXaH7AxmZAvBuyKzqHhcDTFn3XC6Pxv/VGrfvmepNhUJq4\n4o7uMkvRhqZCQeAeK5PlpYz94e2YadaS6H7glfJ32p81kFVSiXAfBHzpMbBhDt8U\nXCNdOTzajas4AyyHhcSFEFiHBfW9M4d1QEByPLlEsQKBgQCEiFvPAAIt67X0QAVJ\nikT28yeKIrN9lRKzEQVFrsHSu+xLG8zQF7ZkjWKfqpwdK1JwSW9o8Vs8GBgk56Oc\nSKz7CbZpjK4LKGf4ZihT6TFcao7x7mhSFiIrfwHXdq7/00+8jv/dkk+gu7Bc/oDY\nnfiTqGHIEuM2KATMtnZS6xLkpA==\n-----END PRIVATE KEY-----\n"
ENV CLIENT_EMAIL="superhero-03-03@hero-alliance-feup-ds-24-25.iam.gserviceaccount.com"
ENV CLIENT_ID="114383014493295998653"
ENV AUTH_URI="https://accounts.google.com/o/oauth2/auth"
ENV TOKEN_URI="https://oauth2.googleapis.com/token"
ENV AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
ENV CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/superhero-03-03%40hero-alliance-feup-ds-24-25.iam.gserviceaccount.com"
ENV UNIVERSE_DOMAIN="googleapis.com"
ENV GEMINI_API_KEY="AIzaSyCP9D4htCXD_dn3ZsUsh7hyfTioDN9ogmk"

COPY . .

# Inject secret and create .env file during build
RUN --mount=type=secret,id=secret \
    echo "GEMINI_API_KEY=$(cat /run/secrets/secret)" > .env && \
    echo "Secret GEMINI_API_KEY injected into .env file."

EXPOSE 8080

CMD ["npm", "start"] 

