import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import markup from 'react-syntax-highlighter/dist/esm/languages/prism/markup';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import scss from 'react-syntax-highlighter/dist/esm/languages/prism/scss';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java';
import kotlin from 'react-syntax-highlighter/dist/esm/languages/prism/kotlin';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import php from 'react-syntax-highlighter/dist/esm/languages/prism/php';
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import powershell from 'react-syntax-highlighter/dist/esm/languages/prism/powershell';
import yaml from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import dart from 'react-syntax-highlighter/dist/esm/languages/prism/dart';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import docker from 'react-syntax-highlighter/dist/esm/languages/prism/docker';
import graphql from 'react-syntax-highlighter/dist/esm/languages/prism/graphql';
import protobuf from 'react-syntax-highlighter/dist/esm/languages/prism/protobuf';
import nginx from 'react-syntax-highlighter/dist/esm/languages/prism/nginx';
import lua from 'react-syntax-highlighter/dist/esm/languages/prism/lua';
import http from 'react-syntax-highlighter/dist/esm/languages/prism/http';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';

/*
 * PrismLight with an explicit language set keeps the highlighter out of the
 * multi-megabyte "all languages" bundle.
 */
const languages = {
  javascript, js: javascript, jsx, typescript, ts: typescript, tsx,
  markup, html: markup, xml: markup, svg: markup,
  css, scss, python, py: python, java, kotlin, csharp, cs: csharp,
  php, sql, bash, sh: bash, shell: bash, powershell, ps: powershell,
  yaml, yml: yaml, json, dart, hcl, docker, dockerfile: docker,
  graphql, protobuf, nginx, lua, http, go,
};

Object.entries(languages).forEach(([name, lang]) => SyntaxHighlighter.registerLanguage(name, lang));

export const isKnownLanguage = (lang) => Boolean(lang && languages[lang]);

export default SyntaxHighlighter;
