# --- Build frontend ---
FROM node:12.13-alpine as frontend
WORKDIR /usr/src/app

# Install app dependencies
COPY frontend/package.json .
RUN yarn install

# Build app source
COPY frontend/.eslintrc.js .
COPY frontend/src src
COPY frontend/public public
RUN echo REACT_APP_BASE_APP=/back >> .env.production
RUN yarn build


# --- Build backend ---
FROM node:12.13-alpine as backend
WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package.json .
RUN yarn install

# Build app source
COPY backend/src src
COPY backend/tsconfig.json .
COPY backend/.eslintignore .
COPY backend/.eslintrc.js .
COPY backend/.prettierrc.js .
RUN yarn build


# --- Docker server ---
FROM node:12.13-slim as prod

# See https://crbug.com/795759
RUN apt-get update && apt-get install -yq libgconf-2-4
# Install latest chrome dev package and fonts to support major
# charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version
# of Chromium that Puppeteer
# installs, work.
RUN apt-get update && apt-get install -y wget --no-install-recommends \
  && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && apt-get purge --auto-remove -y curl \
  && rm -rf /src/*.deb
# It's a good idea to use dumb-init to help prevent zombie chrome processes.
ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY backend/package.json .
RUN yarn install --production

# Copy app files
COPY --from=backend /usr/src/app/dist dist
COPY --from=frontend /usr/src/app/build dist/public

# Add user so we don't need --no-sandbox.
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
  && mkdir -p /home/pptruser/Downloads \
  && chown -R pptruser:pptruser /home/pptruser \
  && chown -R pptruser:pptruser ./node_modules \
  && chown -R pptruser:pptruser ./dist

# Run everything after as non-privileged user.
USER pptruser

ENV DOCKER 1

ENTRYPOINT ["dumb-init", "--"]
CMD [ "node", "./dist/app.js" ]