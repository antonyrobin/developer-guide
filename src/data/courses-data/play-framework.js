export const playFrameworkCourse = {
  id: 'play-framework',
  title: 'Play Framework (Java)',
  description: 'Scalable, high-performance web framework for Java and Scala.',
  icon: 'PlayCircle',
  category: 'Backend Frameworks',
  sections: [
    {
      id: 'play-intro',
      title: 'Introduction to Play Framework',
      image: '/images/courses/play_framework_1776186254270.png',
      content: `Play Framework makes it easy to build web applications with Java & Scala. Play is based on a lightweight, stateless, web-friendly architecture. Built on Akka, Play provides predictable and minimal resource consumption (CPU, memory, threads) for highly-scalable applications.`
    },
    {
      id: 'play-setup',
      title: 'Installation & Setup',
      content: `### 1. Prerequisites
Install JDK 8 or higher and sbt (Scala Build Tool).

### 2. Create Project
\`\`\`bash
sbt new playframework/play-java-seed.g8
\`\`\`

### 3. Run Application
\`\`\`bash
cd <project-name>
sbt run
\`\`\``
    },
    {
      id: 'play-example',
      title: 'Example Controller',
      content: `### app/controllers/HomeController.java
\`\`\`java
package controllers;

import play.mvc.*;

public class HomeController extends Controller {
    public Result index() {
        return ok("Hello, Play Framework!");
    }
}
\`\`\`

### conf/routes
\`\`\`text
GET     /     controllers.HomeController.index()
\`\`\``
    },
    {
      id: 'play-build',
      title: 'Build & Deployment',
      content: `### Create Distribution
\`\`\`bash
sbt dist
\`\`\`
This produces a ZIP file containing all necessary JARs and scripts to run the application in production.

### Running in Production
Extract the ZIP and run the script in \`bin/\` with the \`-Dplay.http.secret.key\` property.`
    }
  ]
};
