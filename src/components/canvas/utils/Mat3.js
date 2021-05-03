import Vec3 from "./Vec3.js"

// 3D Matrix, represented as a 1D array of integers
export default class Mat3 {
  constructor(elements){
    if(elements.length !== 9){
      throw new Error("Mat3 must have 9 elements");
    }
    this.elements = elements;
  }

  element(x, y){
    if(x<0 || x>2){
      throw new Error("X must be in range [0, 2]");
    }
    if(y<0 || y>2){
      throw new Error("Y must be in range [0, 2]");
    }
    return this.elements[y * 3 + x];
  }

  multiply(other){
    if(!(other instanceof Vec3) && !(other instanceof Mat3)) {
			throw new Error("Vector must be either a Vec3 or Mat3 object");
		}

    let elements = [];

    // Matrix-Vector product, does the dot product of the vector with
    // each row of the matrix, i.e. multiplies each column value of the matrix
    // by each element of the vector, one element per column
    if(other instanceof Vec3){
      for(let y=0; y<3; ++y){
        let sum = 0;
        for(let x=0; x<3; ++x){
          sum += other.element(x) * this.element(x, y);
        }
        elements.push(sum);
      }
      return new Vec3(elements);
    }

    // Matrix-Matrix product, does the dot product of the rows of the first matrix
    // with the columns of the second.
    else if(other instanceof Mat3){
      for(let z=0; z<3; ++z){
        for(let y=0; y<3; ++y){
          let sum = 0;
          for(let x=0; x<3; ++x){
            sum += other.element(y, x) * this.element(x, z);
          }
          elements.push(sum);
        }
      }
      return new Mat3(elements);
    }
  }

  // The constraints imposed by the identity matrix ensure the determinant of a
  // matrix is 1, corresponding to a right hand frame matrix
  static identity(){
    return new Mat3([
  		1.0, 0.0, 0.0,
  		0.0, 1.0, 0.0,
  		0.0, 0.0, 1.0
  	])
  }

  // Rotation matrices for each axis. The rotation matrix is formed by appending
  // the X, Y, and Z vectors to form each column of the matrix
  // For more details: https://en.wikipedia.org/wiki/Rotation_matrix#In_three_dimensions
  static rotationX(angle){
    const a = Math.cos(angle);
  	const b = Math.sin(angle);
  	return new Mat3([
  		1.0, 0.0, 0.0,
  		0.0,   a,  -b,
  		0.0,   b,   a,
  	])
  }
  static rotationY(angle){
  	const a = Math.cos(angle);
  	const b = Math.sin(angle);
  	return new Mat3([
  		  a, 0.0,   b,
  		0.0, 1.0, 0.0,
  		 -b, 0.0,   a,
  	]);
  }
  static rotationZ(angle) {
  	const a = Math.cos(angle);
  	const b = Math.sin(angle);
  	return new Mat3([
  		  a,  -b, 0.0,
  		  b,   a, 0.0,
  		0.0, 0.0, 1.0,
  	])
  }

  // Transformation matrix to isometrically project an object's matrix
  static isometric(angle) {
  	const a = Math.cos(angle);
  	const b = Math.sin(angle);
  	return new Mat3([
  		 a, 0, a,
  		-b, 1, b,
  		 0, 0, 0
  	])
  }
}
