import Vec3 from "../math/Vec3.js"

// Point in 3D space
export default class Vertex {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.vector = new Vec3([x, y, z]);
  }

  // Apply a transformation matrix to this vertex's vector
  transform(matrix){
    const transformedVector = matrix.multiply(this.vector);
    return new Vertex(transformedVector.element(0), transformedVector.element(1), transformedVector.element(2));
  }
}
