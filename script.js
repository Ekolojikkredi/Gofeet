// Verileri saklamak için localStorage anahtarları
const STUDENT_KEY = 'students'; // Öğrenci verileri
const SCHOOL_KEY = 'schools'; // Okul verileri
const TOTAL_WASTE_KEY = 'totalWaste'; // Toplam atık sayacı

// Atık türleri ve puanları
const WASTE_TYPES = {
    plastik: 10,
    cam: 15,
    kağıt: 5,
    pil: 20,
    elektronik: 25,
    yağ: 30,
    tekstil: 8,
};

// Unvanlar
const TITLES = [
    { points: 0, title: "Başlangıç" },
    { points: 50, title: "Çevre Dostu" },
    { points: 100, title: "Doğa Kahramanı" },
    { points: 200, title: "Yeşil Savaşçı" },
    { points: 500, title: "Ekoloji Lideri" },
];

// LocalStorage'dan veri al ve yoksa varsayılan değeri ata
function getData(key, defaultValue) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

// LocalStorage'a veri kaydet
function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Toplam atık sayacını artır
function incrementTotalWaste(amount) {
    const currentTotal = getData(TOTAL_WASTE_KEY, 0);
    const newTotal = currentTotal + amount;
    saveData(TOTAL_WASTE_KEY, newTotal);
    updateTotalWasteDisplay(newTotal);
}

// Toplam atık sayaç ekranını güncelle
function updateTotalWasteDisplay(total) {
    const totalWasteElement = document.getElementById('total-waste');
    if (totalWasteElement) {
        totalWasteElement.textContent = `Toplam Atık: ${total} kg`;
    }
}

// Öğrenci kaydı
function registerStudent(studentData) {
    const students = getData(STUDENT_KEY, []);
    students.push(studentData);
    saveData(STUDENT_KEY, students);
}

// Okul kaydı
function registerSchool(schoolData) {
    const schools = getData(SCHOOL_KEY, []);
    schools.push(schoolData);
    saveData(SCHOOL_KEY, schools);
}

// Öğrenci verilerini al
function getStudentData(email, schoolNumber) {
    const students = getData(STUDENT_KEY, []);
    return students.find(student => student.email === email && student.schoolNumber === schoolNumber);
}

// Atık ekle
function addWaste(email, schoolNumber, wasteType, weight) {
    const students = getData(STUDENT_KEY, []);
    const student = students.find(student => student.email === email && student.schoolNumber === schoolNumber);

    if (student) {
        const points = WASTE_TYPES[wasteType] * weight;
        student.totalWaste = (student.totalWaste || 0) + weight;
        student.points = (student.points || 0) + points;
        student.wasteHistory = student.wasteHistory || [];
        student.wasteHistory.push({ wasteType, weight, points });

        saveData(STUDENT_KEY, students);
        incrementTotalWaste(weight);
        alert(`${points} puan kazandınız!`);
    } else {
        alert('Öğrenci bulunamadı.');
    }
}

// Unvanı güncelle
function getStudentTitle(points) {
    let title = TITLES[0].title; // Varsayılan unvan
    for (const t of TITLES) {
        if (points >= t.points) {
            title = t.title;
        }
    }
    return title;
}

// Tüm atık türlerini listele
function listWasteTypes() {
    return Object.keys(WASTE_TYPES).map(type => `${type} (${WASTE_TYPES[type]} puan)` ).join(', ');
}

// Arayüz: Toplam atık sayacını başlat
function initTotalWasteCounter() {
    const totalWaste = getData(TOTAL_WASTE_KEY, 0);
    updateTotalWasteDisplay(totalWaste);
}

// Öğrenci kayıt formu
function handleStudentRegistration(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const studentData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        schoolNumber: formData.get('schoolNumber'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        schoolName: formData.get('schoolName'),
        class: formData.get('class'),
        totalWaste: 0,
        points: 0,
        wasteHistory: [],
    };
    registerStudent(studentData);
    alert('Öğrenci başarıyla kayıt oldu!');
    event.target.reset();
}

// Okul kayıt formu
function handleSchoolRegistration(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const schoolData = {
        province: formData.get('province'),
        district: formData.get('district'),
        schoolName: formData.get('schoolName'),
        password: formData.get('password'),
    };
    registerSchool(schoolData);
    alert('Okul başarıyla kayıt oldu!');
    event.target.reset();
}

// Atık giriş formu
function handleWasteEntry(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const schoolNumber = formData.get('schoolNumber');
    const wasteType = formData.get('wasteType');
    const weight = parseFloat(formData.get('weight'));
    addWaste(email, schoolNumber, wasteType, weight);
    event.target.reset();
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    initTotalWasteCounter();

    // Form işleyicileri
    const studentForm = document.getElementById('student-form');
    const schoolForm = document.getElementById('school-form');
    const wasteForm = document.getElementById('waste-form');

    if (studentForm) studentForm.addEventListener('submit', handleStudentRegistration);
    if (schoolForm) schoolForm.addEventListener('submit', handleSchoolRegistration);
    if (wasteForm) wasteForm.addEventListener('submit', handleWasteEntry);
});
