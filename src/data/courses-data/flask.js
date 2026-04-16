export const flaskCourse = {
  id: 'flask',
  title: 'Flask Framework',
  description: 'Lightweight WSGI web application framework for Python.',
  icon: 'Server',
  category: 'Backend Frameworks',
  sections: [
    {
      id: 'flask-intro',
      title: 'Introduction to Flask',
      content: `Flask is a lightweight WSGI web application framework. It is designed to make getting started quick and easy, with the ability to scale up to complex applications. It is classified as a microframework because it does not require particular tools or libraries.`,
      image: '/images/courses/web_api_dashboard_1776183747581.png'
    },
    {
      id: 'flask-setup',
      title: 'Installation & Setup',
      content: `### Prerequisites
Ensure Python and pip are installed.

### Setup Virtual Environment
\`\`\`bash
python -m venv venv
source venv/bin/activate  # On Windows use \`venv\\Scripts\\activate\`
\`\`\`

### Install Flask
\`\`\`bash
pip install Flask
\`\`\`
`
    },
    {
      id: 'flask-example',
      title: 'Example Code',
      content: `### Basic Application (app.py)
\`\`\`python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`
`
    },
    {
      id: 'flask-run-build',
      title: 'Run, Build & Configuration',
      content: `### Running locally
Set the entry point and environment before running:
\`\`\`bash
export FLASK_APP=app  # On Windows: set FLASK_APP=app
export FLASK_ENV=development
flask run
\`\`\`

Alternatively, to run it via Python directly:
\`\`\`bash
python app.py
\`\`\`
`
    },
    {
      id: 'flask-deployment',
      title: 'Deployment Procedures',
      content: `Flask's built-in server is not suitable for production.
You need to use a production WSGI server like Gunicorn or uWSGI behind a reverse proxy like Nginx.

### Gunicorn Deployment
1. Install Gunicorn: \`pip install gunicorn\`
2. Run your app: \`gunicorn -w 4 -b 127.0.0.1:4000 app:app\`
3. Setup Nginx to reverse proxy to port 4000.`
    }
  ]
};
