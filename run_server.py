import uvicorn
import sys
import os

if __name__ == "__main__":
    # Ensure current directory is in sys.path
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=False, access_log=True)
