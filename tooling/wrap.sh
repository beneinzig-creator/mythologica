#!/bin/bash
(echo '<!doctype html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head>'; cat ${1:-n1.html}) > m_test.html
