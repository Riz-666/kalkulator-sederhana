// Daftar operasi: simbol yang ditampilkan sama fungsi hitungnya
const OPERASI = {
  tambah: { simbol: "+", hitung: (a, b) => a + b },
  kurang: { simbol: "\u2212", hitung: (a, b) => a - b },
  kali:   { simbol: "\u00d7", hitung: (a, b) => a * b },
  bagi:   { simbol: "\u00f7", hitung: (a, b) => a / b }
};

const jenis = document.body.dataset.operasi;
const form = document.getElementById("formHitung");
const inputA = document.getElementById("angkaPertama");
const inputB = document.getElementById("angkaKedua");
const kotakHasil = document.getElementById("hasil");
const btnReset = document.getElementById("btnReset");

// Ambil warna aksen halaman biar tombol SweetAlert match
function warnaAksen() {
  return getComputedStyle(document.body).getPropertyValue("--accent").trim();
}

// Format angka ke Indonesia terus buang selisih pecahan karna floating point
function formatAngka(n) {
  return Number(n.toFixed(10)).toLocaleString("id-ID", {
    maximumFractionDigits: 10
  });
}

function tampilkanPeringatan(judul, teks, ikon) {
  Swal.fire({
    icon: ikon,
    title: judul,
    text: teks,
    confirmButtonText: "Mengerti",
    confirmButtonColor: warnaAksen()
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const teksA = inputA.value.trim();
  const teksB = inputB.value.trim();

  // Validasi: kolom wajib diisi
  if (teksA === "" || teksB === "") {
    kotakHasil.classList.add("d-none");
    tampilkanPeringatan(
      "Input belum lengkap",
      "Isi angka pertama dan angka kedua sebelum menghitung.",
      "warning"
    );
    return;
  }

  const a = Number(teksA);
  const b = Number(teksB);

  // Validasi:  angka harus yang valid
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    kotakHasil.classList.add("d-none");
    tampilkanPeringatan(
      "Input tidak valid",
      "Gunakan angka saja pada kedua kolom.",
      "error"
    );
    return;
  }

  // Validasi: pembagian pake nol ga diperbolehkan
  if (jenis === "bagi" && b === 0) {
    kotakHasil.classList.add("d-none");
    tampilkanPeringatan(
      "Pembagian dengan nol",
      "Angka kedua tidak boleh 0 pada pembagian. Ganti dengan angka lain.",
      "error"
    );
    return;
  }

  const op = OPERASI[jenis];
  const hasil = op.hitung(a, b);

  kotakHasil.innerHTML =
    formatAngka(a) + " " + op.simbol + " " + formatAngka(b) +
    " = <span class=\"nilai\">" + formatAngka(hasil) + "</span>";
  kotakHasil.classList.remove("d-none");

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Perhitungan selesai",
    showConfirmButton: false,
    timer: 1800,
    timerProgressBar: false
  });
});

btnReset.addEventListener("click", function () {
  form.reset();
  kotakHasil.classList.add("d-none");
  inputA.focus();
});
