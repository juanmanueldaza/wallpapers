import{g as Z,R as M,p as F,i as ee,j as i,f as te,a as re,b as ne,c as ae,r as b}from"./index-B4qy1wWN.js";const se="/assets/daza007-64Nlwdq_.jpg",oe="/assets/daza009-D402gk_j.jpg",le="/assets/daza024-D8GAA1b-.jpg",ie="/assets/daza036-DaY8HNS3.jpg",ce="/assets/daza047-CnGzm2XC.jpg",ue="/assets/daza051-mqIHTbmx.jpg",fe="/assets/daza052-B0VgLzcl.jpg",de="/assets/daza054-CaHfVGhR.jpg",pe="/assets/daza060-4oztWGot.jpg",me="/assets/daza061--AQ5mB6z.jpg",be="/assets/daza063-Bn9m5ax7.jpg",_e="/assets/daza067-orAUCdTq.jpg",ge="/assets/daza072-CQYxJzsM.jpg",ye="/assets/daza088-DagqnVcT.jpg",he="/assets/daza128-BHH8pWo6.jpg",ve="/assets/daza131-CE7t8aiX.jpg",xe="/assets/daza136-DML5UnEE.jpg",je="/assets/daza140-a9GnYjBE.jpg",we="/assets/daza143-B8bV9j2q.jpg",Oe="/assets/daza474-DPAln3O4.jpg",Ie="/assets/daza478-CWFDIWr1.jpg",Ce=e=>{const t=r=>new Promise(n=>{const a=new Image;a.onload=()=>n(),a.onerror=()=>{console.error(`Failed to load image: ${r}`),n()},a.src=r});return Promise.all(e.map(t))},Ee="_mainContainer_1ywxc_1",Pe="_gridContainer_1ywxc_9",Se="_gridItem_1ywxc_18",Te="_fullscreenContainer_1ywxc_40",ke="_fullscreenImage_1ywxc_53",ze="_error_1ywxc_62",x={mainContainer:Ee,gridContainer:Pe,gridItem:Se,fullscreenContainer:Te,fullscreenImage:ke,error:ze},Ne="_navbar_145yp_1",Ae="_social_145yp_18",Re="_brand_145yp_29",S={navbar:Ne,social:Ae,brand:Re};var z={exports:{}},N,H;function De(){if(H)return N;H=1;var e="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";return N=e,N}var A,U;function Le(){if(U)return A;U=1;var e=De();function t(){}function r(){}return r.resetWarningCache=t,A=function(){function n(p,_,f,u,d,m){if(m!==e){var j=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw j.name="Invariant Violation",j}}n.isRequired=n;function a(){return n}var l={array:n,bigint:n,bool:n,func:n,number:n,object:n,string:n,symbol:n,any:n,arrayOf:a,element:n,elementType:n,instanceOf:a,node:n,objectOf:a,oneOf:a,oneOfType:a,shape:a,exact:a,checkPropTypes:r,resetWarningCache:t};return l.PropTypes=l,l},A}var B;function Fe(){return B||(B=1,z.exports=Le()()),z.exports}var We=Fe();const o=Z(We);function X(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable})),r.push.apply(r,n)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?X(Object(r),!0).forEach(function(n){I(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):X(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}function T(e){"@babel/helpers - typeof";return T=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},T(e)}function I(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function $e(e,t){if(e==null)return{};var r={},n=Object.keys(e),a,l;for(l=0;l<n.length;l++)a=n[l],!(t.indexOf(a)>=0)&&(r[a]=e[a]);return r}function qe(e,t){if(e==null)return{};var r=$e(e,t),n,a;if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],!(t.indexOf(n)>=0)&&Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}function W(e){return He(e)||Ue(e)||Be(e)||Xe()}function He(e){if(Array.isArray(e))return $(e)}function Ue(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function Be(e,t){if(e){if(typeof e=="string")return $(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);if(r==="Object"&&e.constructor&&(r=e.constructor.name),r==="Map"||r==="Set")return Array.from(e);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return $(e,t)}}function $(e,t){(t==null||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function Xe(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ge(e){var t,r=e.beat,n=e.fade,a=e.beatFade,l=e.bounce,p=e.shake,_=e.flash,f=e.spin,u=e.spinPulse,d=e.spinReverse,m=e.pulse,j=e.fixedWidth,C=e.inverse,w=e.border,E=e.listItem,g=e.flip,y=e.size,s=e.rotation,c=e.pull,v=(t={"fa-beat":r,"fa-fade":n,"fa-beat-fade":a,"fa-bounce":l,"fa-shake":p,"fa-flash":_,"fa-spin":f,"fa-spin-reverse":d,"fa-spin-pulse":u,"fa-pulse":m,"fa-fw":j,"fa-inverse":C,"fa-border":w,"fa-li":E,"fa-flip":g===!0,"fa-flip-horizontal":g==="horizontal"||g==="both","fa-flip-vertical":g==="vertical"||g==="both"},I(t,"fa-".concat(y),typeof y<"u"&&y!==null),I(t,"fa-rotate-".concat(s),typeof s<"u"&&s!==null&&s!==0),I(t,"fa-pull-".concat(c),typeof c<"u"&&c!==null),I(t,"fa-swap-opacity",e.swapOpacity),t);return Object.keys(v).map(function(P){return v[P]?P:null}).filter(function(P){return P})}function Ve(e){return e=e-0,e===e}function Y(e){return Ve(e)?e:(e=e.replace(/[\-_\s]+(.)?/g,function(t,r){return r?r.toUpperCase():""}),e.substr(0,1).toLowerCase()+e.substr(1))}var Me=["style"];function Ye(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Ke(e){return e.split(";").map(function(t){return t.trim()}).filter(function(t){return t}).reduce(function(t,r){var n=r.indexOf(":"),a=Y(r.slice(0,n)),l=r.slice(n+1).trim();return a.startsWith("webkit")?t[Ye(a)]=l:t[a]=l,t},{})}function K(e,t){var r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(typeof t=="string")return t;var n=(t.children||[]).map(function(f){return K(e,f)}),a=Object.keys(t.attributes||{}).reduce(function(f,u){var d=t.attributes[u];switch(u){case"class":f.attrs.className=d,delete t.attributes.class;break;case"style":f.attrs.style=Ke(d);break;default:u.indexOf("aria-")===0||u.indexOf("data-")===0?f.attrs[u.toLowerCase()]=d:f.attrs[Y(u)]=d}return f},{attrs:{}}),l=r.style,p=l===void 0?{}:l,_=qe(r,Me);return a.attrs.style=h(h({},a.attrs.style),p),e.apply(void 0,[t.tag,h(h({},a.attrs),_)].concat(W(n)))}var J=!1;try{J=!0}catch{}function Je(){if(!J&&console&&typeof console.error=="function"){var e;(e=console).error.apply(e,arguments)}}function G(e){if(e&&T(e)==="object"&&e.prefix&&e.iconName&&e.icon)return e;if(F.icon)return F.icon(e);if(e===null)return null;if(e&&T(e)==="object"&&e.prefix&&e.iconName)return e;if(Array.isArray(e)&&e.length===2)return{prefix:e[0],iconName:e[1]};if(typeof e=="string")return{prefix:"fas",iconName:e}}function R(e,t){return Array.isArray(t)&&t.length>0||!Array.isArray(t)&&t?I({},e,t):{}}var V={border:!1,className:"",mask:null,maskId:null,fixedWidth:!1,inverse:!1,flip:!1,icon:null,listItem:!1,pull:null,pulse:!1,rotation:null,size:null,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:null,transform:null,swapOpacity:!1},q=M.forwardRef(function(e,t){var r=h(h({},V),e),n=r.icon,a=r.mask,l=r.symbol,p=r.className,_=r.title,f=r.titleId,u=r.maskId,d=G(n),m=R("classes",[].concat(W(Ge(r)),W((p||"").split(" ")))),j=R("transform",typeof r.transform=="string"?F.transform(r.transform):r.transform),C=R("mask",G(a)),w=ee(d,h(h(h(h({},m),j),C),{},{symbol:l,title:_,titleId:f,maskId:u}));if(!w)return Je("Could not find icon",d),null;var E=w.abstract,g={ref:t};return Object.keys(r).forEach(function(y){V.hasOwnProperty(y)||(g[y]=r[y])}),Qe(E[0],g)});q.displayName="FontAwesomeIcon";q.propTypes={beat:o.bool,border:o.bool,beatFade:o.bool,bounce:o.bool,className:o.string,fade:o.bool,flash:o.bool,mask:o.oneOfType([o.object,o.array,o.string]),maskId:o.string,fixedWidth:o.bool,inverse:o.bool,flip:o.oneOf([!0,!1,"horizontal","vertical","both"]),icon:o.oneOfType([o.object,o.array,o.string]),listItem:o.bool,pull:o.oneOf(["right","left"]),pulse:o.bool,rotation:o.oneOf([0,90,180,270]),shake:o.bool,size:o.oneOf(["2xs","xs","sm","lg","xl","2xl","1x","2x","3x","4x","5x","6x","7x","8x","9x","10x"]),spin:o.bool,spinPulse:o.bool,spinReverse:o.bool,symbol:o.oneOfType([o.bool,o.string]),title:o.string,titleId:o.string,transform:o.oneOfType([o.string,o.object]),swapOpacity:o.bool};var Qe=K.bind(null,M.createElement);const Ze="_button_11gv8_1",et="_close_11gv8_32",tt="_download_11gv8_33",rt="_github_11gv8_39",nt="_link_11gv8_48",D={button:Ze,close:et,download:tt,github:rt,link:nt},k=({icon:e,onClick:t,ariaLabel:r,className:n,children:a,variant:l="default",href:p,target:_,rel:f})=>{const u=`${D.button} ${D[l]} ${n||""}`,d=i.jsxs(i.Fragment,{children:[e&&i.jsx(q,{icon:e}),a]});return p?i.jsx("a",{href:p,target:_,rel:f,className:D.link,children:i.jsx("button",{className:u,onClick:t,"aria-label":r,children:d})}):i.jsx("button",{className:u,onClick:t,"aria-label":r,children:d})},at=({onClose:e,onDownload:t})=>i.jsxs("nav",{className:S.navbar,children:[i.jsx("div",{className:S.brand,children:i.jsx("h1",{children:"Photo Gallery"})}),i.jsxs("div",{className:S.social,children:[i.jsx(k,{icon:te,onClick:t,ariaLabel:"Download current image",variant:"download"}),i.jsx(k,{icon:re,onClick:e,ariaLabel:"Exit fullscreen",variant:"close"})]})]}),st=()=>i.jsx("nav",{className:S.navbar,children:i.jsxs("div",{className:S.social,children:[i.jsx(k,{icon:ne,onClick:()=>{},ariaLabel:"View on Instagram",variant:"github",href:"https://instagram.com/ultravietnamita",target:"_blank",rel:"noopener noreferrer"}),i.jsx(k,{icon:ae,onClick:()=>{},ariaLabel:"View source on GitHub",variant:"github",href:"https://github.com/juanmanueldaza/wallpapers",target:"_blank",rel:"noopener noreferrer"})]})}),ot=()=>i.jsx("div",{className:x.loading,children:"Loading images..."}),Q=Object.values([se,oe,le,ie,ce,ue,fe,de,pe,me,be,_e,ge,ye,he,ve,xe,je,we,Oe,Ie]),lt=e=>{const t=e.match(/daza(\d+)/);return t?t[1]:null},L=(e,t)=>{const r=`daza${e}${t}`;return Q.find(n=>n.includes(r))||""},O=Array.from(new Set(Q.map(e=>lt(e)).filter(e=>e!==null))).map(e=>({id:e,url:L(e,"-medium.webp"),urlthumbnail:L(e,"-small.webp"),urldownload:L(e,".jpg"),alt:`Slide ${e}`})).sort((e,t)=>e.id.localeCompare(t.id)),ct=()=>{const[e,t]=b.useState(!0),[r,n]=b.useState(null),[a,l]=b.useState(null),[p,_]=b.useState(!1),f=b.useRef(null),u=b.useRef(null),d=b.useCallback(()=>a?O.findIndex(s=>s.id===a.id):-1,[a]),m=b.useCallback(s=>{const c=d();if(c===-1)return;let v;s==="next"?v=c===O.length-1?0:c+1:v=c===0?O.length-1:c-1,l(O[v])},[d]);b.useEffect(()=>{const s=O.map(c=>c.urlthumbnail);Ce(s).then(()=>t(!1)).catch(c=>console.error("Error preloading images:",c))},[]),b.useEffect(()=>{const s=()=>{_(!!document.fullscreenElement),document.fullscreenElement||l(null)};return document.addEventListener("fullscreenchange",s),()=>{document.removeEventListener("fullscreenchange",s)}},[]),b.useEffect(()=>{const s=c=>{if(p)switch(c.key){case"ArrowRight":c.preventDefault(),m("next");break;case"ArrowLeft":c.preventDefault(),m("prev");break;case"Escape":y();break}};return window.addEventListener("keydown",s),()=>{window.removeEventListener("keydown",s)}},[p,m]);const j=s=>{u.current=s.touches[0].clientX},C=s=>{if(u.current===null)return;const v=s.changedTouches[0].clientX-u.current;Math.abs(v)>50&&(v>0?m("prev"):m("next")),u.current=null},w=s=>{n(`Failed to load image ${s}`)},E=()=>{if(!a)return;const s=document.createElement("a");s.href=a.urldownload,s.download=`uwJuamManuelDaza-${a.id}.jpg`,document.body.appendChild(s),s.click(),document.body.removeChild(s)},g=async s=>{if(l(s),f.current)try{await f.current.requestFullscreen()}catch(c){console.error("Error entering fullscreen:",c)}},y=async()=>{if(document.fullscreenElement)try{await document.exitFullscreen()}catch(s){console.error("Error exiting fullscreen:",s)}l(null)};return e?i.jsx(ot,{}):i.jsxs("div",{className:x.mainContainer,children:[i.jsx(st,{}),i.jsx("div",{ref:f,className:x.container,children:p&&a?i.jsxs("div",{className:x.fullscreenContainer,onTouchStart:j,onTouchEnd:C,children:[i.jsx(at,{onClose:y,onDownload:E}),i.jsx("img",{src:a.url,alt:a.alt,className:x.fullscreenImage,onError:()=>w(a.id)})]}):i.jsx("div",{className:x.gridContainer,children:O.map(s=>i.jsx("div",{className:x.gridItem,onClick:()=>g(s),children:i.jsx("img",{src:s.urlthumbnail,alt:s.alt,className:x.thumbnail,onError:()=>w(s.id)})},s.id))})}),r&&i.jsx("div",{className:x.error,children:r})]})};export{ct as default};
