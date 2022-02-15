import { makeAutoObservable, observe } from "mobx";

class Example {
  value = 1;

  tick() {
    this.value++;
  }
}

const example = new Example();

makeAutoObservable(example);

setInterval(() => {
  example.tick();
}, 1000);

observe(example, (change) => {
  console.log("Example is ", example.value);
});
