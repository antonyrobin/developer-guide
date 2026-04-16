const fs = require('fs');

const mappings = {
  'flask.js': 'web_api_dashboard_1776183747581.png',
  'fastapi.js': 'fastapi_course_1776185575778.png',
  'java-reports.js': 'javareports_1776186111518.png',
  'ssrs.js': 'ssrs_1776186131197.png',
  'etl.js': 'etl_1776186157797.png',
  'mongodb.js': 'database_visualization_1776183767809.png',
  'elasticsearch.js': 'elasticsearch_1776186212968.png',
  'graphql-grpc.js': 'graphql_grpc_1776186231844.png',
  'owasp.js': 'security_shield_owasp_1776183785263.png',
  'play-framework.js': 'play_framework_1776186254270.png',
  'dotnet-framework.js': 'dotnet_framework_1776186270622.png',
  'kafka.js': 'data_pipeline_kafka_1776183804632.png'
};

for (const [file, img] of Object.entries(mappings)) {
  const filePath = './src/data/courses-data/' + file;
  let code = fs.readFileSync(filePath, 'utf8');

  code = code.replace(/image:\s*'\/artifacts\/[^']+\.png'/g, "image: '/images/courses/" + img + "'");
  
  if (!code.includes('image:')) {
     const sectionTarget = 'content: `';
     const index = code.indexOf(sectionTarget);
     if (index > -1) {
        code = code.replace(sectionTarget, "image: '/images/courses/" + img + "',\n      content: `");
     }
  }

  fs.writeFileSync(filePath, code);
}
console.log('Fixed course files perfectly!');
