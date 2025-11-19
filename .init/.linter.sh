#!/bin/bash
cd /home/kavia/workspace/code-generation/client-side-notes-manager-206287-206333/frontend_notes_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

