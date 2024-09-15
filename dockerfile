FROM node

# Use production node environment by default.
ENV NODE_ENV production


WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
COPY ["package.json", "package-lock.json", "./"]
RUN npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# # Expose the port that the application listens on.
# EXPOSE 80

# Run the application.
CMD npm start
