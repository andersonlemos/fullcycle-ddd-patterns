import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log2.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from './event-dispatcher';
import EventHandlerInterface from './event-handler.interface';

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should register log 1 event handler for customer created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog1Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

  })

  it("should register log 2 event handler for customer created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)

    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

  })

  it("should register log 1 and log 2 event handlers for customer created", () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();

    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(enviaConsoleLog1Handler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(enviaConsoleLog2Handler);

    eventDispatcher.unregister("CustomerCreatedEvent", enviaConsoleLog1Handler);
    eventDispatcher.unregister("CustomerCreatedEvent", enviaConsoleLog1Handler);

  });

  it("should register event handler for  customer address changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    eventDispatcher.register("CustomerAddressChanged", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["CustomerAddressChanged"][0]).toMatchObject(eventHandler)

    eventDispatcher.unregister("CustomerAddressChanged", eventHandler);

  });

  it("should notify log 1 event handler for customer created event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLog1Handler();
    const spyEventHandler = jest.spyOn(eventHandler,"handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler)

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

    const customerCreatedEvent = new CustomerCreatedEvent({
        id: "123",
        name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify log 2 event handler for customer created event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler =  new EnviaConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler,"handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    const customerCreatedEvent = new CustomerCreatedEvent({
        id: "123",
        name: "Customer 1",
    });

    eventDispatcher.notify(customerCreatedEvent);
    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify log 1 and log 2 event handlers for customer created event", () => {
    const eventDispatcher = new EventDispatcher();
    const enviaConsoleLog1Handler = new EnviaConsoleLog1Handler();
    const enviaConsoleLog2Handler = new EnviaConsoleLog2Handler();
    const spyEnviaConsoleLog1Handler = jest.spyOn(
      enviaConsoleLog1Handler,
      "handle"
    );
    const spyEnviaConsoleLog2Handler = jest.spyOn(
      enviaConsoleLog2Handler,
      "handle"
    );

    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog1Handler);
    eventDispatcher.register("CustomerCreatedEvent", enviaConsoleLog2Handler);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(enviaConsoleLog1Handler);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(enviaConsoleLog2Handler);

    const customer1CreatedEvent = new CustomerCreatedEvent({
      id: "123",
      name: "Customer 1",
    });
    const customer2CreatedEvent = new CustomerCreatedEvent({
      id: "456",
      name: "Customer 2",
    });

    eventDispatcher.notify(customer1CreatedEvent);
    eventDispatcher.notify(customer2CreatedEvent);

    expect(spyEnviaConsoleLog1Handler).toHaveBeenCalled();
    expect(spyEnviaConsoleLog2Handler).toHaveBeenCalled();
  });

  it("should notify event handler for customer address changed event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customerAddressChangedEvent = new CustomerAddressChangedEvent({
      id: "123",
      name: "Customer 1",
      address: {
        street: "Rua Quadrada",
        number: 36,
        city: "Qualquer lugar",
      },
    });

    eventDispatcher.notify(customerAddressChangedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
