var F=Object.defineProperty;var i=(c,t)=>F(c,"name",{value:t,configurable:!0});var d=class{constructor(t){this.skript=t}static{i(this,"SyntaxElement")}};var l=class extends d{static{i(this,"Expression")}change(t,r,n){let e=this.get(r);r.skript.types.findTypeFromValue(e[0]).change(this.isSingle()?e[0]:e,t,r,n)}acceptChange(t,r,n){return!0}getSyntaxType(){return 3}};var y=class c{constructor(t,r){this.element=t;this.isOptional=r}static{i(this,"ChoiceElement")}createPattern(t,{skript:r,isOptional:n}){let[e,o]=[["(",")"],["[","]"]][+n],s=0;if(t[s++]!==e)throw new Error(`Expected '${e}'`);let a=[];for(;t[s]!==o;){let[p,u]=k.prototype.createPattern(t.substring(s),{skript:r,patternNumber:-1});a.push(p),s+=u,t[s]==="|"&&s++}if(t[s++]!==o)throw new Error(`Expected '${o}'`);return[new c(a,n),s]}matchPattern(t,{skript:r}){for(let n of this.element){let e=n.matchPattern(t,{skript:r,patternNumber:-1});if(e)return e}return null}};var m=class{constructor(t,r=[],n=[],e=-1){this.size=t;this.regexes=r;this.expressions=n;this.patternNumber=e}static{i(this,"MatchPatternResult")}};var w=["(",")","[","]","<","%","|"];var T=class extends l{constructor(r,n){super(n);this.value=r}static{i(this,"BooleanExpression")}getReturnType(){return Boolean}isSingle(){return!0}get(){return[this.value]}toString(r){return this.value.toString()}};var C=class extends Number{static{i(this,"Integer")}},P=class extends l{constructor(r,n){super(n);this.value=r}static{i(this,"IntegerExpression")}getReturnType(){return C}isSingle(){return!0}get(){return[this.value]}toString(r){return this.value.toString()}};var v=class extends l{constructor(r,n){super(n);this.value=r}static{i(this,"NumberExpression")}getReturnType(){return Number}isSingle(){return!0}get(){return[this.value]}toString(r){return this.value.toString()}};var R=class extends l{constructor(r,n){super(n);this.value=r}static{i(this,"StringExpression")}getReturnType(){return String}isSingle(){return!0}get(){return[this.value]}toString(r){return this.value}};var B=class extends l{constructor(r,n){super(n);this.name=r}static{i(this,"VariableExpression")}cachedName=null;getReturnType(){return Object}isSingle(){return!0}get(r){let n=this.getName(r);return r.structure.symbols.get(n)}change(r,n,e){let{symbols:o}=n.structure,s=this.getName(n);switch(r){case 0:{o.set(s,e.get(n));break}case 1:case 2:{let a=o.get(s),p=e.get(n);if(console.log({name:s}),!s.endsWith("::*")){let g=o.get(s),f=n.skript.types.getType(a.constructor);console.log({type:f}),f.change(g,r,n,e);return}let u=r===1?a.push:(...g)=>{for(let f of g){let A=a.indexOf(f);A!==-1&&a.splice(A,1)}};Array.isArray(p)?u(...p.flat()):u(p);break}case 3:{o.delete(s);break}}}acceptChange(r,n,e){let o=this.getName(n),s=n.structure.symbols.get(o);return!((r===1||r===2)&&!Array.isArray(s))}toString(r){let n=r.structure.symbols.get(this.name);return this.skript.types.getType(n.constructor).toString(n)}getName(r){return this.cachedName?this.cachedName:this.cachedName=this.evaluateName(r)}evaluateName(r){let n=this.skript.types.getType(Object),e=0,o="";for(;e<this.name.length;){let s=this.name[e++];if(s==="%"){if(this.name[e]==="%"){o+="%",e++;continue}let p=new b(n).matchPattern(this.name.substring(e),{skript:this.skript});if(o+=p.expressions[0].toString(r),this.name[e++]!=="%")throw new Error("Expected '%'");continue}o+=s}return o}};var b=class c{constructor(t){this.type=t}static{i(this,"ExpressionElement")}createPattern(t,{skript:r}){let n="",e=0;if(t[e++]!=="%")throw new Error("Expected '%'");for(;e<t.length&&t[e]!=="%";)n+=t[e++];if(t[e++]!=="%")throw new Error("Expected '%'");return[new c(r.types.getType(n)),e]}matchPattern(t,{skript:r}){let n=r.getSyntaxOfType(3),e=0,o=i(s=>s>="0"&&s<="9","isDigit");switch(!0){case t[e]==='"':{if(this.type.type!==String&&this.type.type!==Object)break;e++;let s="";for(;e<t.length&&t[e]!=='"';){if(t[e]==="\\"){e++,s+=t[e++];continue}s+=t[e++]}if(t[e++]!=='"')break;return new m(e,[],[new R(s,r)])}case o(t[e]):{if(!o(t[e]))break;let s=0,a=0;for(;e<t.length&&o(t[e])||s===0&&t[e]===".";){if(s===0){if(t[e]==="."){s=.1;continue}a*=10,a+=t.charCodeAt(e++)-48;continue}a+=(t.charCodeAt(e++)-48)*s,s/=10}let p=s===0&&(this.type.type===C||this.type.type===Object)?new P(a,r):new v(a,r);return new m(e,[],[p])}case(t.startsWith("true")||t.startsWith("false")):{if(this.type.type!==Boolean&&this.type.type!==Object)break;let s=t.startsWith("true");if(e+=s?4:5,e<t.length&&t[e]>="a"&&t[e]<="z"||o(t[e]))break;return new m(e,[],[new T(s,r)])}}if(t[e]==="{"){let s=r.types.getType(Object),a=new c(s),p="";for(e++;e<t.length&&t[e]!=="}"&&t[e]!==`
`;){let u=t[e++];if(u==="%"){if(t[e]==="%"){p+="%",e++;continue}let g=a.matchPattern(t.substring(e),{skript:r});if(!g)return null;for(let f=0;f<g.size;f++)p+=t[e++];if(t[e++]!=="%")return null;continue}p+=u}return t[e++]!=="}"?null:new m(e,[],[new B(p,r)])}for(let s of n){let a=s.syntaxElement();if(this.type.type!==Object&&a.prototype.getReturnType()!==this.type.type)continue;let p=s.matchPattern(t,{skript:r});if(p)return new m(p.size,[],[s.initialize(r,p)])}return null}};var S=class c{constructor(t){this.value=t}static{i(this,"LiteralElement")}createPattern(t){let r="",n=0;for(;n<t.length&&!w.includes(t[n]);)r+=t[n++];return[new c(r.trim()),n]}matchPattern(t){return t.startsWith(this.value)?new m(this.value.length,[]):null}};var M=class c{constructor(t){this.regex=t}static{i(this,"RegexElement")}createPattern(t){let r="^",n=0;if(t[n++]!=="<")throw new Error("Expected '<'");for(;n<t.length&&t[n]!==">";){let e=t[n++];if(e==="\\"&&t[n]===">"){r+=">",n++;continue}r+=e}if(t[n++]!==">")throw new Error("Expected '>'");return[new c(new RegExp(r,"g")),n]}matchPattern(t){let r=t.match(this.regex);return r?new m(r[0].length,[r[0]]):null}};var k=class c{constructor(t){this.elements=t}static{i(this,"GroupElement")}createPattern(t,{skript:r}){let n=[],e=0;t:for(;e<t.length;){let o=t.substring(e),s=o[0];if(o.startsWith(" ")){e++;continue}switch(s){case"\\":{e++;let a=new S(t[e++]);n.push(a);break}case"%":{let[a,p]=b.prototype.createPattern(o,{skript:r});n.push(a),e+=p;break}case"(":{let[a,p]=y.prototype.createPattern(o,{skript:r,isOptional:!1});n.push(a),e+=p;break}case"[":{let[a,p]=y.prototype.createPattern(o,{skript:r,isOptional:!0});n.push(a),e+=p;break}case"<":{let[a,p]=M.prototype.createPattern(o);n.push(a),e+=p;break}default:{if(w.includes(s))break t;let[a,p]=S.prototype.createPattern(o);n.push(a),e+=p;break}}}return[new c(n),e]}matchPattern(t,{skript:r,patternNumber:n=-1}){let e=[],o=[],s=0,a;for(let p of this.elements){let u=t.substring(s);switch(!0){case p instanceof b:{a=p.matchPattern(u,{skript:r});break}case p instanceof y:{a=p.matchPattern(u,{skript:r,isOptional:p.isOptional});break}default:{a=p.matchPattern(u,{});break}}if(!a){if(p instanceof y&&p.isOptional)continue;return null}for(p instanceof b?e.push(...a.expressions):o.push(...a.regexes),s+=a.size;t.substring(s).startsWith(" ");)s++}return new m(s,o,e,n)}getKeywords(){return this.elements.filter(t=>t instanceof S).map(t=>t.value)}};var I=class{constructor(t,r){this.pattern=r;this.compiledPattern=k.prototype.createPattern(this.pattern,{skript:t,patternNumber:-1})[0]}static{i(this,"Pattern")}compiledPattern};var h=class{static{i(this,"SyntaxRegistration")}patterns;constructor(t){this.patterns=this.rawPatterns().map(r=>new I(t,r))}matchPattern(t,{skript:r}){for(let[n,{compiledPattern:e}]of Object.entries(this.patterns)){if(e.getKeywords().find(s=>!t.includes(s)))continue;let o=e.matchPattern(t,{skript:r,patternNumber:parseInt(n)});if(o)return o}return null}};var L=class c extends skriptWeb.Expression{static{i(this,"Document")}static Registration=class extends skriptWeb.SyntaxRegistration{static{i(this,"Registration")}rawPatterns(){return["document body"]}syntaxElement(){return c}initialize(t,r){return new c(t)}};getReturnType(){return Element}isSingle(){return!0}get(t){return[document.body]}toString(t){return"document body"}};var W=class c extends l{constructor(r,n){super(r);this.element=n}static{i(this,"TextContent")}static Registration=class extends h{static{i(this,"Registration")}rawPatterns(){return["text [content] of %element%","%element%'[s] text [content]"]}syntaxElement(){return c}initialize(r,n){return new c(r,n.expressions[0])}};getReturnType(){return String}isSingle(){return!0}get(r){return[this.element.get(r)[0].textContent]}acceptChange(r,n,e){return!0}change(r,n,e){let o=this.element.get(n)[0],s=e.get(n)[0];switch(r){case 0:{o.textContent=s;break}case 1:{o.textContent+=s;break}case 2:{o.textContent=o.textContent?.replaceAll(s,"")??"";break}case 3:{o.textContent="";break}}}toString(r){return`text content of ${this.element.get(r)[0]}`}};var z=class c extends l{constructor(r,n,e){super(r);this.type=n;this.child=e}static{i(this,"JSXElement")}static Registration=class extends h{static{i(this,"Registration")}rawPatterns(){return["\\<<[^\\>]+>\\>[%element%|%string%]\\</<[^\\>]+>\\>"]}syntaxElement(){return c}initialize(r,n){let[e,o]=n.regexes;if(e!==o)throw new Error(`Opening and closing tags don't match (<${e}>...</${o}>)`);let s=n.expressions.length===0?void 0:n.expressions[0];return new c(r,e,s)}};getReturnType(){return Element}isSingle(){return!0}get(r){let n=document.createElement(this.type),e=this.child?.get(r)[0];return e&&(typeof e=="string"?n.textContent=e:n.appendChild(e)),[n]}toString(r){let n=this.child?.get(r)[0]??"";return`<${this.type}>${n}</${this.type}>`}};var O=class c extends skriptWeb.Expression{constructor(r,n){super(r);this.type=n}static{i(this,"NewElement")}static Registration=class extends skriptWeb.SyntaxRegistration{static{i(this,"Registration")}rawPatterns(){return["[new] element (with|of) type %string%"]}syntaxElement(){return c}initialize(r,n){let e=n.expressions[0];return new c(r,e)}};getReturnType(){return Element}isSingle(){return!0}get(r){let n=this.type.get(r)[0];return[document.createElement(n)]}toString(r){return`new element of type ${this.type.get(r)[0]}`}};var $=class extends skriptWeb.SkriptExtension{static{i(this,"DOMExtension")}name="dom";onInitialize(){let{syntaxRegistry:t,skript:r}=this;r.types.registerType(Element,"element","elements").setAcceptChange((n,e,o)=>o?.isSingle()===!0).setChange((n,e,o,s)=>{let a=n.parentElement,p=s.get(o)[0];switch(console.log(s),console.log("Adding",p,"to",n),console.log(s.get(o)),e){case 0:{if(!a)return;let u=Array.from(a.children),g=Array.from(a.children).indexOf(n);a.replaceChildren(...u.slice(0,g),p,...u.slice(g+1));break}case 1:{n.appendChild(p);break}case 2:{n.removeChild(p);break}case 3:{if(!a)return;a.removeChild(n);break}}}),t.registerSyntaxElement(new W.Registration(r)),t.registerSyntaxElement(new O.Registration(r)),t.registerSyntaxElement(new L.Registration(r)),t.registerSyntaxElement(new z.Registration(r))}};var{Skript:D,CoreExtension:V,SimpleLogger:J,SkriptParser:X,LogLevel:K}=skriptWeb,x=new D;x.types.registerType(Object,"object","objects");x.types.registerType(String,"string","strings");x.types.registerType(Number,"number","numbers");x.types.registerType(Boolean,"boolean","booleans");x.extensions.registerExtension(V);x.extensions.registerExtension($);(async()=>{let t=(await(await fetch("/index.sk")).text()).replace(/\r\n/g,`
`);console.log(t);let r=new J,e=new X(x,t,r).parse();for(let{level:o,message:s}of r.entries)console.log(`${K[o]}: ${s}`);for(let o of e.structures)o.postLoad()})();
