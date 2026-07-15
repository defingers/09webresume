#!/bin/bash
# Azure App Service (Linux) startup command for the FastAPI backend.
# Paste the single line below into: Azure Portal -> your Web App -> Configuration -> General settings -> Startup Command
#
#   gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind=0.0.0.0:${PORT:-8000} --timeout 600
#
gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind=0.0.0.0:${PORT:-8000} --timeout 600
