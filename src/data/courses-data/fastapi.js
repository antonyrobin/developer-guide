export const fastapiCourse = {
  id: 'fastapi',
  title: 'FastAPI',
  description: 'Modern, fast (high-performance) web framework for building APIs with Python.',
  icon: 'Zap',
  category: 'Backend Frameworks',
  sections: [
    {
      id: 'fastapi-intro',
      title: 'Introduction to FastAPI',
      image: '/images/courses/fastapi_course_1776185575778.png',
      content: `FastAPI is a modern web framework for building APIs with Python based on standard Python type hints. It is incredibly fast, easy to learn, fast to code, and ready for production.`
    },
    {
      id: 'fastapi-setup',
      title: 'Installation & Setup',
      content: `### Prerequisites
Python 3.8+ required.

### Install FastAPI and Uvicorn
You need an ASGI server to run FastAPI, such as Uvicorn.
\`\`\`bash
pip install fastapi
pip install "uvicorn[standard]"
\`\`\``
    },
    {
      id: 'fastapi-example',
      title: 'Example Code (main.py)',
      content: `### Defining an API
\`\`\`python
from typing import Union
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
\`\`\`
FastAPI automatically generates an OpenAPI swagger UI at \`/docs\`.`
    },
    {
      id: 'fastapi-run',
      title: 'Run & Configuration',
      content: `### Running the Application
Use Uvicorn to serve the app:
\`\`\`bash
uvicorn main:app --reload
\`\`\`
- \`main\`: the file \`main.py\`.
- \`app\`: the object created inside of \`main.py\` with \`app = FastAPI()\`.
- \`--reload\`: make the server restart after code changes.`
    },
    {
      id: 'fastapi-deployment',
      title: 'Deployment Procedures',
      content: `For production, it is recommended to run Uvicorn with Gunicorn to manage multiple worker processes.

### Running with Gunicorn
\`\`\`bash
pip install gunicorn uvicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
\`\`\`
Deploy behind a secure standard web server (Nginx or Traefik) and manage via Docker.`
    }
  ]
};
