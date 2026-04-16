import { sdlcCourse } from './courses-data/sdlc';
import { htmlCourse } from './courses-data/html';
import { cssCourse } from './courses-data/css';
import { jsCourse } from './courses-data/javascript';
import { oopsCourse } from './courses-data/oops';
import { javaCourse } from './courses-data/java';
import { csharpCourse } from './courses-data/csharp';
import { pythonCourse } from './courses-data/python';
import { reactCourse } from './courses-data/react';
import { phpCourse } from './courses-data/php';
import { sqlCourse } from './courses-data/sql';
import { nosqlCourse } from './courses-data/nosql';
import { dockerCourse } from './courses-data/docker';
import { springBootCourse } from './courses-data/springboot';
import { blazorCourse } from './courses-data/blazor';
import { dotnetApiCourse } from './courses-data/dotnet-api';
import { djangoCourse } from './courses-data/django';
import { awsCourse } from './courses-data/aws';
import { gcpCourse } from './courses-data/gcp';
import { azureDevOpsCourse } from './courses-data/azure-devops';
import { dataStructureCourse } from './courses-data/data-structures';
import { systemArchitectureCourse } from './courses-data/system-architecture';
import { designPatternsCourse } from './courses-data/design-patterns';
import { githubCourse } from './courses-data/github';
import { githubActionsCourse } from './courses-data/github-actions';
import { postgresqlCourse } from './courses-data/postgresql';
import { nextjsCourse } from './courses-data/nextjs';
import { flutterCourse } from './courses-data/flutter';
import { kubernetesCourse } from './courses-data/kubernetes';
import { angularCourse } from './courses-data/angular';
import { tailwindCourse } from './courses-data/tailwind-css';
import { terraformCourse } from './courses-data/terraform';
import { k6Course } from './courses-data/k6';
import { cloudflareCourse } from './courses-data/cloudflare';
import { playwrightCourse } from './courses-data/playwright';
import { rabbitmqCourse } from './courses-data/rabbitmq';
import { redisCourse } from './courses-data/redis';
import { seleniumCourse } from './courses-data/selenium';
import { jmeterCourse } from './courses-data/jmeter';
import { mochaCourse } from './courses-data/mocha';
import { ionicCourse } from './courses-data/ionic';
import { flaskCourse } from './courses-data/flask';
import { fastapiCourse } from './courses-data/fastapi';
import { javaReportsCourse } from './courses-data/java-reports';
import { ssrsCourse } from './courses-data/ssrs';
import { etlCourse } from './courses-data/etl';
import { mongodbCourse } from './courses-data/mongodb';
import { elasticsearchCourse } from './courses-data/elasticsearch';
import { graphqlGrpcCourse } from './courses-data/graphql-grpc';
import { owaspCourse } from './courses-data/owasp';
import { playFrameworkCourse } from './courses-data/play-framework';
import { dotnetFrameworkCourse } from './courses-data/dotnet-framework';
import { kafkaCourse } from './courses-data/kafka';

export const courseGroups = [
  { label: 'Fundamentals', courses: [sdlcCourse, oopsCourse, dataStructureCourse, designPatternsCourse, systemArchitectureCourse] },
  { label: 'Web Essentials', courses: [htmlCourse, cssCourse, tailwindCourse, jsCourse] },
  { label: 'Frontend Frameworks', courses: [reactCourse, angularCourse, nextjsCourse, ionicCourse, flutterCourse] },
  { label: 'Backend Languages', courses: [javaCourse, csharpCourse, pythonCourse, phpCourse, javaReportsCourse] },
  { label: 'Backend Frameworks', courses: [springBootCourse, dotnetApiCourse, blazorCourse, djangoCourse, flaskCourse, fastapiCourse, playFrameworkCourse, dotnetFrameworkCourse, graphqlGrpcCourse] },
  { label: 'Databases', courses: [sqlCourse, postgresqlCourse, nosqlCourse, redisCourse, mongodbCourse, elasticsearchCourse, ssrsCourse, etlCourse] },
  { label: 'Testing', courses: [playwrightCourse, seleniumCourse, k6Course, jmeterCourse, mochaCourse] },
  {
    label: 'Others',
    children: [
      { label: 'DevOps & Cloud', courses: [dockerCourse, kubernetesCourse, terraformCourse, githubCourse, githubActionsCourse, azureDevOpsCourse, awsCourse, gcpCourse] },
      { label: 'Messaging & Caching', courses: [rabbitmqCourse, kafkaCourse] },
      { label: 'Security & Performance', courses: [cloudflareCourse, owaspCourse] },
    ],
  },
];

export const courses = courseGroups.flatMap(g =>
  g.courses
    ? g.courses
    : g.children
      ? g.children.flatMap(c => c.courses)
      : []
);
