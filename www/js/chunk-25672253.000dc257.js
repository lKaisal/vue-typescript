(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-25672253"],{"1c7d":function(t,e,s){},"7b18":function(t,e,s){"use strict";s.r(e);var a=s("c91f"),i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"page-main page"},[s("div",{staticClass:"page-main__container"},[s("ListRestart",{key:t.listSorted+t.editPayload,staticClass:"page-main__list",attrs:{list:t.listSorted},on:{editClicked:t.onEditClick,updateClicked:t.onUpdateClick}})],1),s("transition",[s("MessageBox",{directives:[{name:"show",rawName:"v-show",value:t.msgBoxIsShown&&t.editFailed,expression:"msgBoxIsShown && editFailed"}],staticClass:"list-features__msg-box modal modal-msg",attrs:{content:t.msgBoxContent},on:{close:t.closeMsgBox,firstBtnClicked:t.onFirstBtnClick,secondBtnClicked:t.closeMsgBox}})],1)],1)},n=[],o=s("9ab4"),c=s("60a3"),d=s("121b"),l=s("521f"),r=s("51a1"),u=s("8c15"),m=s("3588");const p=c["e"].extend({computed:{...a["b"].mapState(["list"]),...a["b"].mapGetters(["isLoading","listSorted"])},methods:{...a["b"].mapActions(["editList"])}});let h=class extends(Object(c["b"])(u["a"],r["a"],p)){constructor(){super(...arguments),this.editPayload=null}get editFailed(){return"failEdit"===this.requestStatus}onEditClick(t){t&&(this.editPayload=t),this.editList(this.editPayload).then(()=>{this.editPayload=null}).catch(()=>{this.requestStatus="failEdit",this.openMsgBox()})}onUpdateClick(){this.$emit("updateList")}onFirstBtnClick(){switch(this.closeMsgBox(),this.requestStatus){case"failEdit":this.onEditClick();break}}};h=Object(o["a"])([Object(c["a"])({components:{MessageBox:l["a"],ButtonApp:d["a"],ListRestart:m["a"]},mixins:[u["a"]]})],h);var g=h,b=g,k=(s("7cf7"),s("0c7c")),C=Object(k["a"])(b,i,n,!1,null,"83c7d872",null),f=C.exports;const x=[{path:"/",component:f,name:"PageRestart"},{path:"*",redirect:{name:"PageRestart"}}];var B=[{path:"/restart",component:()=>s.e("restart").then(s.bind(null,"2d6d")),name:"ModuleRestart",redirect:{name:"PageRestart"},children:x,meta:{title:"Рестарт сервисов",isDynamicModule:!0}}];e["default"]={name:"restart",store:a["a"],routes:B}},"7cf7":function(t,e,s){"use strict";var a=s("1c7d"),i=s.n(a);i.a}}]);
//# sourceMappingURL=chunk-25672253.000dc257.js.map