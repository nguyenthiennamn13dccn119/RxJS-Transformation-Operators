// RxJS Transformation Operators.
// Tìm hiểu Pipeable Operators, thay vì call độc lập thì nó sẽ được call trong pipe() method của 1 Observable Instance.

// Pipeable Operators.
// 1 Pipeable Operator là 1 function nó nhận đầu vào là 1 Obsservable khác. Chúng là những operation thuần: Observable truyền vào sẽ không bị thay đổi gì.

// Syntax.

// ObservableInstance.pipe(
//   operator1(),
//   operator2()
// )

// Với cú pháp trên thì observableInstance có pipe bao nhiêu operator đi nữa thì nó vẫn không đổi, và cuối cùng chúng ta sẽ nhận lại một Observable nên để có thể sử dụng chúng ta cần gán lại, hoặc thực hiện subscribe ngay sau khi pipe.

// const returnObservable = observableInstance.pipe(
//   operator1(),
//   operator2()
// )

import { Observable, fromEvent, merge, interval } from 'rxjs';
import {
  map,
  pluck,
  mapTo,
  scan,
  reduce,
  toArray,
  buffer,
  bufferTime,
  bufferTime,
  bufferTime,
} from 'rxjs/operators';

interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  postCount: number;
}

const source = new Observable<User>((observer) => {
  const users = [
    {
      id: 'ddfe3653-1569-4f2f-b57f-bf9bae542662',
      username: 'tiepphan',
      firstname: 'tiep',
      lastname: 'phan',
      postCount: 5,
    },
    {
      id: '34784716-019b-4868-86cd-02287e49c2d3',
      username: 'nartc',
      firstname: 'chau',
      lastname: 'tran',
      postCount: 22,
    },
  ];

  setTimeout(() => {
    observer.next(users[0]);
  }, 1000);

  setTimeout(() => {
    observer.next(users[1]);
    observer.complete();
  }, 3000);
});

const observer = {
  next: (value: any) => {
    console.log(value);
  },
  error: (error: any) => {
    console.log(error);
  },
  complete: () => {
    console.log('completed');
  },
};

source.subscribe(observer);

// map
// Gia su chung ta can hien thi thong tin fullname cua user trong next thi chung ta se dung cach nao.
// Cach don gian nhat la chung ta se vao ham next de thuc hien tinh toan. Nhung chung ta co the tranform stream data truoc khi no don voi diem cuoi.

source
  .pipe(
    map((user) => {
      return {
        ...user,
        fullname: `${user.firstname + ' ' + user.lastname}`,
      };
    })
  )
  .subscribe(observer);

// gia su bay gio chung ta thay doi yeu cau, chi can tra ve id cua user moi khi duoc emit

source.pipe(map((user) => user.id)).subscribe(observer);

// pluck
// Doi voi yeu cau map ra 1 property cua 1 obkect nhu trong vi du tren, ta co the su dung pluck

source.pipe(pluck('id')).subscribe(observer);

// mapTo
// Khi muốn bất cứ khi nào stream emit một giá trị thì luôn trả về 1 gía trị fixed.
// Gỉa sử chúng ta đang làm chức năng lắng nghe mouse hover. Như bạn có thẻ biết chúng ta cần kết hợp mouseover và mouselead event chẳng hạn. Khi mouseover chúng ta trả về true, mouselead chúng ta trả về false.
// Trong đoạn code dưới đây. Các bạn có thể tạm thời hiểu rằng merge sẽ gộp 2 streams thành 1, chúng ta sẽ học về combine stream những ngày sau.

const element = document.querySelector('#hover');
const mouseover$ = fromEvent(element, 'mouseover');
const mouselead$ = fromEvent(element, 'mouselead');

const hover$ = merge(
  mouseover$.pipe(mapTo(true)),
  mouselead$.pipe(mapTo(false))
);
hover$.subscribe(observer);

// scan
// Bây giờ mỗi lần stream emit một value, bạn muốn apply một function lên value đó nhưng có sử dụng kèm theo kết quả lưu trữ trước đó (accumulator). Các bạn có thể liên tưởng ngay đến hàm reduce của Array.

source.pipe(scan((acc, curr) => acc + curr.postCount, 0)).subscribe(observer);

// reduce
// Operator này khá giống scan là nó sẽ reduce value overtime, nhưng nó sẽ đợi đến khi source complete rồi thì nó mới emit một giá trị cuối cùng và gửi đi complete.

source.pipe(reduce((acc, curr) => acc + curr.postCount, 0)).subscribe(observer);

// toArray
// Giả sử bạn cần collect toàn bộ các value emit bởi stream rồi lưu trữ thành một array, sau đó đợi đến khi stream complete thì emit một array và complete. Lúc này bạn hoàn toàn có thể sử dụng reduce:

source.pipe(reduce((acc, curr) => [...acc, curr], [])).subscribe(observer);

// Nhưng có một cách viết khác ngắn gọn hơn đó là dùng toArray.

source.pipe(toArray()).subscribe(observer);

// buffer
// Lưu trữ giá trị được emit ra và đợi đến khi closingNotifier emit thì emit những giá trị đó thành 1 array.

const interval$ = interval(500);

const click$ = fromEvent(document, 'click');

const buffer$ = interval$.pipe(buffer(click$));

const subscribe = buffer$.subscribe((val) =>
  console.log('Buffered Values: ', val)
);

//bufferTime

//Tương tự như buffer, nhưng emit values mỗi khoảng thời gian bufferTimeSpan ms.

const bufferTimeDemo = interval$.pipe(bufferTime(2000));

const bufferTimeSub = bufferTimeDemo.subscribe((val: any) =>
  console.log('Buffered with Time:', val)
);
