// Données initiales réalistes conformes à la démonstration vidéo du centre Omega
const teachers = [
  { _id: 't1', fullName: 'أستاذ عادل السعدي', subject: 'الرياضيات', phone: '0612345678', hourlyRate: 180, hoursPerWeek: 6, percentage: 50 },
  { _id: 't2', fullName: 'أستاذة خديجة بنجلون', subject: 'اللغة الإنجليزية', phone: '0623456789', hourlyRate: 150, hoursPerWeek: 4, percentage: 50 },
  { _id: 't3', fullName: 'أستاذ محمد العمراني', subject: 'الفيزياء والكيمياء', phone: '0634567890', hourlyRate: 180, hoursPerWeek: 5, percentage: 50 },
  { _id: 't4', fullName: 'أستاذة ليلى العلمي', subject: 'اللغة الفرنسية', phone: '0645678901', hourlyRate: 160, hoursPerWeek: 4, percentage: 50 },
  { _id: 't5', fullName: 'أستاذ رشيد الفاسي', subject: 'علوم الحياة والأرض', phone: '0656789012', hourlyRate: 160, hoursPerWeek: 4, percentage: 50 },
  { _id: 't6', fullName: 'أستاذ كمال الإدريسي', subject: 'الفلسفة', phone: '0667890123', hourlyRate: 140, hoursPerWeek: 3, percentage: 50 },
  { _id: 't7', fullName: 'أستاذة حنان المنصوري', subject: 'اللغة العربية', phone: '0678901234', hourlyRate: 140, hoursPerWeek: 3, percentage: 50 },
  { _id: 't8', fullName: 'أستاذ عبد الله التازي', subject: 'الرياضيات', phone: '0689012345', hourlyRate: 170, hoursPerWeek: 5, percentage: 50 },
  { _id: 't9', fullName: 'أستاذة إيمان بناني', subject: 'اللغة الفرنسية', phone: '0690123456', hourlyRate: 150, hoursPerWeek: 4, percentage: 50 },
  { _id: 't10', fullName: 'أستاذ يوسف اليعقوبي', subject: 'الفيزياء والكيمياء', phone: '0601234567', hourlyRate: 175, hoursPerWeek: 5, percentage: 50 },
  { _id: 't11', fullName: 'أستاذة فاطمة المرابط', subject: 'اللغة الإنجليزية', phone: '0611223344', hourlyRate: 150, hoursPerWeek: 4, percentage: 50 },
  { _id: 't12', fullName: 'أستاذ أنس الصنهاجي', subject: 'الإعلاميات والبرمجة', phone: '0622334455', hourlyRate: 200, hoursPerWeek: 4, percentage: 50 },
  { _id: 't13', fullName: 'أستاذ مراد البوعناني', subject: 'التاريخ والجغرافيا', phone: '0633445566', hourlyRate: 130, hoursPerWeek: 3, percentage: 50 },
  { _id: 't14', fullName: 'أستاذة سميرة الغازي', subject: 'التربية الإسلامية', phone: '0644556677', hourlyRate: 130, hoursPerWeek: 2, percentage: 50 },
  { _id: 't15', fullName: 'أستاذ طارق المتوكل', subject: 'الرياضيات', phone: '0655667788', hourlyRate: 180, hoursPerWeek: 4, percentage: 50 },
  { _id: 't16', fullName: 'أستاذة سناء الرحماني', subject: 'اللغة الإسبانية', phone: '0666778899', hourlyRate: 160, hoursPerWeek: 3, percentage: 50 },
  { _id: 't17', fullName: 'أستاذ عثمان الشاوي', subject: 'اللغة الألمانية', phone: '0677889900', hourlyRate: 170, hoursPerWeek: 3, percentage: 50 },
  { _id: 't18', fullName: 'أستاذ حمزة الوزاني', subject: 'علوم الحياة والأرض', phone: '0688990011', hourlyRate: 160, hoursPerWeek: 4, percentage: 50 },
  { _id: 't19', fullName: 'أستاذة أسماء القادري', subject: 'الفيزياء والكيمياء', phone: '0699001122', hourlyRate: 170, hoursPerWeek: 4, percentage: 50 },
  { _id: 't20', fullName: 'أستاذ رضوان الصقلي', subject: 'الاقتصاد والمحاسبة', phone: '0600112233', hourlyRate: 190, hoursPerWeek: 4, percentage: 50 },
  { _id: 't21', fullName: 'أستاذ كريم العراقي', subject: 'الرياضيات', phone: '0612233445', hourlyRate: 180, hoursPerWeek: 4, percentage: 50 },
  { _id: 't22', fullName: 'أستاذة مريم الشريف', subject: 'اللغة الفرنسية', phone: '0623344556', hourlyRate: 160, hoursPerWeek: 4, percentage: 50 }
];

// Noms pour générer les 200 élèves
const firstNames = ['سليمان', 'طارق', 'مريم', 'ياسين', 'فاطمة الزهراء', 'أمين', 'سلمى', 'أيوب', 'هبة', 'حمزة', 'خديجة', 'عمر', 'إيمان', 'أنس', 'سارة', 'وليد', 'رانيا', 'نبيل', 'نهيلة', 'مهدي', 'آية', 'سعد', 'دنيا', 'زياد', 'صفاء', 'إلياس', 'يسرى', 'بدر', 'كوثر', 'حسام'];
const lastNames = ['شكري', 'الحوجي', 'التازي', 'العلمي', 'الفاسي', 'الإدريسي', 'المنصوري', 'المرابط', 'بنجلون', 'بنعمر', 'الصنهاجي', 'اليعقوبي', 'الشاوي', 'الوزاني', 'الرحماني', 'القادري', 'الصقلي', 'العراقي', 'البوعناني', 'الشريف'];
const levels = ['البكالوريا - علوم فيزيائية', 'البكالوريا - علوم رياضية', 'البكالوريا - علوم اقتصادية', 'الأولى باك - علوم تجريبية', 'الثالثة إعدادي', 'الثانية إعدادي', 'الأولى إعدادي', 'السادس ابتدائي', 'دروس اللغات'];

const students = [];
const payments = [];

// Création de سليمان شكري (présent dans la vidéo avec le reçu N5601)
const soulaimane = {
  _id: 's1',
  fullName: 'سليمان شكري',
  level: 'البكالوريا',
  phone: '06283701609',
  monthlyFee: 500,
  subjects: [
    { subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', fee: 250 },
    { subject: 'اللغة الإنجليزية', teacher: 'أستاذة خديجة بنجلون', fee: 250 }
  ],
  status: 'active',
  departureReason: '',
  departureDate: null,
  registrationDate: new Date('2025-09-10'),
  notes: 'تلميذ مجتهد ومنضبط'
};
students.push(soulaimane);

payments.push({
  _id: 'p1',
  studentId: 's1',
  studentName: 'سليمان شكري',
  level: 'البكالوريا',
  phone: '06283701609',
  month: 'يناير 2026',
  totalDue: 500,
  amountPaid: 500,
  remaining: 0,
  status: 'paid',
  receiptNumber: 'N5601',
  paymentDate: new Date('2026-01-29'),
  notes: 'مؤدى بالكامل'
});

// Création de طارق الحوجي (présent dans la vidéo de gestion des absences)
const tarek = {
  _id: 's2',
  fullName: 'طارق الحوجي',
  level: 'الثالثة إعدادي',
  phone: '0631245678',
  monthlyFee: 400,
  subjects: [
    { subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', fee: 200 },
    { subject: 'الفيزياء والكيمياء', teacher: 'أستاذ محمد العمراني', fee: 200 }
  ],
  status: 'active',
  departureReason: '',
  departureDate: null,
  registrationDate: new Date('2025-09-15'),
  notes: ''
};
students.push(tarek);

payments.push({
  _id: 'p2',
  studentId: 's2',
  studentName: 'طارق الحوجي',
  level: 'الثالثة إعدادي',
  phone: '0631245678',
  month: 'يناير 2026',
  totalDue: 400,
  amountPaid: 400,
  remaining: 0,
  status: 'paid',
  receiptNumber: 'N5602',
  paymentDate: new Date('2026-01-20'),
  notes: ''
});

// Générer le reste jusqu'à 200 élèves (dont 190 payés et 10 non-payés/partiels, total ~37,000 DH comme dans la vidéo)
for (let i = 3; i <= 200; i++) {
  const fName = firstNames[(i * 3 + 7) % firstNames.length];
  const lName = lastNames[(i * 5 + 11) % lastNames.length];
  const fullName = `${fName} ${lName} ${i > 60 ? '(' + i + ')' : ''}`.trim();
  const level = levels[i % levels.length];
  const phone = `06${String(10000000 + i * 83719).slice(0, 8)}`;
  
  const t1 = teachers[i % teachers.length];
  const t2 = teachers[(i + 3) % teachers.length];
  const fee = (i % 3 === 0) ? 300 : (i % 2 === 0 ? 400 : 500);

  // 10 élèves sont en retard / impayés (ex: de 191 à 200)
  const isUnpaid = i >= 191;
  const isPartial = i >= 185 && i < 191;

  const s = {
    _id: `s${i}`,
    fullName,
    level,
    phone,
    monthlyFee: fee,
    subjects: [
      { subject: t1.subject, teacher: t1.fullName, fee: fee / 2 },
      { subject: t2.subject, teacher: t2.fullName, fee: fee / 2 }
    ],
    status: 'active',
    departureReason: '',
    departureDate: null,
    registrationDate: new Date(2025, 8, (i % 25) + 1),
    notes: ''
  };
  students.push(s);

  let status = 'paid';
  let amountPaid = fee;
  let remaining = 0;
  let receipt = `N${5600 + i}`;

  if (isUnpaid) {
    status = 'unpaid';
    amountPaid = 0;
    remaining = fee;
    receipt = '';
  } else if (isPartial) {
    status = 'partial';
    amountPaid = fee / 2;
    remaining = fee / 2;
  }

  payments.push({
    _id: `p${i}`,
    studentId: `s${i}`,
    studentName: fullName,
    level,
    phone,
    month: 'يناير 2026',
    totalDue: fee,
    amountPaid,
    remaining,
    status,
    receiptNumber: receipt,
    paymentDate: isUnpaid ? null : new Date(2026, 0, (i % 28) + 1),
    notes: isUnpaid ? 'لم يدفع بعد' : (isPartial ? 'دفع نصف المبلغ' : 'مؤدى بالكامل')
  });
}

// 4 élèves marqués comme "المغادرون" (Departed) pour la démo
const departedStudents = [
  {
    _id: 'dep1',
    fullName: 'يوسف العثماني',
    level: 'الأولى باك',
    phone: '0661123456',
    monthlyFee: 400,
    subjects: [{ subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', fee: 200 }],
    status: 'departed',
    departureReason: 'انتقال إلى مدينة أخرى',
    departureDate: new Date('2026-01-10'),
    registrationDate: new Date('2025-09-01'),
    notes: ''
  },
  {
    _id: 'dep2',
    fullName: 'نهى الصنهاجي',
    level: 'الثانية إعدادي',
    phone: '0662234567',
    monthlyFee: 300,
    subjects: [{ subject: 'اللغة الفرنسية', teacher: 'أستاذة ليلى العلمي', fee: 300 }],
    status: 'departed',
    departureReason: 'ظروف عائلية خاصة',
    departureDate: new Date('2026-01-14'),
    registrationDate: new Date('2025-09-05'),
    notes: ''
  }
];

// Dépenses du mois (Janvier 2026) -> Total 20,000 DH comme dans la vidéo
const expenses = [
  { _id: 'e1', title: 'إيجار مقر المركز - يناير', category: 'إيجار المركز', amount: 5000, month: 'يناير 2026', date: new Date('2026-01-02'), recipient: 'صاحب العمارة', notes: 'شيك رقم 45892' },
  { _id: 'e2', title: 'تسبيق أجور الأساتذة', category: 'أجور الأساتذة', amount: 10000, month: 'يناير 2026', date: new Date('2026-01-25'), recipient: 'أساتذة المركز', notes: 'دفعة شهر يناير' },
  { _id: 'e3', title: 'أجرة الاستقبال والنظافة', category: 'أجور العمال', amount: 3000, month: 'يناير 2026', date: new Date('2026-01-28'), recipient: 'موظفة الاستقبال وعامل النظافة', notes: '' },
  { _id: 'e4', title: 'فاتورة الكهرباء والماء', category: 'الماء والكهرباء', amount: 1000, month: 'يناير 2026', date: new Date('2026-01-15'), recipient: 'شركة رديدا', notes: 'شهر دجنبر' },
  { _id: 'e5', title: 'اشتراك الألياف البصرية إنترنت', category: 'اشتراك الإنترنت', amount: 500, month: 'يناير 2026', date: new Date('2026-01-05'), recipient: 'اتصالات المغرب', notes: '100 Mbps' },
  { _id: 'e6', title: 'شراء أقلام سبورة وأوراق طباعة', category: 'مصاريف أخرى', amount: 500, month: 'يناير 2026', date: new Date('2026-01-08'), recipient: 'مكتبة النجاح', notes: 'تجهيزات مكتبية' }
];

// Emploi du temps (Timetable)
const timetable = [
  { _id: 'tt1', subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', level: 'البكالوريا', day: 'الإثنين', startTime: '16:00', endTime: '18:00', room: 'قاعة 1', color: '#0f766e' },
  { _id: 'tt2', subject: 'الفيزياء والكيمياء', teacher: 'أستاذ محمد العمراني', level: 'البكالوريا', day: 'الإثنين', startTime: '18:15', endTime: '20:15', room: 'قاعة 2', color: '#0284c7' },
  { _id: 'tt3', subject: 'اللغة الفرنسية', teacher: 'أستاذة ليلى العلمي', level: 'الأولى باك', day: 'الثلاثاء', startTime: '17:00', endTime: '19:00', room: 'قاعة 3', color: '#7c3aed' },
  { _id: 'tt4', subject: 'اللغة الإنجليزية', teacher: 'أستاذة خديجة بنجلون', level: 'الثالثة إعدادي', day: 'الأربعاء', startTime: '15:00', endTime: '17:00', room: 'قاعة 1', color: '#d97706' },
  { _id: 'tt5', subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', level: 'الثالثة إعدادي', day: 'الأربعاء', startTime: '17:15', endTime: '19:15', room: 'قاعة 1', color: '#0f766e' },
  { _id: 'tt6', subject: 'علوم الحياة والأرض', teacher: 'أستاذ رشيد الفاسي', level: 'البكالوريا', day: 'الخميس', startTime: '16:00', endTime: '18:00', room: 'قاعة 2', color: '#059669' },
  { _id: 'tt7', subject: 'الفلسفة', teacher: 'أستاذ كمال الإدريسي', level: 'البكالوريا', day: 'الجمعة', startTime: '17:00', endTime: '19:00', room: 'قاعة 3', color: '#dc2626' },
  { _id: 'tt8', subject: 'الرياضيات مكثف', teacher: 'أستاذ عادل السعدي', level: 'البكالوريا', day: 'السبت', startTime: '10:00', endTime: '12:00', room: 'قاعة 1', color: '#0f766e' },
  { _id: 'tt9', subject: 'اللغة الإنجليزية محادثة', teacher: 'أستاذة خديجة بنجلون', level: 'لغات للكبار', day: 'السبت', startTime: '14:00', endTime: '16:00', room: 'قاعة 4', color: '#d97706' },
  { _id: 'tt10', subject: 'الفيزياء تمارين وحلول', teacher: 'أستاذ محمد العمراني', level: 'البكالوريا', day: 'الأحد', startTime: '09:00', endTime: '11:00', room: 'قاعة 2', color: '#0284c7' }
];

// Absences d'aujourd'hui (avec طارق الحوجي comme dans la vidéo)
const attendances = [
  { _id: 'a1', studentId: 's2', studentName: 'طارق الحوجي', level: 'الثالثة إعدادي', subject: 'الرياضيات', teacher: 'أستاذ عادل السعدي', phone: '0631245678', date: '2026-01-29', status: 'absent', reason: 'بدون عذر', notes: '' },
  { _id: 'a2', studentId: 's5', studentName: 'فاطمة الزهراء الفاسي', level: 'البكالوريا', subject: 'الفيزياء والكيمياء', teacher: 'أستاذ محمد العمراني', phone: '0612345678', date: '2026-01-29', status: 'absent', reason: 'شهادة طبية', notes: '' },
  { _id: 'a3', studentId: 's12', studentName: 'أمين الإدريسي', level: 'الأولى باك', subject: 'اللغة الفرنسية', teacher: 'أستاذة ليلى العلمي', phone: '0698765432', date: '2026-01-29', status: 'absent', reason: 'اتصال من الولي', notes: '' }
];

const settings = {
  centerName: 'مركز أوميغا للدعم والتقوية واللغات',
  subtitle: 'Centre Omega de Soutien Scolaire et Langues',
  phone: '0705782737',
  email: 'contact@centreomega.ma',
  address: 'شارع الحسن الثاني، العمارة 14، الطابق 2، الدار البيضاء / طنجة',
  receiptPrefix: 'N',
  defaultLanguage: 'ar',
  currency: 'درهم'
};

module.exports = {
  teachers,
  students: [...students, ...departedStudents],
  payments,
  expenses,
  timetable,
  attendances,
  settings
};
