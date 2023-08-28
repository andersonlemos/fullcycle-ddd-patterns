import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from '../../../../domain/customer/entity/customer';
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();

    await orderRepository.create(order);

    const updatedItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        3
      );

    const orderUpdated = new Order("123","123",[updatedItem])

    await orderRepository.update(orderUpdated)

    const orderModel = await OrderModel.findOne({
        where: { id: order.id },
        include: ["items"],
      });

      expect(orderModel.toJSON()).toStrictEqual({
        id: "123",
        customer_id: "123",
        total: orderUpdated.total(),
        items: [
          {
            id: updatedItem.id,
            name: updatedItem.name,
            price: updatedItem.price,
            quantity: updatedItem.quantity,
            order_id: "123",
            product_id: "123",
          },
        ],
      });
  })
  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
        "1",
        product.name,
        product.price,
        product.id,
        2
    );

    const order = new Order("123", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderResult);
    });

    it("should throw an error when order is not found", async() =>{
        const orderRepository = new OrderRepository();

        expect(async()=>{
            await orderRepository.find("98765")
        }).rejects.toThrow("Order not found")
    });

    it("should find all products", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 123");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();

        const product1 = new Product("p1", "Product 1", 10);
        await productRepository.create(product1);

        const orderItem1 = new OrderItem(
            "1",
            product1.name,
            product1.price,
            product1.id,
            2
        );

        const order1 = new Order("o1", "123", [orderItem1]);

        const product2 = new Product("p2", "Product 2", 20);
        await productRepository.create(product2);

        const orderItem2 = new OrderItem(
            "2",
            product1.name,
            product1.price,
            product1.id,
            5
        );

        const orderItem3 = new OrderItem(
            "3",
            product2.name,
            product2.price,
            product2.id,
            10
        );

        const order2 = new Order("o2", "123", [orderItem2,orderItem3]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order1);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toContainEqual(order1);
        expect(orders).toContainEqual(order2);

    })
});
