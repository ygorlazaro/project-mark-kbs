import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Dynamic Knowledge Base API",
            version: "1.0.0",
            description: "RESTful API for managing interconnected topics and resources with version control",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/domain/**/*Routes.ts", "./src/domain/**/*Model.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
