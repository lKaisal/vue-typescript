(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["features"],{"65f5":function(t,e,s){"use strict";var a=s("d6dd"),i=s.n(a);i.a},"8b41":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:t.isLoading,expression:"isLoading",modifiers:{fullscreen:!0,lock:!0}}],staticClass:"module-features page"},[t.list.data&&t.list.data.length?s("div",{staticClass:"module-features__container"},[s("h1",{staticClass:"module-features__title page-title js-voa js-voa-start"},[t._v("Управление разделами приложения")]),s("router-view"),s("transition",[s("MessageBox",{directives:[{name:"show",rawName:"v-show",value:t.msgBoxIsShown,expression:"msgBoxIsShown"}],staticClass:"module-features__msg-box modal modal-msg",attrs:{content:t.msgBoxContent,secondBtn:t.secondBtn},on:{close:function(e){return t.closeMsgBox()},firstBtnClicked:function(e){return t.onFirstBtnClick()},secondBtnClicked:function(e){return t.goToPageApp()}}})],1)],1):t._e()])},i=[],n=s("9ab4"),o=s("60a3"),c=s("6d09"),r=s("58da"),l=s("51a1"),d=s("7470"),u=s("521f"),h=s("737a");const g=o["e"].extend({computed:{...c["b"].mapState(["list"]),...c["b"].mapGetters(["isLoading"])},methods:{...c["b"].mapActions(["getList"])}});let p=class extends(Object(o["b"])(g,l["a"],d["a"])){constructor(){super(...arguments),this.secondBtn={type:"danger",isPlain:!0}}async onListChange(t){t.data&&t.data.length&&(await this.$nextTick(),Object(h["a"])())}created(){this.updateList()}goToPageApp(){this.$router.push({path:"/"})}onFirstBtnClick(){switch(this.msgBoxIsShown&&this.closeMsgBox(),this.requestStatus){case"failFetchList":this.updateList();break}}updateList(){this.list.isLoading||this.getList().catch(()=>{this.requestStatus="failFetchList",this.openMsgBox()})}};Object(n["a"])([Object(o["f"])("list",{deep:!0})],p.prototype,"onListChange",null),p=Object(n["a"])([Object(o["a"])({components:{ListFeatures:r["a"],MessageBox:u["a"]}})],p);var f=p,m=f,b=(s("65f5"),s("0c7c")),v=Object(b["a"])(m,a,i,!1,null,"5d376e56",null);e["default"]=v.exports},d6dd:function(t,e,s){}}]);
//# sourceMappingURL=features.bd77fc3b.js.map