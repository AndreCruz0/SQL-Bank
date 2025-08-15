// ---- Mocks ----
jest.mock('../models/Categories', () => ({
  Category: {
    create: jest.fn(),
    findAll: jest.fn(),
    hasMany: jest.fn(),
  },
}));

jest.mock('../models/Products', () => ({
  Products: {
    belongsTo: jest.fn(),
  },
}));

jest.mock('../shared/error', () => ({
  handleError: jest.fn(),
}));

jest.mock('../shared/specificValidatons/forCategories', () => ({
  categoriesValidations: {
    ensureNameUnique: jest.fn(),
  },
}));

// ---- Imports depois dos mocks ----
import type { Request, Response } from 'express';
import { CategoriesController } from '../controllers/Categories.controller';
import { Category } from '../models/Categories';
import { categoriesValidations } from '../shared/specificValidatons/forCategories';

const mockCategory = Category as jest.Mocked<typeof Category>;
const mockCategoriesValidations = categoriesValidations as jest.Mocked<typeof categoriesValidations>;

describe('CategoriesController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validCategoryData = { name: 'Categoria Teste' };

    it('should register a new category successfully', async () => {
      mockReq.body = validCategoryData;

      const mockCreatedCategory = {
        id: 1,
        ...validCategoryData,
        get: jest.fn().mockReturnValue({ id: 1, ...validCategoryData }),
      };

      mockCategoriesValidations.ensureNameUnique.mockResolvedValue(true);
      mockCategory.create.mockResolvedValue(mockCreatedCategory as any);

      await CategoriesController.register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Categoria criada com sucesso',
        data: { id: 1, ...validCategoryData },
      });
    });
  });

  describe('list', () => {
    it('should list all categories successfully', async () => {
      const mockCategories = [
        { id: 1, name: 'Categoria 1' },
        { id: 2, name: 'Categoria 2' },
      ];

      mockCategory.findAll.mockResolvedValue(mockCategories as any);

      await CategoriesController.list(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockCategories);
    });
  });
});
