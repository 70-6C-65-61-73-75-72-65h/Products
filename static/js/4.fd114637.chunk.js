(this.webpackJsonptest=this.webpackJsonptest||[]).push([[4],{304:function(t,e,c){"use strict";c.r(e);var n=c(8),s=c.n(n),i=c(15),a=c(27),r=c(1),o=c(0),d=c(24),u=c(66),j=c(39),l=c.n(j),p=function(t){var e=t.productKey,c=t.name,n=t.price,s=t.description,i=t.discount,a=t.discountEndTime,o=t.photo,j=t.deleteProduct;return t.isFetching?Object(r.jsx)(u.a,{}):Object(r.jsxs)("div",{className:l.a.productContainer,children:[Object(r.jsxs)("h3",{className:l.a.productHeader,children:[" ",c]}),Object(r.jsxs)("div",{children:[" \u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435: ",s||"..."]}),Object(r.jsxs)("div",{children:["\u0426\u0435\u043d\u0430: ",function(){var t=+n;return i&&(t*=1-i/100),console.log(t),t.toFixed(2)}()," $"]}),Object(r.jsx)("div",{className:l.a.imgSmallContainer,children:Object(r.jsx)("img",{src:o,alt:"\u0424\u043e\u0442\u043e \u0442\u043e\u0432\u0430\u0440\u0430"})}),i?Object(r.jsxs)("div",{className:"".concat(l.a.discount),children:["\u0421\u043a\u0438\u0434\u043a\u0430: ",i," %"]}):Object(r.jsx)("div",{className:"".concat(l.a.discount," ").concat(l.a.empty)}),a?Object(r.jsxs)("div",{className:"".concat(l.a.discount),children:["\u0414\u043e \u043a\u043e\u043d\u0446\u0430 \u0430\u043a\u0446\u0438\u0438: ",function(t){var e=new Date(t-new Date).getDate();return"".concat(e,(e-1)%10===0&&(e-11)%100!==0?" \u0441\u0443\u0442\u043a\u0438":" \u0441\u0443\u0442\u043e\u043a")}(a)]}):Object(r.jsx)("div",{className:"".concat(l.a.discount," ").concat(l.a.empty)}),Object(r.jsxs)("div",{className:l.a.operationBlock,children:[Object(r.jsx)("div",{children:Object(r.jsx)(d.b,{to:"/catalog/"+e,children:"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c"})}),Object(r.jsx)("div",{className:l.a.delete,children:Object(r.jsx)(d.b,{to:"/catalog/",onClick:function(){return j(e)},children:"\u0423\u0434\u0430\u043b\u0438\u0442\u044c"})})]})]})},b=c(50),h=c(13),O=c(96),m=c(11);e.default=Object(m.d)(O.a,Object(h.b)((function(t){return{products:t.products.products,isFetching:t.products.isFetching}}),{deleteProduct:b.c,getProducts:b.e}))((function(t){var e=t.getProducts,c=t.products,n=t.deleteProduct,d=t.isFetching,j=Object(o.useState)(!1),b=Object(a.a)(j,2),h=b[0],O=b[1];return Object(o.useEffect)((function(){h||function(){var t=Object(i.a)(s.a.mark((function t(){return s.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return O(!0),t.next=3,e();case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}()()}),[h,O,e]),d?Object(r.jsx)(u.a,{}):Object(r.jsx)("div",{children:Object(r.jsx)("div",{className:l.a.catalog,children:c.map((function(t){return Object(r.jsx)(p,{productKey:t.key,name:t.name,description:t.description,price:t.price,discount:t.discount,discountEndTime:t.discountEndTime,photo:t.photo,deleteProduct:n,isFetching:d},t.key)}))})})}))}}]);
//# sourceMappingURL=4.fd114637.chunk.js.map