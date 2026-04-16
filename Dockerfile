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
# Chemin d'accès publique à l'application d'après la racine du site
ARG PUBLIC_PATH=/
# Chemin d'accès à l'API. Peut être relatif ou absolu
ARG API_PATH=/api
# Mode test actif si la variable est définie avec n'importe quelle valeur
ARG TEST_APP
# url du tracker Matomo. Doit être absolue. Laisser vide pour désactiver le tracking
ARG MATOMO_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application configuration and codebase
COPY . .

# Default command: build app
CMD ["npm", "run", "build"]