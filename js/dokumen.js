// // =====================================================
// // MANAJEMEN DOKUMEN
// // Analisis IAM Menggunakan Supabase
// // =====================================================


let currentUser = null;
let currentProfile = null;
let modeEdit = false;



function escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// -------------------------------
// Cek Session Login
// -------------------------------

async function cekSession() {

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {

        alert("Silakan login terlebih dahulu.");

        window.location.href = "index.html";

        return;
    }

    currentUser = data.user;

}

// -------------------------------
// Load Profile
// -------------------------------

async function loadProfile() {

    const { data, error } = await supabase

        .from("profiles")

        .select("*")

        .eq("id", currentUser.id)

        .single();

    if (error) {

        alert("Profil tidak ditemukan.");

        console.log(error);

        return;

    }

    currentProfile = data;

    document.getElementById("namaUser").textContent =
        data.nama;

    document.getElementById("emailUser").textContent =
        currentUser.email;

    document.getElementById("roleUser").textContent =
        data.role;

}

// -------------------------------
// Load Semua Dokumen
// -------------------------------

async function tampilDokumen() {

    const { data, error } = await supabase

        .from("dokumen")

        .select("*")

        .order("id");

    if (error) {

        alert(error.message);

        console.log(error);

        return;

    }

    let html = "";

    if (data.length == 0) {

        html = `

        <tr>

            <td colspan="4" class="text-center">

                Tidak ada dokumen.

            </td>

        </tr>

        `;

    }

    data.forEach((item, index) => {

        html += `

        <tr>

            <td>${index + 1}</td>

            <td>${escapeHTML(item.judul)}</td>

            <td>${escapeHTML(item.isi)}</td>

            <td>

                <button

                    class="btn btn-warning btn-sm"

                    onclick="editDokumen(${item.id})">

                    Edit

                </button>

                <button

                    class="btn btn-danger btn-sm"

                    onclick="hapusDokumen(${item.id})">

                    Hapus

                </button>

            </td>

        </tr>

        `;

    });

    document.getElementById("tabelDokumen").innerHTML = html;

}

// -------------------------------
// Load Halaman
// -------------------------------

async function loadPage() {

    await cekSession();

    await loadProfile();

    await tampilDokumen();

}

loadPage();

// ======================================================
// REFRESH DATA
// ======================================================

async function refreshData() {

    await tampilDokumen();

}

// ======================================================
// TAMBAH DOKUMEN
// ======================================================

async function tambahDokumen() {

    const judul = document.getElementById("judul").value.trim();
    const isi = document.getElementById("isi").value.trim();

    if (judul === "" || isi === "") {

        alert("Judul dan isi dokumen harus diisi.");

        return;

    }

    const btnSimpan = document.getElementById("btnSimpan");
    btnSimpan.disabled = true;

    const { error } = await supabase

        .from("dokumen")

        .insert({

            judul: judul,

            isi: isi,

            owner: currentUser.id

        });

    btnSimpan.disabled = false;

    if (error) {

        console.log(error);

        alert("Gagal menambahkan dokumen.\n" + error.message);

        return;

    }

    alert("Dokumen berhasil ditambahkan.");

    resetForm();

    tampilDokumen();

}

// ======================================================
// HAPUS DOKUMEN
// ======================================================

async function hapusDokumen(id) {

    const konfirmasi = confirm("Yakin ingin menghapus dokumen ini?");

    if (!konfirmasi) return;

    const { data, error } = await supabase

        .from("dokumen")

        .delete()

        .eq("id", id)

        .select();

    if (error) {

        console.log(error);

        alert("Gagal menghapus dokumen.\n" + error.message);

        return;

    }

    if (!data || data.length === 0) {

        alert("Dokumen tidak terhapus.\nPeriksa Policy RLS DELETE.");

        return;

    }

    alert("Dokumen berhasil dihapus.");

    // Jika sedang mengedit dokumen yang baru dihapus, reset form
    if (modeEdit && document.getElementById("dokumenId").value == id) {
        resetForm();
    }

    await tampilDokumen();

}

// ======================================================
// RESET FORM
// ======================================================

function resetForm() {

    modeEdit = false;

    document.getElementById("dokumenId").value = "";

    document.getElementById("judul").value = "";

    document.getElementById("isi").value = "";

    document.getElementById("btnSimpan").style.display = "inline-block";

    document.getElementById("btnUpdate").style.display = "none";

    document.getElementById("btnBatal").style.display = "none";

}

// ======================================================
// EVENT LISTENER
// ======================================================

document

    .getElementById("btnSimpan")

    .addEventListener("click", tambahDokumen);


document

    .getElementById("btnRefresh")

    .addEventListener("click", refreshData);


// ======================================================
// EDIT DOKUMEN
// ======================================================
async function editDokumen(id) {

    const { data, error } = await supabase

        .from("dokumen")

        .select("*")

        .eq("id", id)

        .single();

    if (error) {

        console.log(error);

        alert("Dokumen tidak ditemukan.");

        return;

    }

    modeEdit = true;

    document.getElementById("dokumenId").value = data.id;
    document.getElementById("judul").value = data.judul;
    document.getElementById("isi").value = data.isi;

    document.getElementById("btnSimpan").style.display = "none";
    document.getElementById("btnUpdate").style.display = "inline-block";
    document.getElementById("btnBatal").style.display = "inline-block";

}
// ======================================================
// UPDATE DOKUMEN
// ======================================================

async function updateDokumen() {

    console.log("Fungsi update dipanggil");

    try {

        const id = document.getElementById("dokumenId").value;
        const judul = document.getElementById("judul").value.trim();
        const isi = document.getElementById("isi").value.trim();

        if (!id) {

            alert("ID dokumen tidak ditemukan.");

            return;

        }

        if (judul === "" || isi === "") {

            alert("Judul dan isi dokumen harus diisi.");

            return;

        }

        console.log("ID :", id);
        console.log("Judul :", judul);
        console.log("Isi :", isi);

        const { data, error } = await supabase

            .from("dokumen")

            .update({

                judul: judul,
                isi: isi

            })

            .eq("id", Number(id))

            .select();

        console.log("HASIL UPDATE :", data);
        console.log("ERROR :", error);

        if (error) {

            alert("Update gagal.\n\n" + error.message);

            return;

        }

        if (!data || data.length === 0) {

            alert("Update ditolak.\nPeriksa Policy RLS UPDATE.");

            return;

        }

        alert("Dokumen berhasil diperbarui.");

        resetForm();

        await tampilDokumen();

    } catch (err) {

        console.error(err);

        alert("Terjadi kesalahan.");

    }

}
document
    .getElementById("btnUpdate")
    .addEventListener("click", updateDokumen);

document
    .getElementById("btnBatal")
    .addEventListener("click", resetForm);

// ======================================================
// HAPUS DOKUMEN
// ======================================================

async function hapusDokumen(id) {

    const konfirmasi = confirm("Apakah Anda yakin ingin menghapus dokumen ini?");

    if (!konfirmasi) {

        return;

    }

    try {

        const { data, error } = await supabase

            .from("dokumen")

            .delete()

            .eq("id", id)

            .select();

        console.log("DELETE :", data);
        console.log("ERROR :", error);

        if (error) {

            alert("Akses ditolak.\n\n" + error.message);

            return;

        }

        if (!data || data.length === 0) {

            alert("Dokumen tidak bisa di hapus. Hanya admin yang bisa menghapus dokumen.");

            return;

        }

        alert("Dokumen berhasil dihapus.");

        if (document.getElementById("dokumenId").value == id) {

            resetForm();

        }

        await tampilDokumen();

    }

    catch(err){

        console.log(err);

        alert("Terjadi kesalahan.");

    }

}


async function logout() {

    await supabase.auth.signOut();

    window.location.href = "index.html";

}

document

.getElementById("btnLogout")

.addEventListener("click", logout);