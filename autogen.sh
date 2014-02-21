#!/bin/bash

cd $(dirname $(realpath ${0}))
autoreconf -is
intltoolize
./configure
