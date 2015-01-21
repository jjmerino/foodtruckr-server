#!/bin/bash
#if arguments is not equal to 1
if [ $# -ne 1 ]; then
  echo "Need first argument to be prod or dev"
  exit 1
fi

source ./$1.env
source ./$1_secret.env

# if last command produced an error
if [ $? != 0 ]; then
  echo "Missing environment files"
  exit $?
fi

echo "$1 environment loaded correctly"
