class Node<DataType> {
  next?: Node<DataType>;
  prev?: Node<DataType>;

  constructor(public data: DataType) {}
}

export class DoublyLinkedList<DataType> {
  first?: Node<DataType>;
  last?: Node<DataType>;
  length: number = 0;

  constructor(arr?: Array<DataType>) {
    if (arr && arr.length > 0) {
      this.first = new Node(arr[0]);
      let curr = this.first;
      for (let i = 1; i < arr.length; i++) {
        let next = new Node(arr[i]);
        curr.next = next;
        next.prev = curr;
        curr = curr.next;
      }
      this.last = curr;
      this.length = arr.length;
    }
  }

  toArr(): Array<DataType> {
    const res = [];
    let curr = this.first;
    while (curr) {
      res.push(curr.data);
      curr = curr.next;
    }
    return res;
  }

  append(val: DataType) {
    const newNode = new Node(val);
    this.length++;
    if (!this.last) {
      this.first = newNode;
      this.last = newNode;
      return;
    }
    this.last.next = newNode;
    newNode.prev = this.last;
    this.last = newNode;
  }

  popFirst(): DataType | undefined {
    if (!this.first) return;
    const firstVal = this.first.data;
    this.first = this.first.next;
    if (this.first) {
      this.first.prev = undefined;
    } else {
      this.last = undefined;
    }
    this.length--;
    return firstVal;
  }

  popLast(): DataType | undefined {
    if (!this.last) return;
    const res = this.last.data;
    this.last = this.last.prev;
    if (this.last) {
      this.last.next = undefined;
    } else {
      this.first = undefined;
    }
    this.length--;
    return res;
  }

  print() {
    let curr = this.first;
    while (curr) {
      console.log(curr.data);
      curr = curr.next;
    }
  }

  printReverse() {
    let curr = this.last;
    while (curr) {
      console.log(curr.data);
      curr = curr.prev;
    }
  }
}
