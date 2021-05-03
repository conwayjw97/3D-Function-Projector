// Vector in 3D space, represented as a 1D array of integers
//
// Remember the notation, a vector AB is given by subtracting
// coordinates of the head coordinate (B) from the tail coordinate (A)
// A = (-3, 4, 0)
// B = (3, 6, 3)
// AB = (3 - (-3), + - 4, 3 - 0) = (6, 2, 3)
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
