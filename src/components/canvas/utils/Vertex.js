import Vec3 from "./Vec3.js"

export default class Vertex {
  constructor(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static transform(vertex, matrix){
    return Vertex.fromVec3(matrix.multiply(Vertex.toVec3(vertex)));
  }

  static toVec3(vertex){
    return new Vec3([vertex.x, vertex.y, vertex.z]);
  }

  static fromVec3(vector){
    return new Vertex(vector.element(0), vector.element(1), vector.element(2));
  }
}
