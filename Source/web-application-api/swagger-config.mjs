import "dotenv/config";

export default {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description:
        "This is the API documentation for the StudjiSocjali.mt web application endpoints",
    },
    servers: [
      {
        url: `${process.env.SWAGGER_SERVER}`,
        description: `${process.env.SWAGGER_SERVER_DESCRIPTION}`,
      },
      {
        url: 'https://app-studjisocjalimt-api-eshkdkeednb5bchn.canadacentral-01.azurewebsites.net',
        description: "Production",
      },
    ],
  },
  apis: ["./routes/*.mjs"],
};
