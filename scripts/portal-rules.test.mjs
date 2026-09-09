import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
const require = createRequire(path.join(process.env.PORTAL_TEST_TOOLS || process.cwd(), 'package.json'))
const { initializeTestEnvironment, assertSucceeds, assertFails } = require('@firebase/rules-unit-testing')
const { doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc, deleteDoc, writeBatch, serverTimestamp } = require('firebase/firestore')
let env, admin, a, b, anon
before(async () => {
  env = await initializeTestEnvironment({projectId:'demo-visualhq-portal',firestore:{host:'127.0.0.1',port:8088,rules:fs.readFileSync('firestore.rules','utf8')}})
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async ctx => {
    const db=ctx.firestore()
    const data={
      'users/admin':{role:'admin',clientId:'agency'}, 'users/client-a':{role:'client',clientId:'company-a'}, 'users/client-b':{role:'client',clientId:'company-b'},
      'organizations/company-a':{name:'Sample Studio',slug:'sample-studio'},
      'projects/p-a':{clientId:'company-a',title:'Brand website',status:'in-progress',description:'PRIVATE AGENCY NOTES'},
      'projects/p-b':{clientId:'company-b',title:'Other project',status:'in-progress'},
      'portalProjects/p-a':{clientId:'company-a',title:'Brand website',status:'in-progress',progress:30,dueDate:'2026-10-01',summary:'Your new website is taking shape.'},
      'portalProjects/p-b':{clientId:'company-b',title:'Other project'},
      'tasks/t-a':{clientId:'company-a',projectId:'p-a',name:'Approve homepage',content:'PRIVATE TASK NOTES',status:'todo'},
      'tasks/t-read':{clientId:'company-a',projectId:'p-a',name:'Agency task',content:'PRIVATE',status:'todo'},
      'portalTasks/t-a':{clientId:'company-a',projectId:'p-a',name:'Approve homepage',status:'todo',instructions:'Review the homepage draft.',assigneeUid:'client-a',dueDate:'2026-09-18'},
      'portalTasks/t-read':{clientId:'company-a',projectId:'p-a',name:'Agency task',status:'todo',instructions:'',assigneeUid:''},
      'comments/internal':{clientId:'company-a',taskId:'t-a',body:'Agency only'},
      'portalComments/feedback':{clientId:'company-a',taskId:'t-a',authorUid:'admin',authorName:'Agency',body:'Please review.'},
      'invoices/i-a':{clientId:'company-a',status:'sent',amount:100000,amountPaid:25000,currency:'NGN'},
      'invoices/i-b':{clientId:'company-b',status:'sent',amount:100000,currency:'USD'},
      'invoices/draft':{clientId:'company-a',status:'draft'},
      'contracts/c-a':{clientId:'company-a',status:'sent'},
      'estimates/e-a':{clientId:'company-a',status:'sent',shareEnabled:false},
      'estimates/e-public':{clientId:'company-b',status:'sent',shareEnabled:true},
      'documents/f-a':{clientId:'company-a',title:'Brand assets',url:'https://example.com/assets'},
      'documents/f-b':{clientId:'company-b',title:'Private B file'},
    }
    for(const [name,value] of Object.entries(data)) await setDoc(doc(db,name),value)
  })
  admin=env.authenticatedContext('admin').firestore(); a=env.authenticatedContext('client-a').firestore(); b=env.authenticatedContext('client-b').firestore(); anon=env.unauthenticatedContext().firestore()
})
after(async()=>{await env?.cleanup()})

test('clients read only their own published portal projections, not agency source notes',async()=>{
  await assertSucceeds(getDocs(query(collection(a,'portalProjects'),where('clientId','==','company-a'))))
  await assertSucceeds(getDocs(query(collection(a,'portalTasks'),where('clientId','==','company-a'),where('projectId','==','p-a'))))
  await assertFails(getDoc(doc(b,'portalProjects/p-a')))
  await assertFails(getDoc(doc(anon,'portalProjects/p-a')))
  await assertFails(getDoc(doc(a,'projects/p-a')))
  await assertFails(getDoc(doc(a,'tasks/t-a')))
  await assertFails(getDoc(doc(a,'comments/internal')))
  await assertSucceeds(getDoc(doc(admin,'projects/p-a')))
})
test('assigned client can complete both task records atomically, with no other edits',async()=>{
  const batch=writeBatch(a); for(const col of ['tasks','portalTasks'])batch.update(doc(a,col,'t-a'),{status:'done',updatedAt:serverTimestamp()})
  await assertSucceeds(batch.commit())
  assert.equal((await getDoc(doc(admin,'tasks/t-a'))).data().status,'done')
  await assertFails(updateDoc(doc(a,'portalTasks/t-a'),{name:'Changed',updatedAt:serverTimestamp()}))
  await assertFails(updateDoc(doc(a,'tasks/t-a'),{content:'Changed'}))
  await assertFails(updateDoc(doc(a,'portalTasks/t-read'),{status:'done',updatedAt:serverTimestamp()}))
  await assertFails(deleteDoc(doc(a,'projects/p-a')))
  await assertFails(setDoc(doc(a,'projects/new'),{clientId:'company-a'}))
  await assertFails(updateDoc(doc(b,'portalTasks/t-a'),{status:'todo',updatedAt:serverTimestamp()}))
})
test('feedback is company and parent scoped, with author and field validation',async()=>{
  await assertSucceeds(getDocs(query(collection(a,'portalComments'),where('clientId','==','company-a'),where('taskId','==','t-a'))))
  const feedback={clientId:'company-a',taskId:'t-a',authorUid:'client-a',authorName:'Client',body:'Looks good',createdAt:serverTimestamp()}
  await assertSucceeds(setDoc(doc(a,'portalComments/new'),feedback))
  await assertFails(setDoc(doc(b,'portalComments/attack'),{...feedback,authorUid:'client-b'}))
  await assertFails(setDoc(doc(a,'portalComments/forged'),{...feedback,authorUid:'admin'}))
  await assertFails(setDoc(doc(a,'portalComments/missing'),{...feedback,taskId:'missing'}))
})
test('finance lists are company-scoped while old issued document links remain public',async()=>{
  await assertSucceeds(getDocs(query(collection(a,'invoices'),where('clientId','==','company-a'),where('status','!=','draft'))))
  await assertFails(getDocs(collection(anon,'invoices')))
  await assertFails(getDocs(query(collection(a,'invoices'),where('clientId','==','company-b'),where('status','!=','draft'))))
  await assertSucceeds(getDoc(doc(anon,'invoices/i-a')))
  await assertSucceeds(getDoc(doc(anon,'contracts/c-a')))
  await assertFails(getDoc(doc(anon,'invoices/draft')))
  await assertFails(getDoc(doc(a,'invoices/draft')))
  await assertFails(updateDoc(doc(a,'invoices/i-a'),{amount:0}))
})
test('estimate acceptance is allowed only for the owner or an existing public share',async()=>{
  await assertFails(getDoc(doc(b,'estimates/e-a')))
  await assertFails(getDoc(doc(anon,'estimates/e-a')))
  await assertFails(updateDoc(doc(b,'estimates/e-a'),{status:'accepted',acceptedAt:serverTimestamp(),updatedAt:serverTimestamp()}))
  await assertSucceeds(updateDoc(doc(a,'estimates/e-a'),{status:'accepted',acceptedAt:serverTimestamp(),updatedAt:serverTimestamp()}))
  await assertSucceeds(updateDoc(doc(anon,'estimates/e-public'),{status:'accepted',acceptedAt:serverTimestamp(),updatedAt:serverTimestamp()}))
})
test('files and memberships cannot be accessed or reassigned across companies',async()=>{
  await assertSucceeds(getDoc(doc(a,'documents/f-a')))
  await assertFails(getDoc(doc(b,'documents/f-a')))
  await assertFails(updateDoc(doc(a,'users/client-a'),{clientId:'company-b'}))
  await assertFails(updateDoc(doc(a,'users/client-a'),{role:'admin'}))
  await assertFails(deleteDoc(doc(a,'users/client-a')))
})
test('unsharing a project revokes its task and feedback access',async()=>{
  await assertSucceeds(deleteDoc(doc(admin,'portalProjects/p-a')))
  await assertFails(getDoc(doc(a,'portalTasks/t-a')))
  await assertFails(getDoc(doc(a,'portalComments/feedback')))
})
