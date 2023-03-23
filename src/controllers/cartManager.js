import fs from "fs";

export default class CartManager {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async createCart() {
    try {
      if (!this.#exists(this.archivo)) {
        console.log("Se crea archivo");
        let cartsArray = [];
        const cart = {
          id: this.#idGenerator(),
          products: [],
        };
        cartsArray.push(cart);
        console.log("Agregando carrito...");
        await this.#writeFile(this.archivo, cartsArray);
        console.log(`Se agrego el carrito con el id: ${cart.id}`);
        return cart.id;
      } else {
        if (this.#readFile(this.archivo)) {
          console.log("Leyendo archivo...");
          const cartsArray = await this.#readFile(this.archivo);
          if (cartsArray.length === 0 || !cartsArray) {
            const cart = {
              id: this.#idGenerator(),
              products: [],
            };
            cartsArray.push(cart);
          } else {
            const cart = {
              id: this.#idGenerator(cartsArray),
              products: [],
            };
            cartsArray.push(cart);
          }
          console.log("Agregando carrito...");
          this.#writeFile(this.archivo, cartsArray);
          console.log(`Se agrego el carrito con el id: ${cart.id}`);
          return cart.id;
        }
      }
    } catch (error) {
      console.log(`Error agregando producto: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (this.#exists(this.archivo)) {
        const cartsArray = await this.#readFile(this.archivo);
        const cartId = cartsArray.find(item => item.id === id);
        if (!cartId) {
          throw new Error("No se encontro el carrito con el id solicitado");
        } else {
          console.log(`Carrito con el id ${id} encontrado:\n`, cartId);
          return cartId;
        }
      }
    } catch (error) {
      console.log(`Error al buscar carrito con el id ${id}: ${error.message}`);
    }
  }

  async addToCart(cid, pid) {
    try {
      if (this.#exists(this.archivo)) {
        const cartsArray = await this.#readFile(this.archivo);
        const cart = cartsArray.find(item => item.id === cid);
        if (cart) {
          const addProduct = cart.products.find(item => item.product === pid);
          if (addProduct) {
            addProduct.quantity++;
          } else {
            cart.products.push({ product: pid, quantity: 1 });
          }
          await this.#writeFile(this.archivo, cartsArray);
          return cart;
        } else {
          throw new Error(`No se encontro el carrito con el id: ${cid}`);
        }
      }
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  }

  #idGenerator(productsArray = []) {
    const id =
      productsArray.length === 0
        ? 1
        : productsArray[productsArray.length - 1].id + 1;
    return id;
  }

  #exists(archivo) {
    try {
      if (!fs.existsSync(archivo)) {
        throw new Error("El archivo no existe");
      } else {
        return true;
      }
    } catch (error) {
      console.log(`Error buscando el archivo: ${error.message}`);
    }
  }

  async #readFile(archivo) {
    try {
      const data = await fs.readFileSync(archivo);
      return JSON.parse(data);
    } catch (error) {
      console.log(`Error leyendo el archivo: ${error.message}`);
    }
  }

  async #writeFile(archivo, data) {
    try {
      await fs.writeFileSync(archivo, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(`Error escribiendo el archivo: ${error.message}`);
    }
  }
}
