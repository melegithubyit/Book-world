import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJSDoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;
const serverUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${port}`;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Book World API',
      version: '1.0.0',
      description:
        'API for authentication, book search/recommendations, and user preferences. Authentication uses Bearer JWT access tokens.',
    },
    servers: [{ url: serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: {
              type: 'object',
              additionalProperties: true,
              nullable: true,
            },
          },
        },
        MessageResponse: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string' },
          },
        },
        UserPublic: {
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: { type: 'string', description: 'User id' },
            fullName: { type: 'string', nullable: true },
            email: { type: 'string', format: 'email' },
            avatar: { type: 'string', nullable: true },
            preferencesCompleted: { type: 'boolean', nullable: true },
          },
        },
        AuthResponse: {
          type: 'object',
          required: ['accessToken', 'user'],
          properties: {
            message: { type: 'string', nullable: true },
            accessToken: { type: 'string' },
            user: { $ref: '#/components/schemas/UserPublic' },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['fullName', 'email', 'password'],
          properties: {
            fullName: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
          },
        },
        GoogleLoginRequest: {
          type: 'object',
          required: ['idToken'],
          properties: {
            idToken: { type: 'string' },
          },
        },
        Preferences: {
          type: 'object',
          required: ['genres', 'authors'],
          properties: {
            genres: {
              type: 'array',
              items: { type: 'string' },
            },
            authors: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        PreferencesRequest: {
          type: 'object',
          required: ['genres', 'authors'],
          properties: {
            genres: {
              type: 'array',
              minItems: 1,
              items: { type: 'string' },
            },
            authors: {
              type: 'array',
              minItems: 1,
              items: { type: 'string' },
            },
          },
        },
        PreferencesUpdateResponse: {
          type: 'object',
          required: ['message', 'preferences'],
          properties: {
            message: { type: 'string' },
            preferences: { $ref: '#/components/schemas/Preferences' },
          },
        },
        BookImageLinks: {
          type: 'object',
          properties: {
            smallThumbnail: { type: 'string', nullable: true },
            thumbnail: { type: 'string', nullable: true },
            small: { type: 'string', nullable: true },
            medium: { type: 'string', nullable: true },
            large: { type: 'string', nullable: true },
            extraLarge: { type: 'string', nullable: true },
          },
          additionalProperties: true,
        },
        BookSnapshot: {
          type: 'object',
          required: ['title', 'authors', 'bookId'],
          properties: {
            title: { type: 'string' },
            subtitle: { type: 'string', nullable: true },
            authors: { type: 'array', items: { type: 'string' } },
            bookId: { type: 'string', description: 'Google Books volume id' },
            publishedDate: { type: 'string', nullable: true },
            description: { type: 'string', nullable: true },
            categories: { type: 'array', items: { type: 'string' }, nullable: true },
            averageRating: { type: 'number', nullable: true, minimum: 0, maximum: 5 },
            language: { type: 'string', nullable: true },
            imageLinks: { $ref: '#/components/schemas/BookImageLinks' },
          },
          additionalProperties: true,
        },
        BookSearchResponse: {
          type: 'object',
          required: ['totalItems', 'books'],
          properties: {
            totalItems: { type: 'integer' },
            books: {
              type: 'array',
              items: { $ref: '#/components/schemas/BookSnapshot' },
            },
          },
        },
        SaveBookRequest: {
          type: 'object',
          required: ['bookId'],
          properties: {
            bookId: { type: 'string' },
          },
        },
        FinishBookRequest: {
          type: 'object',
          required: ['bookId'],
          properties: {
            bookId: { type: 'string' },
            learningNotes: { type: 'string', nullable: true },
          },
        },
        UpdateLearningNotesRequest: {
          type: 'object',
          required: ['learningNotes'],
          properties: {
            learningNotes: { type: 'string' },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
