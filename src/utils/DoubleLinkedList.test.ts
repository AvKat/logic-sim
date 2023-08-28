import { DoublyLinkedList } from "./DoubleLinkedList";
import { jest } from "@jest/globals";

describe("Linked list testing", () => {
  test("from", () => {
    const testList = new DoublyLinkedList([3, 4, 5, 7]);
    const spy = jest.spyOn(console, "log");

    testList.print();
    testList.printReverse();

    expect(spy).toHaveBeenNthCalledWith(1, 3);
    expect(spy).toHaveBeenNthCalledWith(2, 4);
    expect(spy).toHaveBeenNthCalledWith(3, 5);
    expect(spy).toHaveBeenNthCalledWith(4, 7);
    expect(spy).toHaveBeenNthCalledWith(5, 7);
    expect(spy).toHaveBeenNthCalledWith(6, 5);
    expect(spy).toHaveBeenNthCalledWith(7, 4);
    expect(spy).toHaveBeenNthCalledWith(8, 3);
  });

  test("popFirst", () => {
    const testList = new DoublyLinkedList([3, 4, 5, 7]);
    const f = testList.popFirst();
    const l = testList.popLast();
    const l2 = testList.popLast();

    expect(f).toBe(3);
    expect(l).toBe(7);
    expect(l2).toBe(5);
    expect(testList.toArr()).toEqual([4]);
    expect(testList.first!.data).toBe(4);
    expect(testList.last!.data).toBe(4);

    const a = testList.popFirst();
    expect(a).toBe(4);
    const b = testList.popLast();
    expect(b).toBeUndefined();
  });
});
