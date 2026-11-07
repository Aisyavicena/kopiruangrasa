// ===== Nomor WhatsApp admin (ganti di sini kalau nomornya berubah) =====
// Awali 62, tanpa 0, tanpa +, tanpa spasi atau tanda hubung
var nomorWA = "628988247901";

// ===== 1. Menu garis 3 (HP) =====
function bukaMenu() {
  var menu = document.getElementById("menu");
  menu.classList.toggle("buka");
}

// ===== 2. Jam di tulisan berjalan =====
function tambahNol(angka) {
  if (angka < 10) {
    return "0" + angka;
  }
  return angka;
}

function tampilJam() {
  var tempat = document.getElementById("jam");
  if (tempat != null) {
    var sekarang = new Date();
    var jam = tambahNol(sekarang.getHours());
    var menit = tambahNol(sekarang.getMinutes());
    var detik = tambahNol(sekarang.getSeconds());
    tempat.innerHTML = jam + ":" + menit + ":" + detik;
  }
}

setInterval(tampilJam, 1000);
tampilJam();

// ===== 3. Mengubah angka jadi tulisan rupiah =====
function rupiah(angka) {
  return "Rp" + angka.toLocaleString("id-ID");
}

// ===== 4. Popup di halaman Galeri =====
function lihatDetail(elemen) {
  document.getElementById("detail-gambar").src = elemen.getElementsByTagName("img")[0].src;
  document.getElementById("detail-nama").innerHTML = elemen.getElementsByTagName("h3")[0].innerHTML;
  document.getElementById("detail-deskripsi").innerHTML = elemen.getElementsByClassName("deskripsi")[0].innerHTML;
  document.getElementById("popup").style.display = "flex";
}

function tutupDetail() {
  document.getElementById("popup").style.display = "none";
}

// ===== 5. Popup pilihan menu di halaman Pesan =====
var keranjang = [];
var menuTerpilih = { nama: "", h200: 0, h1l: 0 };

function pilihMenu(elemen, harga200, harga1liter) {
  var nama = elemen.getElementsByTagName("h3")[0].innerHTML;
  menuTerpilih = { nama: nama, h200: harga200, h1l: harga1liter };

  document.getElementById("p-gambar").src = elemen.getElementsByTagName("img")[0].src;
  document.getElementById("p-nama").innerHTML = nama;
  document.getElementById("p-deskripsi").innerHTML = elemen.getElementsByClassName("deskripsi")[0].innerHTML;
  document.getElementById("p-h200").innerHTML = rupiah(harga200);
  document.getElementById("p-h1l").innerHTML = rupiah(harga1liter);

  // kembalikan pilihan ke awal
  document.getElementById("ukuran-200").checked = true;
  document.getElementById("extra-shot").checked = false;
  document.getElementById("oat-milk").checked = false;
  document.getElementById("p-jumlah").value = 1;

  hitungHarga();
  document.getElementById("popup-pesan").style.display = "flex";
}

function tutupPesan() {
  document.getElementById("popup-pesan").style.display = "none";
}

// harga satu gelas (sudah termasuk ukuran dan custom)
function hargaSatuan() {
  var harga = menuTerpilih.h200;
  if (document.getElementById("ukuran-1l").checked) {
    harga = menuTerpilih.h1l;
  }
  if (document.getElementById("extra-shot").checked) {
    harga = harga + 2000;
  }
  if (document.getElementById("oat-milk").checked) {
    harga = harga + 5000;
  }
  return harga;
}

function hitungHarga() {
  var jumlah = Number(document.getElementById("p-jumlah").value);
  if (jumlah < 1) {
    jumlah = 1;
  }
  document.getElementById("p-total").innerHTML = "Total: " + rupiah(hargaSatuan() * jumlah);
}

function tambahDariPopup() {
  var jumlah = Number(document.getElementById("p-jumlah").value);
  if (jumlah < 1) {
    alert("Jumlah minimal 1");
    return;
  }

  var keterangan = "200 ml";
  if (document.getElementById("ukuran-1l").checked) {
    keterangan = "1 liter";
  }
  if (document.getElementById("extra-shot").checked) {
    keterangan = keterangan + ", Extra Shot";
  }
  if (document.getElementById("oat-milk").checked) {
    keterangan = keterangan + ", Oat Milk";
  }

  keranjang.push({
    menu: menuTerpilih.nama,
    nama: menuTerpilih.nama + " (" + keterangan + ")",
    harga: hargaSatuan(),
    jumlah: jumlah
  });

  tampilkan();
  tutupPesan();
}

// ===== 6. Keranjang =====
function tampilkan() {
  var teks = "";
  var total = 0;
  var banyak = 0;
  var namaMenu = "";

  for (var i = 0; i < keranjang.length; i++) {
    var k = keranjang[i];
    teks = teks + "<li>" + k.jumlah + "x " + k.nama + "</li>";
    total = total + k.harga * k.jumlah;
    banyak = banyak + k.jumlah;

    if (i > 0) {
      namaMenu = namaMenu + ", ";
    }
    namaMenu = namaMenu + k.menu;
  }

  document.getElementById("daftar").innerHTML = teks;
  document.getElementById("total").innerHTML = "Total: " + rupiah(total);
  document.getElementById("jumlah-keranjang").innerHTML = banyak;
  document.getElementById("bar-jumlah").innerHTML = banyak + " item";
  document.getElementById("bar-menu").innerHTML = namaMenu;
  document.getElementById("bar-harga").innerHTML = rupiah(total);

  if (banyak > 0) {
    document.body.classList.add("ada-pesanan");
  } else {
    document.body.classList.remove("ada-pesanan");
  }
}

function kosongkan() {
  keranjang = [];
  tampilkan();
}

function bukaKeranjang() {
  document.getElementById("panel-keranjang").classList.toggle("buka");
}

function tutupKeranjang() {
  document.getElementById("panel-keranjang").classList.remove("buka");
}

// ===== 7. Kirim pesanan ke WhatsApp =====
function kirimWA() {
  var nama = document.getElementById("nama-pemesan").value;

  if (keranjang.length == 0) {
    alert("Keranjang masih kosong nih");
    return;
  }
  if (nama == "") {
    alert("Isi nama dulu ya, pintar");
    return;
  }

  var pesan = "Hi Kopi Ruang Rasa! Aku " + nama + " mau pesan ini:\n";
  var total = 0;
  for (var i = 0; i < keranjang.length; i++) {
    var k = keranjang[i];
    pesan = pesan + "- " + k.jumlah + "x " + k.nama + "\n";
    total = total + k.harga * k.jumlah;
  }
  pesan = pesan + "Total: " + rupiah(total);

  window.open("https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(pesan));
}

// ===== 8. Kirim form Kontak ke WhatsApp =====
function kirimKontak() {
  var nama = document.getElementById("nama").value;
  var email = document.getElementById("email").value;
  var institusi = document.getElementById("institusi").value;
  var isiPesan = document.getElementById("pesan").value;

  if (nama == "" || isiPesan == "") {
    alert("Nama dan pesan wajib diisi ya, manis");
    return;
  }

  var teks = "Halo Kopi Ruang Rasa,\n";
  teks = teks + "Nama: " + nama + "\n";
  teks = teks + "Email: " + email + "\n";
  teks = teks + "Institusi: " + institusi + "\n";
  teks = teks + "Pesan: " + isiPesan;

  window.open("https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(teks));
}