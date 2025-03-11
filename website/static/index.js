var C=Object.defineProperty;var t=(i,r)=>C(i,"name",{value:r,configurable:!0});var l=class i extends skriptWeb.Expression{static{t(this,"Document")}static Registration=class extends skriptWeb.SyntaxRegistration{static{t(this,"Registration")}rawPatterns(){return["document body"]}syntaxElement(){return i}initialize(r,e){return new i(r)}};getReturnType(){return Element}isSingle(){return!0}get(r){return[document.body]}toString(r){return"document body"}};var u=class i extends skriptWeb.Expression{constructor(e,n){super(e);this.type=n}static{t(this,"NewElement")}static Registration=class extends skriptWeb.SyntaxRegistration{static{t(this,"Registration")}rawPatterns(){return["[new] element (with|of) type %string%"]}syntaxElement(){return i}initialize(e,n){let s=n.expressions[0];return new i(e,s)}};getReturnType(){return Element}isSingle(){return!0}get(e){let n=this.type.get(e)[0];return[document.createElement(n)]}toString(e){return`new element of type ${this.type.get(e)[0]}`}};var m=class extends skriptWeb.SkriptExtension{static{t(this,"DOMExtension")}name="dom";onInitialize(){let{syntaxRegistry:r,skript:e}=this,n=e.types.registerType(Element,"element","elements");console.log({type:n,a:n.setAcceptChange}),n.setAcceptChange((s,y,h)=>h?.isSingle()===!0).setChange((s,y,h,w)=>{let o=s.parentElement,b=w.get(h)[0];switch(y){case 0:{if(!o)return;let x=Array.from(o.children),k=Array.from(o.children).indexOf(s);o.replaceChildren(...x.slice(0,k),b,...x.slice(k+1));break}case 1:{s.appendChild(b);break}case 2:{s.removeChild(b);break}case 3:{if(!o)return;o.removeChild(s);break}}}),r.registerSyntaxElement(new u.Registration(e)),r.registerSyntaxElement(new l.Registration(e))}};var{Skript:B,CoreExtension:M,SimpleLogger:An,SkriptParser:Nn,LogLevel:$n}=skriptWeb,a=new B;a.types.registerType(Object,"object","objects");a.types.registerType(String,"string","strings");a.types.registerType(Number,"number","numbers");a.types.registerType(Boolean,"boolean","booleans");a.extensions.registerExtension(M);a.extensions.registerExtension(m);
