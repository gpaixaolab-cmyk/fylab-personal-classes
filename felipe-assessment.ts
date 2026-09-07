export const EXAM_VERSION = 'felipe-diagnostic-v1';
export type Band = 'A2' | 'B1' | 'B2';
export type Item = { id: string; band: Band; question: string; options: string[]; answer: number; focus: string };
export type Passage = { id: string; title: string; text: string; items: Item[] };
const item = (id: string, band: Band, question: string, options: string[], answer: number, focus: string): Item => ({ id, band, question, options, answer, focus });

// Original pedagogical tasks. CEFR labels express target demand, not empirically calibrated item difficulty.
export const listening: Passage[] = [
  { id: 'l-a2', title: 'A change of plan', text: "Hi Sam, it's Alex. About tomorrow's cycling trip: the forecast says heavy rain until lunchtime, so let's not meet at nine as we planned. We can meet at the station café at one thirty instead. Don't bring lunch; I have sandwiches for both of us. Bring a rain jacket, though. If the weather doesn't improve, we can visit the science museum near the station. It closes at five. Please send me a message tonight so I know you heard this.", items: [
    item('l1','A2','Why has Alex changed the plan?',['The café is closed.','Rain is expected in the morning.','Sam has no bicycle.','The museum opens late.'],1,'reason'),
    item('l2','A2','Where and when should they meet?',['At the museum at nine.','At the station café at one thirty.','At the station at five.','At Alex’s house at lunchtime.'],1,'time and place'),
    item('l3','A2','What should Sam bring?',['Sandwiches for two.','A museum ticket.','A rain jacket.','A new bicycle.'],2,'practical detail'),
    item('l4','A2','What will they do if the rain continues?',['Go home immediately.','Cycle before lunch.','Meet the following day.','Visit the science museum.'],3,'conditional plan'),
  ]},
  { id: 'l-b1', title: 'Learning something new', text: "When I joined the community garden, I thought we'd just grow vegetables on Saturday mornings. At first I struggled because I didn't know which plants needed shade, and several of mine died. I was embarrassed to ask for help. Then an older volunteer told me that everyone makes those mistakes, and we started working together. Now I go twice a week. I still buy most of my food at the supermarket, so it hasn't really saved me money. What has changed is that I know people in my neighbourhood, and spending time outside helps me switch off after studying. Next month we're opening a small weekend workshop for beginners. I'll help organise it, although I'm not ready to teach everything myself.", items: [
    item('l5','B1','What made the beginning difficult?',['The garden was too far away.','The speaker lacked knowledge and hesitated to ask.','Volunteers refused to help.','The plants were too expensive.'],1,'cause and emotion'),
    item('l6','B1','What was the turning point?',['An experienced volunteer offered reassurance and support.','The speaker bought a different garden.','The supermarket closed.','The speaker stopped studying.'],0,'narrative sequence'),
    item('l7','B1','What is the main benefit now?',['Producing all their food.','Earning money by teaching.','Connecting with neighbours and relaxing.','Avoiding all mistakes.'],2,'main message versus distractor'),
    item('l8','B1','How does the speaker feel about the workshop?',['They will lead all the teaching.','They refuse to participate.','They think beginners are a problem.','They are willing to help but recognise their limits.'],3,'attitude'),
  ]},
  { id: 'l-b2', title: 'A proposal under discussion', text: "People have described our proposal to remove cars from the central square as anti-business. I understand why shop owners are worried: the construction period will be disruptive, and customers who cannot walk far need convenient access. Those are real concerns, not excuses to dismiss. However, evidence from the three towns we visited suggests that people often stay longer and spend more in pleasant pedestrian areas. That doesn't guarantee the same result here; our public transport is less reliable. So rather than introduce a permanent ban next month, I support a six-month trial on weekends, with accessible drop-off points and delivery hours before ten. We should compare sales and visitor numbers with the same months last year, not just collect enthusiastic comments on social media. If transport problems remain unresolved, extending the scheme would be premature.", items: [
    item('l9','B2','What is the speaker’s position?',['A permanent ban should start immediately.','The proposal should never be tested.','A limited trial is reasonable if access needs are addressed.','Shop owners should decide without evidence.'],2,'qualified position'),
    item('l10','B2','Why mention the three towns?',['To prove identical results are certain.','To offer promising evidence with a local limitation.','To show that transport never matters.','To criticise every local business.'],1,'evidence and qualification'),
    item('l11','B2','Why compare with the same months last year?',['To use a more meaningful baseline than online enthusiasm.','To avoid measuring visitor numbers.','To ensure that the result is positive.','To ignore changes in sales.'],0,'implicit rationale'),
    item('l12','B2','What could prevent extending the scheme?',['Delivery hours before ten.','A lack of positive social media comments.','A six-month trial.','Unresolved transport problems.'],3,'condition and implication'),
  ]},
];

export const reading: Passage[] = [
  { id: 'r-a2', title: 'An everyday message', text: "Hi Taylor,\nI've booked a room at the library for our project on Thursday, from 4 to 6 p.m. The entrance on Green Street is closed for repairs, so please use the door opposite the supermarket. You don't need a library card to join me, but bring your notes. I can bring my laptop; yours isn't necessary. If you're running late, text me rather than calling because calls aren't allowed in the study rooms. We must leave the room tidy before six.\nMorgan", items: [
    item('r1','A2','Why are Morgan and Taylor meeting?',['To repair a laptop.','To work on a project.','To buy a library card.','To visit a supermarket.'],1,'purpose'),
    item('r2','A2','Which entrance should Taylor use?',['The Green Street entrance.','Any entrance after six.','The door opposite the supermarket.','The staff entrance.'],2,'detail'),
    item('r3','A2','What must Taylor bring?',['A laptop.','A library card.','Cleaning equipment.','Project notes.'],3,'requirement'),
    item('r4','A2','What should Taylor do if delayed?',['Send a text.','Call from the study room.','Cancel the booking.','Wait until the next day.'],0,'instruction'),
  ]},
  { id: 'r-b1', title: 'A small experiment', text: "Last term, our study group tried keeping phones in a box during each forty-minute session. We expected everybody to concentrate better. During the first week, we finished more tasks, but one member missed an urgent message from home. Another needed an app to check unfamiliar words. We realised that a rule designed to help us could also create problems.\nWe changed the arrangement: phones stayed on the table, face down, and we agreed to explain when we needed to use one. We also added a five-minute break between sessions. After a month, members reported fewer interruptions, though we hadn't counted them carefully enough to prove how large the change was. The experiment wasn't a perfect scientific study, but it taught us to discuss our needs instead of assuming the same rule would work for everyone.", items: [
    item('r5','B1','What was the original aim?',['To improve concentration.','To sell phones.','To stop members communicating at home.','To test new vocabulary apps.'],0,'main idea'),
    item('r6','B1','Why was the first rule changed?',['Nobody completed any tasks.','There were legitimate reasons to use phones.','The box was too small.','The sessions became longer.'],1,'cause'),
    item('r7','B1','What limitation does the writer acknowledge?',['There were no members in the study group.','All participants disliked the change.','Interruptions were not measured precisely.','The experiment lasted only one day.'],2,'evidence limitation'),
    item('r8','B1','What did the group mainly learn?',['Technology is always harmful.','Strict rules never work.','Apps should replace discussion.','Rules should take different needs into account.'],3,'conclusion'),
  ]},
  { id: 'r-b2', title: 'Who benefits from convenience?', text: "A city recently replaced printed bus timetables with a real-time travel app. Officials celebrated shorter queues at information desks as proof of success. Yet that measure may tell us more about how the service is organised than about how easily residents can travel. Someone who cannot use the app may simply stop asking for help, rather than become more independent.\nThis is not an argument against digital services. Real-time information can be particularly useful when buses are delayed, and maintaining several systems has a cost. The issue is whether convenience for the majority is being treated as evidence of accessibility for everyone. A small interview project found that some residents relied on relatives to plan even routine trips. The sample was too small to establish how common this was, but the experiences deserve attention.\nBefore removing the remaining printed information, the city could test a combined approach in two districts. It should measure successful journeys, including those made by people with limited digital access, as well as operating costs. An innovation is not necessarily inclusive just because it is widely adopted.", items: [
    item('r9','B2','What assumption does the writer challenge?',['Printed timetables are always correct.','An app can never help travellers.','Fewer enquiries necessarily mean better access.','Costs are irrelevant to public services.'],2,'argument and assumption'),
    item('r10','B2','What role does the interview project play?',['It proves most residents cannot travel.','It raises a concern without establishing its prevalence.','It proves that all apps should be removed.','It provides a complete cost analysis.'],1,'strength of evidence'),
    item('r11','B2','What is the writer recommending?',['An immediate return to paper only.','The removal of every information desk.','A larger advertising campaign for the app.','A trial using both formats with broader evaluation.'],3,'synthesis'),
    item('r12','B2','Which statement best captures the conclusion?',['Popularity and inclusion are different things.','Innovation should always be avoided.','The cheapest option is necessarily fairest.','Minority needs make digital services impossible.'],0,'implicit meaning'),
  ]},
];

export const language: Item[] = [
  item('g1','A2','Yesterday we ___ to the park.',['go','went','have go','going'],1,'past simple'),
  item('g2','A2','There isn’t ___ milk left.',['many','a few','any','a'],2,'quantifiers'),
  item('g3','A2','This route is ___ than the other one.',['shorter','shortest','more short','as short'],0,'comparison'),
  item('g4','A2','I’m busy now. I ___ my homework.',['do','did','am doing','does'],2,'present continuous'),
  item('g5','B1','I ___ here since 2022.',['lived','am living','live','have lived'],3,'present perfect and since'),
  item('g6','B1','If the weather improves, we ___ outside.',['would eat','will eat','ate','have eaten'],1,'real conditional'),
  item('g7','B1','The person ___ helped me was a neighbour.',['who','which','where','whose'],0,'relative clause'),
  item('g8','B1','I used to ___ early, but now I study at night.',['studying','studied','study','studies'],2,'past habit'),
  item('g9','B2','If I had known about the delay, I ___ earlier.',['won’t leave','wouldn’t have left','didn’t leave','haven’t left'],1,'counterfactual past'),
  item('g10','B2','___ the limited budget, the team completed the project.',['Despite','Although','Because','Unless'],0,'concession'),
  item('g11','B2','The new policy is expected ___ next month.',['introducing','introduce','to be introduced','has introduced'],2,'passive reporting'),
  item('g12','B2','The evidence is promising, but it does not ___ a firm conclusion.',['take','do','make up','justify'],3,'collocation and stance'),
];

export const writingTasks = [
  { id:'w1',title:'Resolve a problem',target:'Interação escrita • A2–B1',guide:'80–120 palavras como orientação, não como critério de nível.',prompt:'You and a friend booked a workshop for Saturday. The organiser has moved it to Sunday, but you cannot attend then. Write an email to the organiser. Explain the problem, ask about two possible solutions and say what you would prefer and why.' },
  { id:'w2',title:'Make a case',target:'Produção escrita • B1–B2',guide:'150–200 palavras como orientação. Tente mesmo se precisar escrever menos.',prompt:'A learning centre wants to replace one weekly face-to-face meeting with an online meeting. Write a short article discussing one advantage and one disadvantage. Give an example, consider a different point of view and make a recommendation with reasons.' },
  { id:'m1',title:'Help someone understand',target:'Mediação escrita • B1–B2',guide:'60–100 palavras; selecione, explique e adapte. Não copie o texto.',prompt:'Your friend wants to join the event but finds the notice confusing. Write a simple message in English explaining the practical options and what your friend should do next.\n\nNOTICE: The community skills event is free, but advance registration is required by Tuesday. Participants under 16 need a responsible adult’s authorisation. The photography session has reached capacity; a waiting list is available, but a place cannot be guaranteed. The repair workshop still has places. Anyone requiring step-free access should contact the organiser before registering because the main entrance is temporarily closed; an alternative entrance can be arranged.' },
];
export const speakingTasks = [
  {id:'s1',title:'Your experience',target:'Narração • A2–B1',prompt:'Tell your teacher about a time you learned something difficult. What happened, what did you do and how did you feel? Include what you would do differently now.',guide:'1–2 minutos. Prepare palavras-chave, não um texto para ler.'},
  {id:'s2',title:'Explain your position',target:'Argumentação • B1–B2',prompt:'Some people prefer learning alone; others prefer learning with a group. Compare the two options, give reasons for your own preference and consider when the other option might be better.',guide:'2–3 minutos. O professor fará uma pergunta de acompanhamento.'},
  {id:'s3',title:'Negotiate a real decision',target:'Interação e reparo • B1–B2',prompt:'You and your teacher have three hours and a small budget to organise an activity for a group. Options: a museum visit, an outdoor challenge or a creative workshop. Ask about the group’s needs, compare options and agree on a plan. Your teacher will introduce a new constraint during the conversation.',guide:'4–6 minutos ao vivo. Não substitua a conversa por um monólogo.'},
];
export const teacherPrompts = [
  'S1: pergunte “What made that particularly difficult?” e depois “How would you help someone in the same situation?” Não ensaie respostas.',
  'S2: pergunte “What would you say to someone who disagrees?” Observe se adapta a resposta espontaneamente.',
  'S3: diga que o grupo tem interesses diferentes. Após a proposta inicial, revele chuva prevista e uma pessoa com dificuldade para caminhar longas distâncias. Peça alternativa, esclarecimento (“Could you explain what you mean?”) e resumo do acordo. Registre turnos, perguntas próprias, negociação e reparo. Não dê estruturas prontas.',
];
export const domainNames = ['Compreensão oral','Leitura','Produção escrita','Produção oral','Interação oral','Mediação'] as const;
export type Domain = typeof domainNames[number];
export type Rating = { band: 'Não avaliado' | 'Abaixo de A2 / investigar' | Band | 'Acima de B2 / investigar'; evidence: string; next: string };
export type Review = { ratings: Record<Domain,Rating>; conditions: string; strengths: string; priorities: string; plan: string; narrative: string; published: boolean };
export function emptyReview(): Review { return {ratings:Object.fromEntries(domainNames.map(name=>[name,{band:'Não avaliado',evidence:'',next:''}])) as Review['ratings'],conditions:'',strengths:'',priorities:'',plan:'',narrative:'',published:false}; }
export const rubricHints: Record<Domain,string> = {
 'Compreensão oral':'A2: detalhes previsíveis de mensagens curtas. B1: pontos principais e razões em fala clara sobre assuntos familiares. B2: acompanha argumento, atitude e ressalvas. Registre repetições, voz, ajuda e problemas técnicos.',
 'Leitura':'A2: informações explícitas em mensagens práticas. B1: sequência, razões e conclusões de textos diretos. B2: distingue posição, pressupostos e limites da evidência.',
 'Produção escrita':'Observe cumprimento da tarefa, clareza, organização, variedade e controle. A2: frases simples. B1: texto conectado com explicações. B2: argumento desenvolvido, registro adequado, contraponto e coesão. Extensão sozinha não define nível.',
 'Produção oral':'Observe inteligibilidade, fluência, coerência, alcance lexical e controle. A2: sequências curtas com apoio. B1: narra e explica com continuidade apesar de hesitações. B2: desenvolve argumentos com detalhes e flexibilidade. Sotaque não é erro por si só.',
 'Interação oral':'A2: trocas previsíveis com apoio. B1: mantém conversa familiar, pergunta e esclarece. B2: negocia, reage a imprevistos e sustenta posições com autonomia. Exige observação de conversa real.',
 'Mediação':'A2: retransmite informações simples. B1: seleciona pontos práticos e explica de modo acessível. B2: adapta informações, ressalvas e alternativas ao destinatário. Observe fidelidade sem cópia mecânica.',
};
export type Responses = Record<string,string>;
export type Evidence = { answers: Responses; texts: Responses; oral: Record<string,{path?:string;mode?:string;note?:string}>; plays: Record<string,number>; goals: string; technical: string; consent: boolean; audioConsent: boolean; live: boolean };
export function emptyEvidence(): Evidence { return {answers:{},texts:{},oral:{},plays:{},goals:'',technical:'',consent:false,audioConsent:false,live:false}; }
export function objectiveSummary(e: Evidence) {
 return [['Compreensão oral',listening.flatMap(p=>p.items)],['Leitura',reading.flatMap(p=>p.items)],['Recursos linguísticos',language]].map(([name,items])=>{
  const qs=items as Item[];
  return {name:name as string,details:(['A2','B1','B2'] as const).map(level=>{
   const group=qs.filter(q=>q.band===level), responded=group.filter(q=>e.answers[q.id]!==undefined),correct=group.filter(q=>e.answers[q.id]===String(q.answer));
   return `${level}: ${correct.length} respostas corretas em ${group.length} tarefas; ${responded.length} respondidas.`;
  }).join(' ')};
 });
}
export function draftNarrative(name: string, review: Review) {
 const missing=domainNames.filter(d=>review.ratings[d].band==='Não avaliado');
 return [`Parecer pedagógico de ${name}. ${missing.length ? 'Perfil parcial: ainda faltam evidências em '+missing.join(', ')+'.' : 'Perfil por habilidade, com referência aos descritores do CEFR.'}`,
  ...domainNames.map(d=>`${d}: ${review.ratings[d].band}. Evidências: ${review.ratings[d].evidence || 'Ainda não registradas.'} Próximo passo: ${review.ratings[d].next || 'A definir.'}`),
  `Condições da aplicação: ${review.conditions || 'Não registradas.'}`,
  `Pontos fortes: ${review.strengths || 'A confirmar.'}`,`Prioridades: ${review.priorities || 'A definir.'}`,`Plano das próximas aulas: ${review.plan || 'A definir.'}`,
  'Estimativa pedagógica, não certificação CEFR. As tarefas não foram calibradas estatisticamente; não há nota global nem conclusão automática por quantidade de palavras.'].join('\n\n');
}
export function validateReview(r: Review): string | null {
 if(domainNames.some(d=>!r.ratings[d]?.evidence?.trim())) return 'Registre evidências (ou a razão da ausência) para cada habilidade.';
 if(!r.conditions.trim()||!r.plan.trim()||!r.narrative.trim()) return 'Preencha condições, plano e parecer antes de publicar.';
 return null;
}
export function unanswered(e:Evidence){return [...listening.flatMap(p=>p.items),...reading.flatMap(p=>p.items),...language].filter(q=>e.answers[q.id]===undefined).length;}
