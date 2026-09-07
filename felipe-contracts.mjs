import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
let count=0;
function check(actual,expected,label){assert.deepEqual(actual,expected,label);count++;console.log('PASS',label);}
const assessment=await readFile('lib/felipe-assessment.ts','utf8');
const exp={};vm.runInNewContext(ts.transpileModule(assessment,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:exp});
const items=[...exp.listening.flatMap(p=>p.items),...exp.reading.flatMap(p=>p.items),...exp.language];
check(items.length,36,'36 objective items');
check(new Set(items.map(q=>q.id)).size,36,'unique response IDs');
check(items.every(q=>q.options.length===4&&q.answer>=0&&q.answer<4&&new Set(q.options).size===4),true,'valid distinct alternatives and answer keys');
check(exp.domainNames.length,6,'six communicative domains');
check(exp.writingTasks.length+exp.speakingTasks.length,6,'three written and three oral tasks');
check(exp.unanswered(exp.emptyEvidence()),36,'blank responses remain absent evidence');
const ev=exp.emptyEvidence();for(const q of items)ev.answers[q.id]=String(q.answer);
check(exp.unanswered(ev),0,'complete answers do not show missing');
check(exp.objectiveSummary(ev).every(s=>s.details.includes('A2: 4 respostas corretas')&&s.details.includes('B2: 4 respostas corretas')),true,'counts match keys without converting to proficiency');
const review=exp.emptyReview();
check(exp.validateReview(review)!==null,true,'cannot publish empty review');
check(exp.draftNarrative('Test',review).includes('Perfil parcial'),true,'missing domains explicitly reported');
for(const d of exp.domainNames)review.ratings[d].evidence='No sample; technical problem';
review.conditions='Supervised';review.plan='Collect new sample';review.narrative=exp.draftNarrative('Test',review);
check(exp.validateReview(review),null,'explicitly partial review can be published');

const edge=await readFile('supabase/functions/manage-personal-student/index.ts','utf8');
const javascript=ts.transpileModule(edge.replace(/^import .*;\n/m,''),{compilerOptions:{module:ts.ModuleKind.None,target:ts.ScriptTarget.ES2022}}).outputText;
let handler,mode='teacher',created=[],deleted=[],reset=[];
function builder(table){let filters={};return {select(){return this;},eq(k,v){filters[k]=v;return this;},async single(){
 if(table==='profiles')return {data:{role:mode==='student'?'student':'teacher'}};
 if(table==='students')return {data:filters.id==='foreign'?null:{id:'owned',auth_user_id:'student-auth'}};
 if(table==='personal_spaces')return {data:{username:'felipe'}};
 return {data:null};},async maybeSingle(){return {data:mode==='duplicate'?{student_id:'existing'}:null};}};}
const admin={from:builder,auth:{getUser:async(token)=>({data:{user:token==='valid'?{id:'teacher',is_anonymous:mode==='anonymous'}:null},error:null}),admin:{
 createUser:async(body)=>{created.push(body);return {data:{user:{id:'new-auth'}},error:null};},
 deleteUser:async(id)=>{deleted.push(id);return {error:null};},
 getUserById:async()=>({data:{user:{email:mode==='tampered'?'teacher@example.test':'felipe@students.fylab.invalid',app_metadata:{portal_student:mode!=='tampered'}}}}),
 updateUserById:async(id,body)=>{reset.push({id,body});return {error:null};},
 }},rpc:async()=>({data:mode==='link-error'?null:'new-student',error:mode==='link-error'?{}:null})};
vm.runInNewContext(javascript,{Deno:{serve:fn=>{handler=fn;},env:{get:()=> 'server-only'}},createClient:()=>admin,Response,Request});
const body={action:'create',name:'Felipe',username:'felipe',password:'fixture-password-only',consent:true};
async function call(data=body,token='valid',origin='https://gpaixaolab-cmyk.github.io'){return handler(new Request('https://example.test/function',{method:'POST',headers:{authorization:'Bearer '+token,origin},body:JSON.stringify(data)}));}
check((await call(body,'invalid')).status,401,'invalid token blocked');
mode='anonymous';check((await call()).status,401,'anonymous Auth account blocked');
mode='student';check((await call()).status,403,'student cannot create accounts');
mode='teacher';check((await call(body,'valid','https://other.example.test')).status,403,'foreign browser origin blocked');
check((await call({...body,consent:false})).status,400,'registration requires confirmed consent');
check(created.length,0,'rejected requests never use admin create');
check((await call()).status,200,'teacher creates linked account');
check(created[0].email,'felipe@students.fylab.invalid','username maps to internal alias');
check(created[0].email_confirm,true,'no mail is sent to a child or nonexistent mailbox');
mode='duplicate';check((await call()).status,409,'duplicate username rejected');
mode='link-error';check((await call()).status,400,'link failure reported');
check(deleted,['new-auth'],'link failure compensates only newly created account');
mode='teacher';check((await call({...body,action:'reset',studentId:'foreign'})).status,404,'cannot reset unrelated student');
mode='tampered';check((await call({...body,action:'reset',studentId:'owned'})).status,403,'tampered student link cannot reset a teacher account');
check(reset.length,0,'unauthorised resets never call Auth admin');
mode='teacher';check((await call({...body,action:'reset',studentId:'owned'})).status,200,'own linked student password reset accepted');
check(reset[0].id,'student-auth','reset targets verified student Auth ID');
console.log(`${count} contract checks passed. Auth admin responses were mocked; real deployment must be tested separately.`);
