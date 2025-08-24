    // Particles background
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.size = Math.random()*3 + 1;
        this.speedX = (Math.random()-0.5)*0.5;
        this.speedY = (Math.random()-0.5)*0.5;
        this.color = ["#fff","#bbb","#FFD700"][Math.floor(Math.random()*3)];
      }
      update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.x<0 || this.x>canvas.width) this.speedX *= -1;
        if(this.y<0 || this.y>canvas.height) this.speedY *= -1;
      }
      draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle=this.color;
        ctx.fill();
      }
    }

    const particles=[];
    for(let i=0;i<80;i++) particles.push(new Particle());

    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{p.update();p.draw();});
      requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize',()=>{
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // باقي الكود: لغات + Validation + DOB
    const translations = {
      ar: {
        dir: "rtl", title: "نموذج التسجيل", name: "الاسم", email: "البريد الإلكتروني", phone: "رقم الهاتف", dob: "تاريخ الميلاد", password: "كلمة المرور", confirm: "تأكيد كلمة المرور", submit: "تسجيل", placeholders: {name: "اكتب اسمك", email: "example@mail.com", phone: "+20..."}, errors: {name: "الاسم مطلوب", email: "من فضلك اكتب إيميل صحيح", phone: "رقم هاتف غير صحيح", password: "كلمة المرور يجب أن تكون 6 أحرف على الأقل", confirm: "كلمة المرور غير متطابقة"}, age: years => `العمر: ${toArabicDigits(years)} سنة`},
      en: {
        dir: "ltr", title: "Registration Form", name: "Name", email: "Email", phone: "Phone", dob: "Date of Birth", password: "Password", confirm: "Confirm Password", submit: "Register", placeholders: {name: "Enter your name", email: "example@mail.com", phone: "+1..."}, errors: {name: "Name is required", email: "Please enter a valid email", phone: "Invalid phone number", password: "Password must be at least 6 characters", confirm: "Passwords do not match"}, age: years => `Age: ${years} years`},
      jp: {
        dir: "ltr", title: "登録フォーム", name: "名前", email: "メール", phone: "電話番号", dob: "生年月日", password: "パスワード", confirm: "パスワード確認", submit: "登録", placeholders: {name: "名前を入力", email: "example@mail.com", phone: "+81..."}, errors: {name: "名前が必要です", email: "有効なメールアドレスを入力してください", phone: "無効な電話番号", password: "パスワードは6文字以上でなければなりません", confirm: "パスワードが一致しません"}, age: years => `年齢: ${toJapaneseDigits(years)}歳`}
    };

    const form = document.getElementById('registerForm');
    const languageSelect = document.getElementById('language');

    function toArabicDigits(num){return num.toString().replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);}
    function toJapaneseDigits(num){return num.toString().replace(/[0-9]/g, d => '０１２３４５６７８９'[d]);}

    function applyLanguage(lang){
      const t = translations[lang];
      document.documentElement.dir = t.dir;
      document.getElementById('form-title').textContent = t.title;
      document.getElementById('label-name').textContent = t.name;
      document.getElementById('label-email').textContent = t.email;
      document.getElementById('label-phone').textContent = t.phone;
      document.getElementById('label-dob').textContent = t.dob;
      document.getElementById('label-password').textContent = t.password;
      document.getElementById('label-confirm').textContent = t.confirm;
      document.getElementById('submitBtn').textContent = t.submit;
      document.getElementById('name').placeholder = t.placeholders.name;
      document.getElementById('email').placeholder = t.placeholders.email;
      document.getElementById('phone').placeholder = t.placeholders.phone;
    }

    languageSelect.addEventListener('change', e => {applyLanguage(e.target.value); calcAge();});
    applyLanguage('ar');

    const daySelect = document.getElementById('day');
    for(let i=1;i<=31;i++) daySelect.innerHTML += `<option>${i}</option>`;
    const monthSelect = document.getElementById('month');
    for(let i=1;i<=12;i++) monthSelect.innerHTML += `<option>${i}</option>`;
    const yearSelect = document.getElementById('year');
    for(let i=2025;i>=1900;i--) yearSelect.innerHTML += `<option>${i}</option>`;

    function calcAge(){
      const d = daySelect.value, m = monthSelect.value, y = yearSelect.value;
      if(d && m && y){
        const birth = new Date(y, m-1, d);
        const diff = Date.now() - birth.getTime();
        const ageDate = new Date(diff);
        const years = ageDate.getUTCFullYear() - 1970;
        const lang = languageSelect.value;
        document.getElementById('age').textContent = translations[lang].age(years);
      }
    }
    daySelect.onchange = monthSelect.onchange = yearSelect.onchange = calcAge;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const lang = languageSelect.value;
      const t = translations[lang].errors;
      let valid = true;

      if(!name.value){document.getElementById('error-name').textContent = t.name;document.getElementById('error-name').style.display='block';valid=false;} else document.getElementById('error-name').style.display='none';
      if(!/^[^@]+@[^@]+\.[^@]+$/.test(email.value)){document.getElementById('error-email').textContent = t.email;document.getElementById('error-email').style.display='block';valid=false;} else document.getElementById('error-email').style.display='none';
      if(phone.value.length < 7){document.getElementById('error-phone').textContent = t.phone;document.getElementById('error-phone').style.display='block';valid=false;} else document.getElementById('error-phone').style.display='none';
      if(password.value.length < 6){document.getElementById('error-password').textContent = t.password;document.getElementById('error-password').style.display='block';valid=false;} else document.getElementById('error-password').style.display='none';
      if(confirm.value !== password.value){document.getElementById('error-confirm').textContent = t.confirm;document.getElementById('error-confirm').style.display='block';valid=false;} else document.getElementById('error-confirm').style.display='none';

      if(valid) alert('✅ Form Submitted Successfully!');
    });
