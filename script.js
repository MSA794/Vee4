(function(){
  if(!localStorage.getItem('vee_data')){
    const initial = {
      users:[
        {id:1, username:'Vee', password:'411', accountNumber:'ADMIN001A', isAdmin:true, balance:1000, purchases:[]}
      ],
      sections:[
        {id:'terminal', name:'ترمكس', subsections:[
          {id:'basics', name:'اساسيات الترمكس', paid:false, price:0, content:'تعلم أساسيات الترمكس من الصفر...'},
          {id:'hacking', name:'اومر تجربت الاختراق', paid:false, price:0, content:'أوامر اختراق تم تجربتها وفحصها...'},
          {id:'premium', name:'اومر مدفوع', paid:true, price:50, content:'أفضل أوامر الترمكس المدفوعة والفعالة...'}
        ]},
        {id:'whatsapp', name:'واتساب', subsections:[
          {id:'reverse', name:'نسخة عكس', paid:false, price:0, content:'نسخة عكس محدثة وآمنة...'},
          {id:'numbers', name:'تطبيق ارقام', paid:false, price:0, content:'تطبيق لإدارة أرقام الواتساب...'},
          {id:'terms', name:'بنود واتساب', paid:false, price:0, content:'شرح بنود استخدام واتساب...'},
          {id:'bots', name:'بوتات', paid:true, price:30, content:'أفضل بوتات الواتساب...'}
        ]},
        {id:'facebook', name:'فيسبوك', subsections:[
          {id:'prepare', name:'إستعداد حساب فيسبوك', paid:false, price:0, content:'كيف تستعد لحساب فيسبوك جديد...'},
          {id:'followers', name:'رشق متابعين', paid:true, price:100, content:'طرق آمنة لزيادة المتابعين...'},
          {id:'delete', name:'طريقه إزالة حساب فيسبوك', paid:false, price:0, content:'الخطوات الصحيحة لإزالة حساب فيسبوك...'}
        ]},
        {id:'telegram', name:'تلجرم', subsections:[
          {id:'terminal-bot', name:'بوت تعليم الترمكس', paid:false, price:0, content:'بوت تفاعلي لتعليم الترمكس...'},
          {id:'reverse-bot', name:'بوت لي نسخة عكس', paid:true, price:25, content:'بوت الحصول على نسخة عكس...'},
          {id:'numbers-bot', name:'بوت ارقام فيك', paid:true, price:40, content:'بوت الحصول على أرقام...'},
          {id:'dev-bot', name:'بوت المطور', paid:true, price:200, content:'بوت المطور الكامل...'}
        ]},
        {id:'apps', name:'تطبيقات مجال', subsections:[
          {id:'app1', name:'تطبيق 1', paid:true, price:75, content:'تطبيق متقدم لإدارة الحسابات...'},
          {id:'app2', name:'تطبيق 2', paid:true, price:60, content:'تطبيق للتحكم في الأجهزة...'},
          {id:'app3', name:'تطبيق 3', paid:false, price:0, content:'تطبيق أساسي للمبتدئين...'}
        ]}
      ]
    };
    localStorage.setItem('vee_data', JSON.stringify(initial));
  }

  function store(){ return JSON.parse(localStorage.getItem('vee_data')); }
  function save(d){ localStorage.setItem('vee_data', JSON.stringify(d)); }

  function genAccount(users){
    const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let acc;
    do{
      const num = Math.floor(100 + Math.random()*900);
      const ch = letters.charAt(Math.floor(Math.random()*letters.length));
      acc = '12'+num+ch;
    }while(users.some(u=>u.accountNumber===acc));
    return acc;
  }

  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    const showRegister = document.getElementById('showRegister');
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const closeRegister = document.getElementById('closeRegister');

    showRegister.addEventListener('click', ()=>{ registerModal.classList.remove('hidden'); registerModal.classList.add('flex');});
    closeRegister.addEventListener('click', ()=>{ registerModal.classList.add('hidden'); registerModal.classList.remove('flex');});

    registerForm.addEventListener('submit', function(e){
      e.preventDefault();
      const username = document.getElementById('regUsername').value.trim();
      const password = document.getElementById('regPassword').value;
      if(!username || !password){ alert('الرجاء ملء الحقول'); return; }
      const d = store();
      if(d.users.some(u=>u.username.toLowerCase()===username.toLowerCase())){ alert('اسم المستخدم موجود'); return; }
      const acc = genAccount(d.users);
      const nu = {id:d.users.length+1, username, password, accountNumber:acc, isAdmin:false, balance:0, purchases:[]};
      d.users.push(nu); save(d);
      localStorage.setItem('vee_session', JSON.stringify({id:nu.id}));
      window.location='dashboard.html';
    });

    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      const d = store();
      const user = d.users.find(u=>u.username===username && u.password===password);
      if(!user){ alert('بيانات تسجيل الدخول غير صحيحة'); return; }
      localStorage.setItem('vee_session', JSON.stringify({id:user.id}));
      if(user.isAdmin) window.location='admin.html'; else window.location='dashboard.html';
    });
  }

  const session = JSON.parse(localStorage.getItem('vee_session') || 'null');
  const path = window.location.pathname.split('/').pop();

  if(!session && (path==='dashboard.html' || path==='admin.html')){ window.location='login.html'; }

  if(path==='dashboard.html'){
    const data = store();
    const user = data.users.find(u=>u.id===session.id);
    if(!user){ localStorage.removeItem('vee_session'); window.location='login.html'; }
    document.getElementById('dashUsername').innerText = user.username;
    document.getElementById('dashAccount').innerText = user.accountNumber;
    document.getElementById('dashBalance').innerText = (user.balance||0) + ' نقطة';

    const area = document.getElementById('sectionArea');
    area.innerHTML = '';
    data.sections.forEach(sec=>{
      const card = document.createElement('div'); card.className='p-4 bg-panel round';
      const title = document.createElement('h3'); title.className='font-bold text-yellow-200'; title.innerText = sec.name;
      card.appendChild(title);
      sec.subsections.forEach(sub=>{
        const row = document.createElement('div'); row.className='mt-2 flex justify-between items-center';
        const left = document.createElement('div'); left.innerHTML = `<div class="font-medium">${sub.name}</div><div class="text-yellow-400/70 text-sm">${sub.paid? 'مدفوع - '+sub.price+' نقطة' : 'مجاني'}</div>`;
        const btn = document.createElement('button'); btn.className='btn'; btn.innerText = 'فتح';
        btn.addEventListener('click', ()=>{
          const modal = document.createElement('div'); modal.className='fixed inset-0 bg-black/70 flex items-center justify-center p-4';
          const box = document.createElement('div'); box.className='bg-black/90 p-4 round max-w-xl w-full';
          box.innerHTML = `<h3 class="font-bold text-yellow-200">${sub.name}</h3><p class="mt-2 text-yellow-300">${sub.content}</p>`;
          if(sub.paid){
            const key = sec.id + '-' + sub.id;
            const purchased = (user.purchases||[]).includes(key);
            if(!purchased){
              const buyBtn = document.createElement('button'); buyBtn.className='mt-4 bg-green-600 px-3 py-2 rounded text-black'; buyBtn.innerText = 'شراء';
              buyBtn.addEventListener('click', ()=>{
                if((user.balance||0) < sub.price){ alert('رصيدك غير كافي'); return; }
                user.balance = (user.balance||0) - sub.price;
                user.purchases = (user.purchases||[]).concat([key]);
                const d = store(); const idx = d.users.findIndex(u=>u.id===user.id); d.users[idx]=user; save(d);
                document.getElementById('dashBalance').innerText = user.balance + ' نقطة';
                alert('تم الشراء بنجاح');
                document.body.removeChild(modal);
              });
              box.appendChild(buyBtn);
            } else {
              const ok = document.createElement('div'); ok.className='mt-4 text-green-400'; ok.innerText='تم الشراء - المحتوى متاح';
              box.appendChild(ok);
            }
          } else {
            const ok = document.createElement('div'); ok.className='mt-4 text-green-400'; ok.innerText='المحتوى مجاني ومتاح';
            box.appendChild(ok);
          }
          const close = document.createElement('button'); close.className='mt-4 ml-2 bg-gray-800 px-3 py-2 rounded'; close.innerText='إغلاق';
          close.addEventListener('click', ()=> document.body.removeChild(modal));
          box.appendChild(close);
          modal.appendChild(box); document.body.appendChild(modal);
        });
        row.appendChild(left); row.appendChild(btn);
        card.appendChild(row);
      });
      area.appendChild(card);
    });

    window.logout = function(){ localStorage.removeItem('vee_session'); window.location='login.html'; }
    window.addPoints = function(){
      const amt = parseFloat(prompt('أدخل عدد النقاط لإضافتها لنفسك:'));
      if(!amt || amt<=0) return alert('قيمة غير صحيحة');
      const d = store(); const idx = d.users.findIndex(u=>u.id===user.id); d.users[idx].balance = (d.users[idx].balance||0) + amt; save(d);
      document.getElementById('dashBalance').innerText = d.users[idx].balance + ' نقطة';
      alert('تمت الإضافة');
    }
  }

  if(path==='admin.html'){
    const data = store();
    const admin = data.users.find(u=>u.id===session.id && u.isAdmin);
    if(!admin){ localStorage.removeItem('vee_session'); window.location='login.html'; }
    document.getElementById('adminName').innerText = admin.username;
    document.getElementById('adminAccount').innerText = admin.accountNumber;
    document.getElementById('userCount').innerText = data.users.length;

    const content = document.getElementById('adminContent');
    function render(panel){
      if(panel === 'dashboard'){
        const totalUsers = data.users.length;
        const totalSections = data.sections.length;
        const totalPaid = data.sections.reduce((a,s)=>a + s.subsections.filter(x=>x.paid).length,0);
        const totalBalance = data.users.reduce((a,u)=>a + (u.balance||0),0);
        content.innerHTML = `<h2 class="text-xl font-bold mb-3">لوحة التحكم</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div class="p-3 bg-panel round">إجمالي المستخدمين<br><div class="font-bold text-yellow-300 text-2xl">${totalUsers}</div></div>
            <div class="p-3 bg-panel round">عدد الأقسام<br><div class="font-bold text-yellow-300 text-2xl">${totalSections}</div></div>
            <div class="p-3 bg-panel round">المحتوى المدفوع<br><div class="font-bold text-yellow-300 text-2xl">${totalPaid}</div></div>
            <div class="p-3 bg-panel round">إجمالي الرصيد<br><div class="font-bold text-yellow-300 text-2xl">${totalBalance}</div></div>
          </div>`;
      }
      if(panel === 'recharge'){
        content.innerHTML = `<h2 class="text-xl font-bold mb-3">شحن النقاط</h2>
          <form id="rechargeForm" class="space-y-3">
            <div><label class="text-sm">رقم الحساب</label><input id="rechargeAcc" class="w-full mt-1"/></div>
            <div><label class="text-sm">المبلغ (نقطة)</label><input id="rechargeAmt" type="number" class="w-full mt-1"/></div>
            <button class="btn" type="submit">شحن</button>
            <div id="rechMsg" class="text-sm mt-2"></div>
          </form>`;
        document.getElementById('rechargeForm').addEventListener('submit', function(e){
          e.preventDefault();
          const acc = document.getElementById('rechargeAcc').value.trim().toUpperCase();
          const amt = parseFloat(document.getElementById('rechargeAmt').value);
          if(!acc || !amt || amt<=0) return alert('املأ الحقول بشكل صحيح');
          const d = store(); const idx = d.users.findIndex(u=>u.accountNumber===acc);
          if(idx === -1) return alert('رقم الحساب غير موجود');
          d.users[idx].balance = (d.users[idx].balance||0) + amt; save(d);
          document.getElementById('rechMsg').innerText = 'تم الشحن';
          document.getElementById('userCount').innerText = d.users.length;
        });
      }
      if(panel === 'sections'){
        content.innerHTML = '<h2 class="text-xl font-bold mb-3">إدارة الأقسام</h2>';
        data.sections.forEach((sec, si)=>{
          const secDiv = document.createElement('div'); secDiv.className='bg-panel p-3 round mb-3';
          secDiv.innerHTML = `<div class="flex justify-between"><div><strong>${sec.name}</strong></div>
            <div><button class="px-2 py-1 bg-red-600 text-white" data-si="${si}">حذف قسم</button></div></div>`;
          sec.subsections.forEach((sub, idx)=>{
            const row = document.createElement('div'); row.className='mt-2 flex justify-between items-center';
            row.innerHTML = `<div><strong>${sub.name}</strong> <span class="text-yellow-400/80">${sub.paid? '('+sub.price+' نقطة)':''}</span></div>`;
            const actions = document.createElement('div');
            const edit = document.createElement('button'); edit.className='px-2 py-1 bg-yellow-600 text-black mr-2'; edit.innerText='تعديل';
            edit.addEventListener('click', ()=> {
              const newName = prompt('اسم الأداة', sub.name); if(newName) sub.name = newName;
              const newPaid = confirm('هل الأداة مدفوعة؟ (موافق = نعم)'); sub.paid = newPaid;
              if(sub.paid){ const p = parseFloat(prompt('السعر بالنقاط', sub.price||10)); if(!isNaN(p)) sub.price = p; } else sub.price = 0;
              const newContent = prompt('محتوى الأداة (نص موجز)', sub.content); if(newContent) sub.content = newContent;
              save(data); render('sections');
            });
            const del = document.createElement('button'); del.className='px-2 py-1 bg-red-600 text-white'; del.innerText='حذف';
            del.addEventListener('click', ()=>{ if(confirm('حذف الأداة؟')){ data.sections[si].subsections.splice(idx,1); save(data); render('sections'); }});
            actions.appendChild(edit); actions.appendChild(del);
            row.appendChild(actions); secDiv.appendChild(row);
          });
          const addBtn = document.createElement('button'); addBtn.className='mt-2 bg-green-600 px-3 py-2 text-black rounded'; addBtn.innerText='إضافة أداة';
          addBtn.addEventListener('click', ()=> {
            const name = prompt('اسم الأداة'); if(!name) return;
            const isPaid = confirm('هل ستكون مدفوعة؟'); let price = 0; if(isPaid) price = parseFloat(prompt('السعر بالنقاط', '10'))||0;
            const contentTxt = prompt('محتوى الأداة', 'محتوى جديد...')||'محتوى...';
            data.sections[si].subsections.push({id: 'sub'+Date.now(), name, paid:isPaid, price, content:contentTxt});
            save(data); render('sections');
          });
          secDiv.appendChild(addBtn);
          content.appendChild(secDiv);
        });
        const addSec = document.createElement('button'); addSec.className='mt-2 bg-blue-600 px-3 py-2 text-white rounded'; addSec.innerText='إضافة قسم جديد';
        addSec.addEventListener('click', ()=> {
          const name = prompt('اسم القسم'); if(!name) return;
          data.sections.push({id:'sec'+Date.now(), name, subsections:[]}); save(data); render('sections');
        });
        content.appendChild(addSec);
      }
      if(panel === 'users'){
        content.innerHTML = '<h2 class="text-xl font-bold mb-3">إدارة الحسابات</h2>';
        data.users.forEach((u, ui)=>{
          const box = document.createElement('div'); box.className='bg-panel p-3 round mb-2 flex justify-between items-center';
          box.innerHTML = `<div><div class="font-bold">${u.username} ${u.isAdmin?'<span class="text-yellow-300">(أدمن)</span>':''}</div><div class="text-yellow-400/70 font-mono">${u.accountNumber}</div></div>`;
          const actions = document.createElement('div');
          const del = document.createElement('button'); del.className='px-2 py-1 bg-red-600 text-white'; del.innerText='حذف';
          del.addEventListener('click', ()=> {
            if(u.id===1){ alert('لا يمكنك حذف الحساب الرئيسي'); return; }
            if(confirm('هل أنت متأكد من حذف الحساب؟')){ data.users.splice(ui,1); save(data); render('users'); document.getElementById('userCount').innerText = data.users.length; }
          });
          const makeAdmin = document.createElement('button'); makeAdmin.className='px-2 py-1 bg-yellow-600 text-black mr-2'; makeAdmin.innerText = u.isAdmin? 'إلغاء أدمن' : 'اجعل أدمن';
          makeAdmin.addEventListener('click', ()=>{
            data.users[ui].isAdmin = !data.users[ui].isAdmin; save(data); render('users');
          });
          const addBalance = document.createElement('button'); addBalance.className='px-2 py-1 bg-green-600 text-black mr-2'; addBalance.innerText='إضافة نقاط';
          addBalance.addEventListener('click', ()=> {
            const amt = parseFloat(prompt('كم نقطة؟')); if(!amt || amt<=0) return;
            data.users[ui].balance = (data.users[ui].balance||0) + amt; save(data); render('users');
          });
          actions.appendChild(addBalance); actions.appendChild(makeAdmin); actions.appendChild(del);
          box.appendChild(actions); content.appendChild(box);
        });
        const addBtn = document.createElement('button'); addBtn.className='mt-3 bg-purple-600 px-3 py-2 text-white rounded'; addBtn.innerText='إضافة حساب أدمن';
        addBtn.addEventListener('click', ()=> {
          const name = prompt('اسم الأدمن'); if(!name) return; const pwd = prompt('كلمة المرور للأدمن'); if(!pwd) return;
          const acc = genAccount(data.users); data.users.push({id:data.users.length+1, username:name, password:pwd, accountNumber:acc, isAdmin:true, balance:500, purchases:[]}); save(data); render('users'); document.getElementById('userCount').innerText = data.users.length;
        });
        content.appendChild(addBtn);
      }
    }

    document.querySelectorAll('button[data-panel]').forEach(btn=>{
      btn.addEventListener('click', ()=> render(btn.getAttribute('data-panel')));
    });

    render('dashboard');
    document.getElementById('adminLogout').addEventListener('click', ()=>{ localStorage.removeItem('vee_session'); window.location='login.html'; });
    window.logout = function(){ localStorage.removeItem('vee_session'); window.location='login.html'; }
  }

})();
