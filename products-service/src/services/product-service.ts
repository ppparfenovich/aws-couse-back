import { productsList } from "src/mocks/productsList";
import { Product } from "src/types/product";

class ProductService {
  private products: Array<Product> = [];
  constructor() {
    // this.products = products;
    this.products = productsList;
  }

  public getProductById(id: string): Product | undefined {
    return  this.products.find(item => item.id === id);
  }

  public getProducts() : Array<Product> {
    return this.products;
  }
}

export default new ProductService();