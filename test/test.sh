#!/bin/bash

for i in {1..300} ; do
  echo $i
  curl --socks5-hostname 127.0.0.1:$1 https://www.google.com/
done
