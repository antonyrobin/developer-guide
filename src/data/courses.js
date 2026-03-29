import { sdlcCourse } from './courses-data/sdlc';
import { htmlCourse } from './courses-data/html';
import { cssCourse } from './courses-data/css';
import { jsCourse } from './courses-data/javascript';
import { oopsCourse } from './courses-data/oops';
import { javaCourse } from './courses-data/java';
import { csharpCourse } from './courses-data/csharp';
import { pythonCourse } from './courses-data/python';
import { reactCourse } from './courses-data/react';
import { remainingCourses } from './courses-data/remaining-a';
import { remainingB } from './courses-data/remaining-b';
import { remainingC } from './courses-data/remaining-c';

export const courses = [
  sdlcCourse,
  htmlCourse,
  cssCourse,
  jsCourse,
  oopsCourse,
  javaCourse,
  csharpCourse,
  pythonCourse,
  reactCourse,
  ...remainingCourses,
  ...remainingB,
  ...remainingC
];
