import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
  } from "snabbdom";

var patch = init([classModule,propsModule,styleModule,eventListenersModule])
var myVnode1 = h('a',{ props: { href: 'https://www.bilibili.com/video/BV1v5411H7gZ?p=3&spm_id_from=pageDriver' } },'www')
console.log(myVnode1)

const container = document.getElementById('container')
patch(container,myVnode1)