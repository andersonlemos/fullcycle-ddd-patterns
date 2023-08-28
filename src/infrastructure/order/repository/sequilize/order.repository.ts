import Order from "../../../../domain/checkout/entity/order";
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItem from "../../../../domain/checkout/entity/order_item";


export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
            await OrderModel.create(
                {
                  id: entity.id,
                  customer_id: entity.customerId,
                  total: entity.total(),
                  items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                  })),
                },
                {
                  include: [{ model: OrderItemModel }],
                }
              );
    }
    async update(entity: Order): Promise<void> {
        const sequelize = OrderItemModel.sequelize;
        await sequelize.transaction(async(trans) => {
            await OrderItemModel.destroy({
                where:{
                    order_id:entity.id
                },
                transaction: trans
            });

            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id:item.productId,
                quantity: item.quantity,
                order_id: entity.id
            }));

            await OrderItemModel.bulkCreate(items, { transaction: trans });
            await OrderModel.update(
                { total: entity.total() },
                { where: { id: entity.id }, transaction: trans }
              );
        })
    }
    async find(id: string): Promise<Order> {
       let orderModel;
       try {
            orderModel = await OrderModel.findOne({
                where: { id: id },
                include:[{model:OrderItemModel}],
                rejectOnEmpty: true,
            })
       } catch (error) {
        throw new Error("Order not found")
       }

       const orderItems: Array<OrderItem> = [];

       orderModel.items.map(item => {
            orderItems.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity))
        })

        const order = new Order(id, orderModel.customer_id, orderItems);
       return order;
    }
    async findAll(): Promise<Order[]> {
        const ordersModels = await OrderModel.findAll({
            include: [{ model: OrderItemModel }],
        });

        const orders = ordersModels.map((ordersModels) => {
            let orderItems: Array<OrderItem> = [];

            ordersModels.items.map(item => {
                orderItems.push(new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity));
            });

            let order = new Order(ordersModels.id, ordersModels.customer_id, orderItems);
            return order;
        } )
        return orders
    }

}
