export default class Polygon {
  constructor(vertices){
    this.vertices = vertices;
  }

  count(){
    return this.vertices.length;
  }

  vertex(i){
    if(i < 0){
      throw new Error("Vertex index must be a positive integer");
    }
    if(i >= this.vertices.length){
      throw new Error("Vertex index out of bounds");
    }
    return this.vertices[i];
  }
}
