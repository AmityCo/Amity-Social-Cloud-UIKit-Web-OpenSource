#!/bin/bash

echo "This script will publish a new version of ui-kit to npm."

read -p "Would you like to continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

read -p "How would you like to bump the version? (major/minor/patch): " versionBump

npm version $versionBump


