export const graphqlGrpcCourse = {
  id: 'graphql-grpc',
  title: 'GraphQL & gRPC',
  description: 'Modern API communication protocols: Query language for APIs vs. High-performance RPC.',
  icon: 'Shuffle',
  category: 'Backend Frameworks',
  sections: [
    {
      id: 'graphql-intro',
      title: 'GraphQL: Introduction',
      image: '/images/courses/graphql_grpc_1776186231844.png',
      content: `GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. It allows clients to request exactly what they need and nothing more, making it efficient for mobile and web applications.`
    },
    {
      id: 'graphql-example',
      title: 'GraphQL Example (Node.js/Apollo)',
      content: `### Schema Definition
\`\`\`javascript
const typeDefs = \`
  type Book {
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
\`;
\`\`\`

### Querying
\`\`\`graphql
query GetBooks {
  books {
    title
  }
}
\`\`\``
    },
    {
      id: 'grpc-intro',
      title: 'gRPC: Introduction',
      content: `gRPC is a high-performance, open-source universal RPC framework. It uses Protocol Buffers as its Interface Definition Language (IDL) and is designed for low latency and high throughput communication between microservices.`
    },
    {
      id: 'grpc-example',
      title: 'gRPC Example (.proto)',
      content: `### Proto Definition
\`\`\`protobuf
syntax = "proto3";

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
\`\`\``
    },
    {
      id: 'comparison',
      title: 'Comparison',
      content: `| Feature | GraphQL | gRPC |
| :--- | :--- | :--- |
| **Protocol** | HTTP (usually) | HTTP/2 |
| **Payload** | JSON | Protobuf (Binary) |
| **Client Control** | High (choose fields) | Low (pre-defined methods) |
| **Use Case** | Web/Mobile Clients | Microservice Communication |`
    }
  ]
};
