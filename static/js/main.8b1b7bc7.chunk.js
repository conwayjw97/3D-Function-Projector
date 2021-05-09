(this["webpackJsonpfunction-projector"]=this["webpackJsonpfunction-projector"]||[]).push([[0],{34:function(e,n,r){},43:function(e,n){},44:function(e,n,r){},46:function(e,n,r){},47:function(e,n,r){},48:function(e,n,r){"use strict";r.r(n);var t=r(10),i=r.n(t),s=r(25),o=r.n(s),a=(r(34),r(12)),c=r(0),d=r(3),u=r(5),h=r(27),l=r(26),p=r(50),v="rgb(255, 255, 255)",x="rgb(0, 255, 0)",f="rgb(0, 0, 255)",w="rgb(255, 0, 43)",b=new u.v(100,100,-100),j=new u.v(100,-100,-100),g=new u.v(100,100,100),O=new u.v(100,-100,100),y=new u.v(-100,100,-100),m=new u.v(-100,-100,-100),E=new u.v(-100,100,100),k=new u.v(-100,-100,100),L=function(){function e(n,r,t,i,s,o,a,d){var l=this;Object(c.a)(this,e),this.expression=i,this.detail=s,this.xRange=o,this.yRange=a,this.zRange=d,this.scene=new u.o,this.camera=new u.k(45,r/t,.1,1e3),this.camera.position.set(150,100,150),this.renderer=new u.w({canvas:n,antialias:!0}),this.renderer.setSize(r,t),this.renderer.setClearColor("rgb(40, 44, 52)"),this.controls=new h.a(this.camera,this.renderer.domElement),this.controls.target=new u.v(0,0,0),this.renderAxisIndicators(),this.renderExpression();!function e(){requestAnimationFrame(e),l.renderer.render(l.scene,l.camera),l.controls.update()}()}return Object(d.a)(e,[{key:"updateExpression",value:function(e){this.expression=e,this.scene.remove(this.expressionGroup),this.renderExpression()}},{key:"renderAxisIndicators",value:function(){this.renderLine(m,j,new u.f({color:x})),this.renderLine(m,y,new u.f({color:w})),this.renderLine(m,k,new u.f({color:f})),this.renderText("X",102.5,-100,-100,x),this.renderText("Z",-100,102.5,-100,w),this.renderText("Y",-100,-100,102.5,f),this.renderLine(j,b,new u.f({color:v})),this.renderLine(b,y,new u.f({color:v})),this.renderLine(y,E,new u.f({color:v})),this.renderLine(E,E,new u.f({color:v})),this.renderLine(E,k,new u.f({color:v})),this.renderLine(E,g,new u.f({color:v})),this.renderLine(k,O,new u.f({color:v})),this.renderLine(O,g,new u.f({color:v})),this.renderLine(g,b,new u.f({color:v})),this.renderLine(O,j,new u.f({color:v}))}},{key:"renderLine",value:function(e,n,r){var t=[e,n],i=(new u.a).setFromPoints(t),s=new u.e(i,r);this.scene.add(s)}},{key:"renderText",value:function(e,n,r,t,i){var s=new l.a(e,6,i);s.position.x=n,s.position.y=r,s.position.z=t,s.fontFace="Consolas",this.scene.add(s)}},{key:"renderExpression",value:function(){this.expressionGroup=new u.d;var e=this.evaluateExpression();this.expressionGroup=this.createExpressionDots(this.expressionGroup,e);for(var n=0;n<e.length;n++)for(var r=0;r<e[n].length;r++)this.expressionGroup=this.createExpressionSquare(this.expressionGroup,e,n,r),this.expressionGroup=this.createExpressionPlane(this.expressionGroup,e,n,r);this.scene.add(this.expressionGroup)}},{key:"evaluateExpression",value:function(){var e=[];if(this.expression.includes("x")||this.expression.includes("y"))for(var n=this.xRange[0];n<=this.xRange[1];n+=this.detail){for(var r=this.expression.replaceAll("x","("+n+")"),t=[],i=this.yRange[0];i<=this.yRange[1];i+=this.detail){var s=void 0;if(r.includes("y")){var o=r.replaceAll("y","("+i+")");s=Object(p.a)(o)}else s=Object(p.a)(r);s>=this.zRange[0]&&s<=this.zRange[1]&&t.push(new u.v(n,s,i))}t.length>0&&e.push(t)}return e}},{key:"createExpressionDots",value:function(e,n){var r=[].concat.apply([],n),t=(new u.a).setFromPoints(r),i=new u.l({color:v,size:.25}),s=new u.m(t,i);return e.add(s),e}},{key:"createExpressionSquare",value:function(e,n,r,t){if(void 0!==n[r+1]){var i=new u.f({color:v}),s=void 0!==n[r+1][t]&&void 0!==n[r+1][t]&&void 0!==n[r+1][t+1]&&void 0!==n[r][t+1],o=void 0!==n[r+1][t]&&void 0!==n[r+1][t+1],a=void 0!==n[r][t+1]&&void 0!==n[r+1][t],c=null;if(s?c=[n[r][t],n[r+1][t],n[r+1][t+1],n[r][t+1],n[r][t]]:o?c=[n[r][t],n[r+1][t],n[r+1][t+1],n[r][t]]:a&&(c=[n[r][t],n[r][t+1],n[r+1][t]]),null!==c){var d=(new u.a).setFromPoints(c),h=new u.e(d,i);e.add(h)}}return e}},{key:"createExpressionPlane",value:function(e,n,r,t){if(void 0!==n[r+1]){var i=this.getColourForVector(n[r][t]),s=new u.j({color:i,side:u.b}),o=void 0!==n[r+1][t]&&void 0!==n[r+1][t+1],a=void 0!==n[r][t+1]&&void 0!==n[r+1][t+1],c=void 0!==n[r][t+1]&&void 0!==n[r+1][t],d=!0;if(o){d=!1;var h=[n[r][t],n[r+1][t],n[r+1][t+1]],l=(new u.a).setFromPoints(h);e.add(new u.i(l,s))}if(a){d=!1;var p=[n[r][t],n[r][t+1],n[r+1][t+1]],v=(new u.a).setFromPoints(p);e.add(new u.i(v,s))}if(d&&c){var x=[n[r][t],n[r][t+1],n[r+1][t]],f=(new u.a).setFromPoints(x);e.add(new u.i(f,s))}}return e}},{key:"getColourForVector",value:function(e){var n,r;return 0,n=Math.round(2.55*Math.abs(e.z)),r=Math.round(2.55*Math.abs(e.y)),"rgb("+n+","+Math.round(2.55*Math.abs(e.x))+","+r+")"}},{key:"getColourForY",value:function(e){var n,r,t;return n=r=t=0,e>0?(n=Math.round(2.55*e),r=Math.round(255-n)):(t=Math.round(2.55*-e),r=Math.round(255-t)),"rgb("+n+","+r+","+t+")"}}]),e}(),C=(r(44),r(7));var F=function(e){var n=Object(t.useRef)(null),r=window.innerWidth,i=window.innerHeight,s=Object(t.useRef)(null);return Object(t.useEffect)((function(){var t=new L(n.current,r,i,e.expression,e.detail,[-100,100],[-100,100],[-100,100]);s.current={updateExpression:function(e){t.updateExpression(e)}}}),[]),Object(t.useEffect)((function(){s.current.updateExpression(e.expression)}),[e.updateCount]),Object(C.jsx)("canvas",{ref:n,width:r,height:i,className:"canvas",children:Object(C.jsx)("p",{children:"Your browser doesn't support canvas."})})};r(46);var M=function(e){return Object(C.jsx)("div",{className:"controls",children:Object(C.jsxs)("div",{className:"expression",children:[Object(C.jsx)("label",{children:"Z:"}),Object(C.jsx)("input",{type:"text",id:"expression",name:"expression",value:e.expression,onChange:e.handleExpressionChange}),Object(C.jsx)("button",{onClick:e.handleUpdate,children:"Update"})]})})};r(47);var R=function(){var e=Object(t.useState)(0),n=Object(a.a)(e,2),r=n[0],i=n[1],s=Object(t.useState)(5),o=Object(a.a)(s,2),c=o[0],d=o[1],u=Object(t.useState)("1-abs(x+y)-abs(y-x)"),h=Object(a.a)(u,2),l=h[0],p=h[1];return Object(C.jsxs)("div",{className:"App",children:[Object(C.jsx)(F,{detail:c,expression:l,updateCount:r}),Object(C.jsx)(M,{detail:c,handleDetailChange:function(e){d(e.target.value)},expression:l,handleExpressionChange:function(e){p(e.target.value)},handleUpdate:function(){i(r+1)}})]})};o.a.render(Object(C.jsx)(i.a.StrictMode,{children:Object(C.jsx)(R,{})}),document.getElementById("root"))}},[[48,1,2]]]);
//# sourceMappingURL=main.8b1b7bc7.chunk.js.map