# Copyright (C) 2025 IUT Laval - Le Mans Université.
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
# MA 02110-1301  USA
# Perform compilation in a separate builder container
FROM node:23-alpine3.22
WORKDIR /usr/src/app

# Args declaration
ARG PUBLIC_PATH=/
ARG API_PATH=/api
ARG TEST_APP

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application configuration and codebase
COPY . .

# Default command: build app
CMD ["npm", "run", "build"]