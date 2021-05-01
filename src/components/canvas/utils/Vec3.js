export default class Vec3 {
  constructor(elements){
    if(elements.length!==3){
      throw new Error("Vec3 must have 3 elements");
    }
    this.elements = elements;
  }

  element(i){
    if(i<0 || i>2){
      throw new Error("i must be in range [0, -2]");
    }
    return this.elements[i];
  }

  multiply(matrix){
    return matrix.multiply(this);
  }
}
