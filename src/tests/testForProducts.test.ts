// ---- Mocks ----
jest.mock('../models/Products', () => ({
  Products: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock('../models/Categories', () => ({
  Category: {
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
  },
}));

jest.mock('../services/productIntegration.service', () => ({
  refreshProductData: jest.fn(),
}));

jest.mock('../shared/error', () => ({
  handleError: jest.fn(),
}));

jest.mock('../shared/specificValidatons/forProducts', () => ({
  productValidations: {
    ensureCategoryExists: jest.fn(),
    ensureProductNameUnique: jest.fn(),
    ensureIdProvided: jest.fn(),
    ensureProductExists: jest.fn(),
  },
}));

import type { Request, Response } from 'express';
import { ProductsController } from '../controllers/Products.controller';
import { Products } from '../models/Products';
import { productValidations } from '../shared/specificValidatons/forProducts';

const mockProducts = Products as jest.Mocked<typeof Products>;
const mockProductValidations = productValidations as jest.Mocked<typeof productValidations>;

describe('ProductsController', () => {
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
    const validProductData = {
      name: 'Produto Teste',
      category_id: 1,
      price: 10.99,
      qty: 100,
    };

    it('should register a new product successfully', async () => {
      mockReq.body = validProductData;

      const mockCategory = { id: 1, name: 'Categoria Teste' };
      const mockCreatedProduct = {
        id: 1,
        ...validProductData,
        get: jest.fn().mockReturnValue({ id: 1, ...validProductData }),
      };

      mockProductValidations.ensureCategoryExists.mockResolvedValue(mockCategory as any);
      mockProductValidations.ensureProductNameUnique.mockResolvedValue(true);
      mockProducts.create.mockResolvedValue(mockCreatedProduct as any);

      await ProductsController.register(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Produto criado com sucesso!',
        data: { id: 1, ...validProductData },
      });
    });

    it('should return early if product name is not unique', async () => {
      mockReq.body = validProductData;
      const mockCategory = { id: 1, name: 'Categoria Teste' };

      mockProductValidations.ensureCategoryExists.mockResolvedValue(mockCategory as any);
      mockProductValidations.ensureProductNameUnique.mockResolvedValue(false);

      await ProductsController.register(mockReq as Request, mockRes as Response);

      expect(Products.create).not.toHaveBeenCalled();
    });
  });

  describe('list', () => {
    it('should list all products successfully', async () => {
      const mockProductsList = [
        { id: 1, name: 'Produto 1', price: 10.99 },
        { id: 2, name: 'Produto 2', price: 20.99 },
      ];
      mockProducts.findAll.mockResolvedValue(mockProductsList as any);

      await ProductsController.list(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProductsList);
    });
  });

  describe('getByProductId', () => {
    it('should get product by ID successfully', async () => {
      mockReq.params = { id: '1' };
      const mockProduct = { id: 1, name: 'Produto Teste' };

      mockProductValidations.ensureIdProvided.mockReturnValue(true);
      mockProductValidations.ensureProductExists.mockResolvedValue(mockProduct as any);

      await ProductsController.getByProductId(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });
  });
});
